const Backbone = require('@trello/backbone');
const { Monitor } = require('app/scripts/lib/monitor');
const { Socket } = require('app/scripts/network/socket');
const { TrelloStorage } = require('@trello/storage');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');

class SocketRPC {
  constructor(delegate) {
    let socketEvent;
    this.delegate = delegate;
    this.reqid = 0;
    this.dictCallback = {};
    this.dictTime = {};
    this.connectedOnce = false;
    this.modelIxUpdate = {};

    this.hasSockets =
      'WebSocket' in window && TrelloStorage.get('useWebsockets') !== 'no';

    if (!('WebSocket' in window)) {
      Analytics.sendOperationalEvent({
        actionSubject: 'socket',
        action: 'stopped',
        source: 'network:socketRpc',
      });
    } else if (TrelloStorage.get('useWebsockets') === 'no') {
      Analytics.sendOperationalEvent({
        actionSubject: 'socketPitStop',
        action: 'stopped',
        source: 'network:socketRpc',
      });
    }

    if (!this.hasSockets) {
      return;
    }

    const protocol = document.location.protocol === 'http:' ? 'ws:' : 'wss:';

    this.socket = new Socket(
      `${protocol}//${document.location.host}/1/Session/socket`,
      {
        maxReconnectDelay: 64000,
        failedConsecutiveReconnectsLimit: 10,
        reconnectRateLimit: 3,
        reconnectRateWindow: Util.getMs({ minutes: 5 }),
        maxReconnectsPerDay: 100,
        fxReconnectDelay(event) {
          const status = Monitor.getStatus();
          const slowMs =
            status === 'active'
              ? Util.randomWait(
                  Util.getMs({ seconds: 10 }),
                  Util.getMs({ seconds: 30 }),
                )
              : Util.randomWait(
                  Util.getMs({ seconds: 30 }),
                  Util.getMs({ minutes: 2 }),
                );
          const fastMs =
            status === 'active'
              ? Util.randomWait(100, Util.getMs({ seconds: 1 }))
              : Util.randomWait(
                  Util.getMs({ seconds: 2 }),
                  Util.getMs({ seconds: 10 }),
                );

          if (!event || event.code === 1006) {
            // We caused the disconnection or a hard crash of the proc, respectively
            // Let's take it slow
            return slowMs;
          } else if (event.code === 4000) {
            let seconds;
            try {
              // eslint-disable-next-line radix
              seconds = parseInt(event.reason, 0);
            } catch (error) {
              return fastMs;
            }
            if (status === 'active') {
              return Util.randomWait(
                Util.getMs({ seconds }),
                Util.getMs({ seconds }) * 4,
              );
            } else {
              return Util.randomWait(
                Util.getMs({ seconds }) * 4,
                Util.getMs({ seconds }) * 4 * 4,
              );
            }
          } else {
            return fastMs;
          }
        },
      },
    );

    for (socketEvent of ['connecting', 'reconnecting']) {
      ((event) => {
        this.socket.on(event, () => {
          this.trigger('connecting');
        });
      })(socketEvent);
    }

    this.socket.on('connect_failed', () => {
      this.trigger('connect_failed');
    });

    this.socket.on('reconnect_failed', () => {
      this.trigger('reconnect_failed');

      if (
        this.socket.reconnectNotAttemptedReason === this.socket.previousReason
      ) {
        return;
      }

      const timeSinceGoodConnection = Date.now() - (this.dateLastMessage || 0);

      Analytics.sendOperationalEvent({
        actionSubject: 'socketRedbox',
        action: 'errored',
        source: 'network:socketRpc',
        attributes: {
          timeSinceGoodConnection,
          reconnectNotAttemptedReason: this.socket.reconnectNotAttemptedReason,
        },
      });
    });

    this.socket.on('connect', () => {
      this.trigger('connect');
      if (this.connectedOnce === false) {
        Analytics.sendOperationalEvent({
          actionSubject: 'socketConnection',
          action: 'connected',
          source: 'network:socketRpc',
          attributes: {
            timeSinceLoadInMilliseconds: Math.round(performance.now()),
          },
        });
      }
      this.connectedOnce = true;
    });

    this.socket.on('reconnect', () => {
      clearTimeout(this.timeoutInvokeResponse);
      delete this.timeoutInvokeResponse;
      this.trigger('reconnect');
    });

    this.socket.on('disconnect', (reason) => {
      clearTimeout(this.timeoutInvokeResponse);
      delete this.timeoutInvokeResponse;
      _.each(this.dictCallback, (next) =>
        typeof next === 'function' ? next('disconnected') : undefined,
      );
      this.dictCallback = {};
      this.dictTime = {};
    });

    this.socket.on('error', () => {
      const isConnected =
        this.socket && this.socket.socket && this.socket.socket.connected;

      if (this.connectedOnce && isConnected) {
        this.trigger('disconnect');
      }
    });

    this.socket.on('data', (msg) => {
      this._messageHandler(msg);
    });
  }

  _messageHandler(msg) {
    let next;
    this.dateLastMessage = Date.now();

    //For timeout clear, we don't really care if it's the same one, just that the server is alive
    clearTimeout(this.timeoutInvokeResponse);
    delete this.timeoutInvokeResponse;

    if (msg.reqid !== null) {
      next = this.dictCallback[`fx${msg.reqid}`];
    }

    if (msg.result) {
      if (typeof next === 'function') {
        next(null, msg.result);
      }
    } else if (msg.notify && msg.notify.event) {
      if (msg.idModelChannel) {
        this.delegate.setIxLastUpdate(
          msg.idModelChannel,
          msg.ixLastUpdateChannel,
        );
      }
      this.trigger(
        msg.notify.event,
        _.extend({ idModelChannel: msg.idModelChannel }, msg.notify),
      );
    } else if (msg.error) {
      if (typeof next === 'function') {
        next(msg.error);
      }
    }

    if (msg.reqid !== null) {
      delete this.dictCallback[`fx${msg.reqid}`];
      delete this.dictTime[msg.reqid];
    }
  }

  subscribe(modelType, idModel, tags, next) {
    this.send(
      {
        type: 'subscribe',
        modelType,
        idModel,
        tags,
        invitationTokens: Util.invitationTokens(),
      },
      (err, ixLastUpdate) => {
        if (err) {
          Analytics.sendOperationalEvent({
            actionSubject: 'socketSubscribe',
            action: 'errored',
            source: 'network:socketRpc',
            attributes: {
              error: err,
            },
          });
          if (!this.delegate.handledSubscriptionErrors.includes(err)) {
            // Our delegate doesn't know how to handle this error
            // Consider the socket bad and disconnect.
            Analytics.sendOperationalEvent({
              actionSubject: 'socketSubscribe',
              action: 'disconnected',
              source: 'network:socketRpc',
              attributes: {
                error: err,
              },
            });
            this.disconnect();
          }
        } else {
          // If the ixLastUpdate has changed, resync and let that response set ixLastUpdate
          const storedIxLastUpdate = this.delegate.getIxLastUpdate(idModel);
          if (
            storedIxLastUpdate !== undefined &&
            storedIxLastUpdate !== -1 &&
            storedIxLastUpdate !== ixLastUpdate
          ) {
            this.resync(idModel);
          } else {
            this.delegate.setIxLastUpdate(idModel, ixLastUpdate);
          }
        }
        return typeof next === 'function' ? next(err, ixLastUpdate) : undefined;
      },
    );
  }

  unsubscribe(modelType, idModel, next) {
    this.send(
      {
        type: 'unsubscribe',
        modelType,
        idModel,
      },
      (err, response) => {
        return typeof next === 'function' ? next(err, response) : undefined;
      },
    );
  }

  ping(next) {
    // We need a way to test ping failure in order to verify that polling works in the event that the client supports
    // WebSockets, but fails to establish a connection before the timeout.
    if (featureFlagClient.get('force-websocket-ping-failure', false)) {
      return typeof next === 'function'
        ? next(new Error('Forcing ping failure'), {}, this)
        : undefined;
    } else {
      this.send(
        {
          type: 'ping',
        },
        (err, response) => {
          return typeof next === 'function'
            ? next(err, response, this)
            : undefined;
        },
      );
    }
  }

  send(msg, next) {
    this.dictCallback[`fx${this.reqid}`] = next;
    this.dictTime[this.reqid] = new Date();
    msg.reqid = this.reqid++;

    const sMsg = JSON.stringify(msg);

    this.socket.send(sMsg);
    if (!this.timeoutInvokeResponse) {
      this.timeoutInvokeResponse = setTimeout(() => {
        if (this.socket.state !== Socket.CONNECTED) {
          // The socket knows it isn't connected.
          return;
        }
        clearTimeout(this.timeoutInvokeResponse);
        delete this.timeoutInvokeResponse;
        if (this.socket) {
          this.socket.disconnect();
        }
      }, 10000);
    }
  }

  resync(...idModels) {
    if (_.isEmpty(idModels)) {
      idModels = null;
    }
    this.delegate.rpcAJAX.doPoll(idModels, this, function () {});
  }

  disconnect() {
    this.socket.disconnect();
  }

  destroy() {
    this.socket.destroy();
  }

  hasSocketTransport() {
    return this.hasSockets;
  }
}

Object.assign(SocketRPC.prototype, Backbone.Events);

module.exports.SocketRPC = SocketRPC;
