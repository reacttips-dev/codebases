/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/* eslint eqeqeq:0 */
let rpc;
const { AjaxRPC } = require('./AjaxRPC');
const { ApiError } = require('app/scripts/network/api-error');
const { Auth } = require('app/scripts/db/auth');
const Backbone = require('@trello/backbone');
const { Batcher } = require('app/scripts/network/rpc/batcher');
const BluebirdPromise = require('bluebird');
const { SocketRPC } = require('./socket-rpc');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { sendErrorEvent } = require('@trello/error-reporting');

function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

window.dropTheHammer = function () {
  TrelloStorage.set('useWebsockets', 'yes');
  return __guardMethod__(console, 'log', (o) =>
    o.log(
      'Websockets engaged! Reload the page, please. Use pitStop() to turn sockets off.',
    ),
  );
};

window.pitStop = function () {
  TrelloStorage.set('useWebsockets', 'no');
  return __guardMethod__(console, 'log', (o) =>
    o.log(
      'Shutting Websockets down! Reload the page, please. Use dropTheHammer() to turn sockets back on.',
    ),
  );
};

const VERIFY_INTERVAL_MS = 20 * 1000;
const INVALID_MODEL_ERRORS = ['unauthorized', 'forbidden', 'not found'];

// We want to immediately open up an rpc channel, so we use AJAX until the socket has connected
// and proven that it can answer a ping. If the socket connects and answers quickly, we use
// that for all future requests. If not, we just close it down and keep using AJAX. We defer
// setting up anything that will require polling on the AJAX rpc until we either confirm or
// give up on the socket rpc.
class RPC {
  static initClass() {
    _.extend(this.prototype, Backbone.Events);
  }

  constructor() {
    this.rpcSocket = this.rpcAJAX = this.rpcCurrent = null;
    this.currentSubscriptions = {};

    this.rpcConnectTime = 0;
    this.socketRetryWaitTime = 0;
    this.blockSocketReconnection = false;
    this.handledSubscriptionErrors = INVALID_MODEL_ERRORS;
    // Always start an RPC if we're logged in, so we can get our notifications
    this.handleLogin();

    setTimeout(() => {
      return this.verifySubscriptions();
    }, VERIFY_INTERVAL_MS);

    featureFlagClient.on(
      'fep.disconnect_active_clients',
      false,
      (disconnectActiveClients) => {
        if (disconnectActiveClients === true) {
          this.blockSocketReconnection = true;
          if (this.rpcAJAX != null) {
            this.rpcAJAX.stopPolling();
          }
        }
      },
    );
  }

  rpcReady() {
    if (!this.isUsingSocket()) {
      this.rpcCurrent.poll();
    }

    this.trigger('ready');

    this.resubscribe();

    return this.listenTo(this, 'reconnect', () => {
      return this.resubscribe();
    });
  }

  resubscribe() {
    return (() => {
      const result = [];
      for (const idModel in this.currentSubscriptions) {
        const subscription = this.currentSubscriptions[idModel];
        result.push(
          this.subscribe(subscription.modelType, idModel, subscription.tags),
        );
      }
      return result;
    })();
  }

  setActiveRPC(rpc) {
    this.stopListening(this.rpcCurrent);
    this.rpcCurrent = rpc;

    this.listenTo(this.rpcCurrent, 'all', (...args) => {
      return this.trigger(...Array.from(args || []));
    });
  }

  lazyCreateRPC() {
    if (
      this.blockSocketReconnection === true ||
      this.isUsingSocket() ||
      Util.getTime() - this.rpcConnectTime < this.socketRetryWaitTime
    ) {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'create-session/socket',
      source: 'network:rpc',
    });

    this.rpcConnectTime = Util.getTime();
    this.socketRetryWaitTime = Util.randomWait(
      Util.getMs({ minutes: 20 }),
      Util.getMs({ minutes: 10 }),
    );

    // Create a new socket instance to force new Socket creation
    this.rpcSocket = new SocketRPC(this);
    if (this.rpcAJAX != null) {
      this.rpcAJAX.stopPolling();
    } else {
      this.rpcAJAX = new AjaxRPC(this);
    }

    // Until the socket proves it works, you're on AJAX rpc.
    this.setActiveRPC(this.rpcAJAX);

    if (this.rpcSocket.hasSocketTransport()) {
      // Sockets have a chance of working. They have 8s to answer a ping before we give up on 'em.
      const msPingWait = 8000;

      return this.rpcSocket.ping((err, result, pingedSocket) => {
        const pingElapsedTime = Util.getTime() - this.rpcConnectTime;
        if (err != null || pingElapsedTime > msPingWait) {
          // Socket took too long. Use AJAX.

          // by the time we get here, @rpcCurrent may already be pointing at
          // a different socket than the one we just pinged
          pingedSocket.disconnect();
          pingedSocket.destroy();

          this.rpcSocket = null;

          Analytics.sendOperationalEvent({
            action: 'errored',
            actionSubject: 'socketPing',
            source: 'network:rpc',
            attributes: {
              taskId: traceId,
              status: err ? 'failed' : 'slow',
              message: err ? err.message : 'error: slow ping',
              pingElapsedTime,
            },
          });

          Analytics.taskFailed({
            taskName: 'create-session/socket',
            source: 'network:rpc',
            traceId,
            error: new Error('slow ping'),
          });

          this.rpcReady();
          setTimeout(() => {
            return this.lazyCreateRPC();
          }, this.socketRetryWaitTime);
        } else {
          // Yay, we have sockets!
          this.setActiveRPC(this.rpcSocket);
          this.rpcReady();
          Analytics.taskSucceeded({
            taskName: 'create-session/socket',
            source: 'network:rpc',
            traceId,
          });
        }
      });
    } else {
      // We do not have an acceptable socket transport. Use AJAX.
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'unsupportedSocketConnection',
        source: 'network:rpc',
        attributes: {
          taskId: traceId,
        },
      });
      Analytics.taskAborted({
        taskName: 'create-session/socket',
        source: 'network:rpc',
        traceId,
        error: new Error('Unsupported socket connection'),
      });
      return this.rpcReady();
    }
  }

  handleLogin() {
    if (Auth.isLoggedIn()) {
      return this.lazyCreateRPC();
    }
  }

  unsubscribe(modelType, idModel) {
    this.lazyCreateRPC();
    this.rpcCurrent.unsubscribe(modelType, idModel);
    return delete this.currentSubscriptions[idModel];
  }

  _subscribeOrHandle(modelType, idModel, tags) {
    return BluebirdPromise.fromNode((next) => {
      return this.rpcCurrent.subscribe(modelType, idModel, tags, next);
    }).catch((err) => {
      if (INVALID_MODEL_ERRORS.includes(err.message)) {
        this.handleInvalidSubscription(idModel);
        return this.trigger('subscription_invalid', modelType, idModel, tags);
      }
    });
  }

  subscribe(modelType, idModel, tags) {
    let subscription;
    this.lazyCreateRPC();

    if ((subscription = this.currentSubscriptions[idModel]) != null) {
      subscription.tags = _.union(subscription.tags, tags);
    } else {
      this.currentSubscriptions[idModel] = {
        tags,
        ixLastUpdate: -1,
        modelType,
        idModel,
      };
    }

    return this._subscribeOrHandle(modelType, idModel, tags);
  }

  getIxLastUpdate(idModel) {
    return this.currentSubscriptions[idModel] != null
      ? this.currentSubscriptions[idModel].ixLastUpdate
      : undefined;
  }

  setIxLastUpdate(idModel, ixLastUpdate) {
    let entry;
    if ((entry = this.currentSubscriptions[idModel]) != null) {
      return (entry.ixLastUpdate = ixLastUpdate);
    }
  }

  stop() {
    if (this.isUsingSocket()) {
      this.rpcSocket.destroy();
    } else {
      this.rpcAJAX.stopPolling();
    }
  }

  isUsingSocket() {
    return this.rpcCurrent != null && this.rpcCurrent === this.rpcSocket;
  }

  handleInvalidSubscription(idModelInvalid) {
    let subscription;
    if ((subscription = this.currentSubscriptions[idModelInvalid]) != null) {
      const { modelType, idModel, tags } = subscription;

      this.unsubscribe(modelType, idModel);
      this.trigger('invalidModel', modelType, idModel, tags);
    }
  }

  _verificationUrls() {
    const subscriptions = Object.values(this.currentSubscriptions);

    const me = Auth.isLoggedIn() ? Auth.me() : null;

    return subscriptions
      .map(function ({ modelType, idModel }) {
        const url = (() => {
          let idBoards, idOrganizations;
          switch (modelType) {
            case 'Board':
              idBoards = me && me.get('idBoards');
              if (idBoards && Array.from(idBoards).includes(idModel)) {
                // If it's in our idBoards we're allowed to see it
                return null;
              } else {
                return `/boards/${idModel}/name`;
              }
            case 'Member':
              if (idModel === Auth.myId()) {
                // Don't bother checking if we can read our member channel
                return null;
              } else {
                return `/members/${idModel}/fullName`;
              }
            case 'Organization':
              idOrganizations = me && me.get('idOrganizations');
              if (
                idOrganizations &&
                Array.from(idOrganizations).includes(idModel)
              ) {
                // If it's in our idOrganizations we know we're allowed to see it
                return null;
              } else {
                return `/organizations/${idModel}/displayName`;
              }
            default:
              return null;
          }
        })();

        if (url) {
          return { id: idModel, url };
        }
      })
      .filter((entry) => entry != null);
  }

  _sendVerificationRequests() {
    const verifyData = this._verificationUrls();

    if (verifyData.length === 0) {
      return BluebirdPromise.resolve();
    }

    const batcher = new Batcher();

    verifyData.forEach(({ id, url }) => {
      return batcher
        .request(url)
        .catch(ApiError, () => {
          return this.handleInvalidSubscription(id);
        })
        .catch(Batcher.BatchFailure, (batchError) => {
          // We'll handle the batch failure once, after the .send() call
        });
    });

    return batcher
      .send()
      .catch(ApiError.NoResponse, ApiError.Timeout, () => {
        // This is a connectivity problem that doesn't need to be reported, we'll just wait
        // for the next poll
      })
      .catch(ApiError.Unauthenticated, () => {
        // The whole request failed because we aren't authenticated anymore, we don't need
        // to report that
      })
      .catch(ApiError, (error) => {
        sendErrorEvent(
          new Error(`Batch Failure while sending verification requests`),
          {
            extraData: {
              errorName: error.name,
              verifyData,
            },
          },
        );
      });
  }

  // This is meant to catch some tricky situations where we might have lost
  // access to something even though we received no websocket update informing
  // us.  For example, a public board or team that we're looking at may have
  // been deleted, or a team visible board that we aren't a member of might
  // have been changed to private.
  verifySubscriptions() {
    clearTimeout(this._verifyTimeout);

    return this._sendVerificationRequests()
      .finally(() => {
        let timeout;
        return (timeout = this._verifyTimeout = setTimeout(() => {
          if (timeout === this._verifyTimeout) {
            return requestAnimationFrame(() => {
              return this.verifySubscriptions();
            });
          }
        }, VERIFY_INTERVAL_MS));
      })
      .done();
  }
}
RPC.initClass();

module.exports.rpc = rpc = window.rpc = new RPC();

// If we're unable to subscribe to our own member channel, something
// has gone wrong (possibly we deleted our account or our session was
// invalidated from another browser)
if (Auth.isLoggedIn()) {
  rpc.on('invalidModel', function (typeName, id) {
    if (typeName === 'Member' && Auth.isMe(id)) {
      return Auth.removeToken();
    }
  });
}
