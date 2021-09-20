/* eslint-disable
    default-case,
    eqeqeq,
    no-empty,
    no-unreachable,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import Backbone from '@trello/backbone';
import _ from 'underscore';
import { isEmbeddedDocument } from '@trello/browser';
import { clientVersion } from '@trello/config';
import { Util } from 'app/scripts/lib/util';

const { getQueryParameter } = Util;

const DONT_COME_BACK_CODE = 4001;
const TERMINATED_SESSION_CODE = 4002;

export class Socket {
  trigger: (
    event:
      | 'data'
      | 'connect'
      | 'connecting'
      | 'connect_failed'
      | 'reconnect'
      | 'reconnecting'
      | 'reconnect_failed'
      | 'disconnect',
    data?: unknown,
  ) => void;
  listenTo: (
    socket: Socket,
    event: 'close' | 'error' | 'message' | 'open',
    callback: (event?: Event) => void,
  ) => void;

  static CONNECTING = 'connecting';
  static CONNECTED = 'connected';
  static WAITING_TO_RECONNECT = 'waiting to reconnect';
  static RECONNECTING = 'reconnecting';
  static CLOSED = 'closed';
  static DESTROYED = 'destroyed';
  static PING_TIMEOUT = 30000;
  static WAKE_UP_CHECK_INTERVAL = 2 * 1000;

  state: string;

  url: string;
  fxReconnectDelay: (event?: CloseEvent) => number;
  maxReconnectDelay: number;
  failedConsecutiveReconnectsLimit: number;
  reconnectRateLimit: number;
  reconnectRateWindow: number;
  maxReconnectsPerDay: number;
  ws: WebSocket | null;
  mustNeverReconnect: boolean;
  reconnectRateAttempts: number;
  totalReconnects: number;
  buffer: string[];
  connectedOnce: boolean;
  wakeUpCheckLastRun: number;
  failedConsecutiveReconnectAttempts: number;
  connectAttemptStarted: number;
  currentReconnectDelay: number;

  reconnectNotAttemptedReason?: string;
  previousReason: string;

  _wakeUpCheck: number;
  _dailyFailsCheck: number;
  _pingTimeout: number | null;
  _timeoutBackoff: number;
  _reconnectTimer: number | null;

  _timeoutBackOff?: number;

  constructor(
    url: string,
    param: {
      fxReconnectDelay: () => number;
      maxReconnectDelay: number;
      failedConsecutiveReconnectsLimit: number;
      reconnectRateLimit: number;
      reconnectRateWindow: number;
      maxReconnectsPerDay: number;
    },
  ) {
    this.url = url;
    const {
      fxReconnectDelay,
      maxReconnectDelay,
      failedConsecutiveReconnectsLimit,
      reconnectRateLimit,
      reconnectRateWindow,
      maxReconnectsPerDay,
    } = param;
    this.fxReconnectDelay = fxReconnectDelay;
    this.maxReconnectDelay = maxReconnectDelay;
    this.failedConsecutiveReconnectsLimit = failedConsecutiveReconnectsLimit;
    this.reconnectRateLimit = reconnectRateLimit;
    this.reconnectRateWindow = reconnectRateWindow;
    this.maxReconnectsPerDay = maxReconnectsPerDay;
    _.extend(this, Backbone.Events);

    this.ws = null;

    this.resetRetries();

    this.listenTo(this, 'close', this.onClose);
    this.listenTo(this, 'error', this.onError);
    this.listenTo(this, 'message', this.onMessage);
    this.listenTo(this, 'open', this.onOpen);

    if (!('WebSocket' in window)) {
      this.trigger('connect_failed');
      return;
    }

    this.mustNeverReconnect = false;

    this.reconnectRateAttempts = 0;
    this.totalReconnects = 0;

    this._setDailyFailsCheck();

    this.connect();

    this.buffer = [];
    this.connectedOnce = false;

    this.wakeUpCheckLastRun = Date.now();
    this._wakeUpCheck = window.setInterval(() => {
      const currentTime = Date.now();
      // consider we just woke up if the last time we ran this interval, which
      // is supposed to run every two seconds, was more than [rate limit
      // window in ms] ago
      if (
        currentTime > this.wakeUpCheckLastRun + this.reconnectRateWindow &&
        !this.mustNeverReconnect
      ) {
        this.disconnect();
        this.reconnect();
      }
      this.wakeUpCheckLastRun = currentTime;
    }, Socket.WAKE_UP_CHECK_INTERVAL);

    this.trigger('connecting');
  }

  _setDailyFailsCheck() {
    this._dailyFailsCheck = window.setInterval(() => {
      this.totalReconnects = 0;
      if (this.state === Socket.CLOSED) {
        this.reconnect();
      }
    }, 86400000); // 1 day in ms
  }

  _setReconnectBackOff() {
    if (this._timeoutBackOff != null) {
      return;
    }

    this._timeoutBackOff = window.setTimeout(() => {
      clearTimeout(this._timeoutBackOff);
      delete this._timeoutBackOff;

      this.reconnectRateAttempts = 0;

      if (this.state === Socket.CLOSED) {
        this.reconnect();
      }
    }, this.reconnectRateWindow);
  }

  resetRetries() {
    this.failedConsecutiveReconnectAttempts = 0;
  }

  _clearPingTimeout() {
    if (this._pingTimeout != null) {
      clearTimeout(this._pingTimeout);
    }
    this._pingTimeout = null;
  }

  _resetPingTimeout() {
    this._clearPingTimeout();
    this._pingTimeout = window.setTimeout(
      this._noPing.bind(this),
      Socket.PING_TIMEOUT,
    );
  }

  _noPing() {
    if (!(this.state === Socket.CONNECTED)) {
      return;
    }
    this.disconnect();
  }

  connect() {
    if (this.ws != null) {
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.onmessage = null;
      this.ws.onopen = null;
    }

    this.connectAttemptStarted = Date.now();
    this.ws = new WebSocket(`${this.url}?clientVersion=${clientVersion}`);

    this.ws.onclose = function () {
      this.trigger('close', ...arguments);
    }.bind(this);
    this.ws.onerror = function () {
      this.trigger('error', ...arguments);
    }.bind(this);
    this.ws.onmessage = function () {
      this.trigger('message', ...arguments);
    }.bind(this);
    this.ws.onopen = function () {
      this.trigger('open', ...arguments);
    }.bind(this);

    this.state = Socket.CONNECTING;
  }

  onOpen() {
    if (this.connectedOnce) {
      this.trigger('reconnect');
    } else {
      this.trigger('connect');
    }

    this.connectedOnce = true;
    this.state = Socket.CONNECTED;
    this.flushBuffer();
    this.resetRetries();
  }

  _triggerFailures() {
    if (this.state === Socket.CONNECTING) {
      this.trigger('connect_failed');
    }
  }

  onClose(event?: CloseEvent) {
    this.trigger(
      'disconnect',
      (event != null ? event.reason : undefined) != null
        ? event != null
          ? event.reason
          : undefined
        : '',
    );

    if ((event != null ? event.code : undefined) === TERMINATED_SESSION_CODE) {
      // Token has been invalidated and user
      // needs to be logged out.
      let redirectUrl = '/logged-out';
      if (
        isEmbeddedDocument() &&
        getQueryParameter('iframeSource', '') === 'msteams'
      ) {
        // MS Teams integration should redirect to the proper initial page, otherwise the page will not be displayable in the iframe
        redirectUrl = `/integrations/teams/tab-content?iframeSource=msteams&contentUrl=${encodeURIComponent(
          window.location.href,
        )}`;
      }
      window.location.replace(redirectUrl);
    }

    if ((event != null ? event.code : undefined) === DONT_COME_BACK_CODE) {
      this.mustNeverReconnect = true;
    }

    this._triggerFailures();
    this._clearPingTimeout();
    this.reconnect(event);
  }

  onError() {
    this._triggerFailures();
    this.disconnect();
    this.reconnect();
  }

  onMessage(event: MessageEvent) {
    let parsedData;
    this._resetPingTimeout();
    if (event.data === '') {
      // This looks like a ping
      this.ws?.send('');
      return;
    }

    try {
      parsedData = JSON.parse(event.data);
    } catch (error) {}
    this.trigger('data', parsedData);
  }

  _shouldNotReconnect() {
    if (this.reconnectNotAttemptedReason != null) {
      this.previousReason = this.reconnectNotAttemptedReason;
    }

    this.reconnectNotAttemptedReason = (() => {
      if (
        this.failedConsecutiveReconnectAttempts >=
        this.failedConsecutiveReconnectsLimit
      ) {
        return 'too many consecutive failures';
      } else if (this.mustNeverReconnect) {
        return 'server NEVER RECONNECT code received';
      } else if (this.reconnectRateAttempts >= this.reconnectRateLimit) {
        return 'rate limited';
      } else if (this.totalReconnects >= this.maxReconnectsPerDay) {
        return 'max reconnects limit reached';
      }
    })();

    return this.reconnectNotAttemptedReason != null;
  }

  reconnect(event?: CloseEvent) {
    switch (this.state) {
      case Socket.CONNECTED:
        this.ws?.close();
        break;
      case Socket.RECONNECTING:
      case Socket.WAITING_TO_RECONNECT:
      case Socket.DESTROYED:
        return;
        break;
    }

    this._setReconnectBackOff();

    const previousCallAttemptedReconnect =
      this.reconnectNotAttemptedReason == null;

    if (this._shouldNotReconnect()) {
      if (previousCallAttemptedReconnect) {
        this.trigger('reconnect_failed');
      }
      this.state = Socket.CLOSED;
      return;
    }

    this.state = Socket.WAITING_TO_RECONNECT;

    if (this.failedConsecutiveReconnectAttempts === 0) {
      this.currentReconnectDelay = this.fxReconnectDelay(event);
    }

    this._reconnectTimer = window.setTimeout(() => {
      this._reconnectTimer = null;
      this.connect();
      this.state = Socket.RECONNECTING;
      this.trigger('reconnecting');
    }, this.currentReconnectDelay);

    this.totalReconnects++;
    this.failedConsecutiveReconnectAttempts++;
    this.reconnectRateAttempts++;

    this.currentReconnectDelay = Math.min(
      2 * this.currentReconnectDelay,
      this.maxReconnectDelay,
    );
  }

  // If a reconnect fails *really* quickly, we assume it's due to not having a connection
  // In this case, we can adjust the token buckets back down as we're not taxing the backend
  // This gives people more chance to re-connect while their wifi is connecting.
  _adjustTokenBuckets() {
    const fastFailure = this.connectAttemptStarted >= Date.now() - 20;
    if (
      this.state === Socket.RECONNECTING &&
      (!navigator.onLine || fastFailure)
    ) {
      this.totalReconnects = Math.max(this.totalReconnects - 1, 0);
      this.failedConsecutiveReconnectAttempts = Math.max(
        this.failedConsecutiveReconnectAttempts - 1,
        0,
      );
      this.reconnectRateAttempts = Math.max(this.reconnectRateAttempts - 1, 0);
      this.currentReconnectDelay = this.currentReconnectDelay / 2;
    }
  }

  disconnect() {
    if (this.state === Socket.DESTROYED) {
      return;
    }

    this._clearPingTimeout();
    this._adjustTokenBuckets();

    const { state } = this;
    // This needs to happen before @onClose, or we infinitely recurse
    this.state = Socket.CLOSED;

    switch (state) {
      case Socket.CONNECTED:
      case Socket.CONNECTING:
      case Socket.RECONNECTING:
        this.ws?.close();
        // A client-initiated close doesn't trigger the handler
        return this.onClose();
      case Socket.WAITING_TO_RECONNECT:
        if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
    }
  }

  send(data: string) {
    if (this.state === Socket.CONNECTED) {
      try {
        this.ws?.send(data);
      } catch (error) {
        this.buffer.push(data);
        this.onError();
      }
    } else {
      this.buffer.push(data);
    }
  }

  flushBuffer() {
    const buf = this.buffer;
    this.buffer = [];
    buf.map((data) => this.send(data));
  }

  destroy() {
    // Clean up all the related timers to allow this object to be GC'd
    if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
    if (this._timeoutBackoff) clearTimeout(this._timeoutBackoff);
    if (this._pingTimeout) clearTimeout(this._pingTimeout);
    if (this._dailyFailsCheck) clearInterval(this._dailyFailsCheck);
    if (this._wakeUpCheck) clearInterval(this._wakeUpCheck);

    this.state = Socket.DESTROYED;
  }
}
