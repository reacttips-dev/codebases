/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/* eslint eqeqeq:0 */
const { ApiError } = require('app/scripts/network/api-error');
const { Auth } = require('app/scripts/db/auth');
const Backbone = require('@trello/backbone');
const { Batcher } = require('app/scripts/network/rpc/batcher');
const { Monitor } = require('app/scripts/lib/monitor');
const BluebirdPromise = require('bluebird');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const { syncError } = require('app/scripts/debug/sync-error');
const { Analytics } = require('@trello/atlassian-analytics');
const { showFlag } = require('@trello/nachos/experimental-flags');

const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');

const RpcError = makeErrorEnum('RPC', ['SyncError', 'BatchError']);

const tryParseJSON = function (str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};

const LIMIT_FOR_FAILED_POLLING = 120000;

// Here we use polling instead of any socket or Comet-style interaction, so we have to fake out
// anything that relies on server push (e.g. subscription).
class AjaxRPC {
  constructor(delegate) {
    this.delegate = delegate;
    this.idBoardToPoll = null;
    this.modelIxUpdate = {};
    this.pollRequestFailures = 0;
    this.timeOfFirstFailedPoll = null;
    this.msPoll = 5000;
    this.msPollIdle = 20000;
    this.ajaxSessionId = Math.random().toString().substring(2);
    while (this.ajaxSessionId.length < 16) {
      this.ajaxSessionId += '0';
    }

    this.consecutiveFailures = 0;
    this.consecutiveFailuresAllowed = 300;

    this.totalFailures = 0;
    this.totalFailuresAllowed = 1000;
  }

  subscribe(modelType, idModel, tags, next) {
    return typeof next === 'function' ? next() : undefined;
  }

  unsubscribe(modelType, idModel, next) {
    return typeof next === 'function' ? next() : undefined;
  }

  _getPollLength() {
    const basePollingInternal =
      Auth.isLoggedIn() && Monitor.getStatus() === 'active'
        ? this.msPoll
        : this.msPollIdle;

    return Math.min(
      this.pollRequestFailures === 0
        ? basePollingInternal
        : basePollingInternal * Math.pow(2, this.pollRequestFailures),
      60000,
    );
  }

  stopPolling() {
    if (this._pollingTimeout != null) {
      clearTimeout(this._pollingTimeout);
      return delete this._pollingTimeout;
    }
  }

  poll() {
    return (this._pollingTimeout = setTimeout(
      () => {
        if (
          this.consecutiveFailures >= this.consecutiveFailuresAllowed ||
          this.totalFailures >= this.totalFailuresAllowed
        ) {
          this.trigger('connect_failed');
          return;
        }

        return this.doPoll((err) => {
          if (err != null) {
            if (err === 'syncError') {
              // Stop polling; we're currently requesting a refresh
              return;
            }
            this.trigger('connecting');
            ++this.consecutiveFailures;
            ++this.totalFailures;
          } else {
            if (this.consecutiveFailures > 0) {
              this.trigger('reconnect');
            }
            this.consecutiveFailures = 0;
          }

          if (this._pollingTimeout != null) {
            return this.poll();
          }
        });
      },

      this._getPollLength(),
    ));
  }

  // SocketRPC uses doPoll to sync up after it loses its connection, and thus
  // needs to override the models to poll for and be the Backbone event emitter
  // for the response messages. It would be nice to restructure this.
  doPoll(...args) {
    let idModel;
    const adjustedLength = Math.max(args.length, 1),
      [idModels, messageHandlerArg] = args.slice(0, adjustedLength - 1),
      next = args[adjustedLength - 1];
    const subscriptions = [];
    const messageHandler =
      typeof messageHandlerArg === 'undefined' || messageHandlerArg === null
        ? this
        : messageHandlerArg;
    if (_.isArray(idModels)) {
      for (idModel of idModels) {
        subscriptions.push(this.delegate.currentSubscriptions[idModel]);
      }
    } else if (typeof idModels === 'undefined' || idModels === null) {
      for (idModel in this.delegate.currentSubscriptions) {
        const subscription = this.delegate.currentSubscriptions[idModel];
        subscriptions.push(subscription);
      }
    } else {
      return;
    }

    if (!_.isEmpty(subscriptions)) {
      return this._doPoll(subscriptions, messageHandler, next);
    } else {
      return typeof next === 'function' ? next() : undefined;
    }
  }

  _doPoll(subscriptions, messageHandler, next) {
    const batcher = new Batcher({
      headers: { 'X-Trello-Polling': true },
    });

    const batchRequests = subscriptions.map(
      ({ modelType, idModel, ixLastUpdate, tags }) => {
        const url =
          `/${modelType}/${idModel}/deltas` +
          '?ixLastUpdate=' +
          encodeURIComponent(ixLastUpdate.toString()) +
          '&tags=' +
          encodeURIComponent(tags.join(','));
        return batcher
          .request(url)
          .tap((res) => {
            if (res.syncError != null) {
              return BluebirdPromise.reject(RpcError.SyncError(res.syncError));
            }

            this.delegate.setIxLastUpdate(idModel, res.modelIxUpdate[idModel]);

            _.chain(res.messages != null ? res.messages : [])
              .map(tryParseJSON)
              .compact()
              .forEach(({ notify, idModelChannel }) => {
                messageHandler.trigger(
                  notify.event,
                  _.extend({ idModelChannel }, notify),
                );
              });

            this.dateLastMessage = Date.now();
          })
          .catch(ApiError, () => {
            // Unlike a SyncError, an ApiError here isn't sufficient for us to
            // stop processing other batch results.
            return this.delegate.handleInvalidSubscription(idModel);
          });
      },
    );

    BluebirdPromise.all(batchRequests)
      .catch(RpcError.SyncError, (err) => {
        syncError(err, {
          isUsingSocket: messageHandler !== this,
          dateLastMessage: messageHandler.dateLastMessage,
        });
        return this.stopPolling();
      })
      .catch(Batcher.BatchFailure, function () {})
      // When the batch call fails, this is going to be emitted
      // for each inner request and we'll be catching the first
      // one. But we don't care about this -- we'll look for and
      // handle the BatchFailure on the send call instead.
      .done();

    return batcher
      .send()
      .then(() => {
        // Reset the request failures to 0 so that we can return to the default
        // polling interval.
        this.pollRequestFailures = 0;
        this.timeOfFirstFailedPoll = null;
      })
      .catch(Batcher.BatchFailure, ({ message, error }) =>
        BluebirdPromise.reject(RpcError.BatchError(message, { error })),
      )
      .catch((e) => {
        // Increment the request failures so that we can exponentially back off
        // the polling interval.
        this.pollRequestFailures++;

        // Note the time of the first polling failure so that we can show a
        // redbox if polling fails for over 2 minutes.
        if (this.timeOfFirstFailedPoll === null) {
          this.timeOfFirstFailedPoll = Date.now();
        }

        Analytics.sendOperationalEvent({
          action: 'errored',
          actionSubject: 'pollAjaxRpc',
          source: 'network:ajax',
        });
        const msg = l('alerts.could not connect');
        const timeSinceFirstFailedPoll =
          this.timeOfFirstFailedPoll === null
            ? 0
            : Date.now() - this.timeOfFirstFailedPoll;
        if (timeSinceFirstFailedPoll > LIMIT_FOR_FAILED_POLLING) {
          showFlag({
            id: 'connectionDead',
            title: msg,
            appearance: 'error',
            actions: [
              {
                content: l('alerts.reload page'),
                onClick: () => window.location.reload(),
                type: 'button',
              },
            ],
            isUndismissable: true,
          });
          this.stopPolling();
        }
      })
      .nodeify(next)
      .done();
  }
}

_.extend(AjaxRPC.prototype, Backbone.Events);

module.exports.AjaxRPC = AjaxRPC;
