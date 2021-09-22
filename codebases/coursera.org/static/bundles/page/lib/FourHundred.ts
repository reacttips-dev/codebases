// this library must work on the server too, so don't rely on browser environment for core functionality
import cookies from 'js/lib/cookie';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import envHelper from 'js/lib/envHelper';
import logger from 'js/app/loggerSingleton';

const LOCAL_STORAGE_QUOTA_EXCEEDED_CODE = 22;
const MAX_POLL_TIME = 300;
const MAX_POLL_TIME_INCREMENT = 50;
const MAX_POLL_ATTEMPTS = 3;
const MAX_POLL_QUEUE_SIZE = 50;
const MAX_SERVER_ACCEPTED_SIZE = 200000; // server actually allows 256k...
const BATCH_KEY = '400batching';
const BATCH_INFLIGHT_KEY = '400batching-inflight';
const SEQUENCE_NUMBER_KEY = 'sequence-number-key';
const CLIENT_TYPE = 'web';

const CONSTANTS = {
  activityExpirationTime: 30 * 60 * 1000, // 30 minutes (ms)
  batching: true,
  method: 'GET', // allowed: POST, GET, IFRAME
  beacon: '/eventing/info.v2',
  beaconBatch: '/eventing/infoBatch.v2',
  debug: false,
  initialReferrerTracker: '__400r',
  lastActivityTimeTracker: '__400vt',
  visitIdTracker: '__400v',
};

const isActivityTimeExpired = function (activityTime: $TSFixMe) {
  if (!activityTime) {
    return true;
  }

  if (new Date().getTime() - activityTime > CONSTANTS.activityExpirationTime) {
    return true;
  }

  return false;
};

const getBatchFromStore = function (key: $TSFixMe) {
  const batchEventsString = window.localStorage.getItem(key);
  let batchEvents = null;

  if (batchEventsString) {
    try {
      batchEvents = JSON.parse(batchEventsString);
    } catch (e) {
      throw e;
    }
  }

  // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'never'.
  if (!batchEvents || !Array.isArray(batchEvents.events)) {
    // @ts-ignore ts-migrate(2322) FIXME: Type '{ clientType: string; app: null; clientVersi... Remove this comment to see the full error message
    batchEvents = {
      clientType: CLIENT_TYPE,
      app: null,
      clientVersion: null,
      events: [],
    };
  }

  return batchEvents;
};

const clearBatchFromStore = function (key: $TSFixMe) {
  window.localStorage.removeItem(key);
};

const setBatchStore = function (toKey: $TSFixMe, batchedEvents: $TSFixMe) {
  try {
    window.localStorage.setItem(toKey, JSON.stringify(batchedEvents));
  } catch (e) {
    // we are in a bad state, trying clearing out localstorage as a last resort
    window.localStorage.clear();
  }
};

const switchBatchStores = function (fromKey: $TSFixMe, toKey: $TSFixMe) {
  const batchEvents = getBatchFromStore(fromKey);
  clearBatchFromStore(fromKey);
  // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'never'.
  if (batchEvents && batchEvents.events.length) {
    setBatchStore(toKey, batchEvents);
  }

  return batchEvents;
};

const mergeBatchStores = function (fromKey: $TSFixMe, toKey: $TSFixMe) {
  const batchEventsFrom = getBatchFromStore(fromKey);
  const batchEventsTo = getBatchFromStore(toKey);

  // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
  batchEventsTo.events = batchEventsTo.events.concat(batchEventsFrom.events);

  clearBatchFromStore(fromKey);
  setBatchStore(toKey, batchEventsTo);
};

// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
const generateUUID = function () {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16); // eslint-disable-line no-bitwise
  });
  return uuid;
};

class FourHundred {
  constructor(getOrPostIframe: $TSFixMe, postIframe: $TSFixMe, post: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ping' does not exist on type 'FourHundre... Remove this comment to see the full error message
    this.ping = getOrPostIframe;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingPost' does not exist on type 'FourHu... Remove this comment to see the full error message
    this.pingPost = post;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingIframe' does not exist on type 'Four... Remove this comment to see the full error message
    this.pingIframe = postIframe;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingInFlight' does not exist on type 'Fo... Remove this comment to see the full error message
    this.pingInFlight = false;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    this.constants = CONSTANTS;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'archive' does not exist on type 'FourHun... Remove this comment to see the full error message
    this.archive = []; // hold events in debug mode
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.domain = this.getDomain();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchTimer' does not exist on type 'Four... Remove this comment to see the full error message
    this.batchTimer = -1;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchAttempts' does not exist on type 'F... Remove this comment to see the full error message
    this.batchAttempts = 0;

    this.getCurrentInitialReferrer();
    this.getCurrentVisitId();
    this.evaluateCapabilities();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.lastHref = envHelper.href();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.lastReferrer = envHelper.referrer();

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.screenSize = {
      height: envHelper.screenHeight(),
      width: envHelper.screenWidth(),
    };

    this.updateLastActivityTime();
  }

  evaluateCapabilities() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'canBatch' does not exist on type 'FourHu... Remove this comment to see the full error message
    this.canBatch = envHelper.isLocalStorageEnabled() && this.constants.batching === true;
  }

  getDomain() {
    const parts = envHelper.hostname().split('.');
    while (parts.length > 2) {
      parts.shift();
    }

    return '.' + parts.join('.');
  }

  getLastReferrer() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    if (envHelper.href() !== this.state.lastHref) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      this.state.lastReferrer = this.state.lastHref;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      this.state.lastHref = envHelper.href();
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    return this.state.lastReferrer;
  }

  getCurrentInitialReferrer() {
    const cookieOptions = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      domain: this.state.domain,
      minutes: 30,
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.initialReferrer = this.state.initialReferrer || cookies.get(this.constants.initialReferrerTracker);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    const lastActivityTime = this.state.lastActivityTime || cookies.get(this.constants.lastActivityTimeTracker);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    if (!this.state.initialReferrer || isActivityTimeExpired(lastActivityTime)) {
      let from = envHelper.referrer();
      if (!from) return null;

      const domainRegEx = /([a-z0-9-_]+\.)*[a-z0-9-_]+\.[a-z]+/gi;
      const domains = from.match(domainRegEx);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      const currentHostArr = this.state.domain.split('.');
      const currentHost = currentHostArr[currentHostArr.length - 2] + '.' + currentHostArr[currentHostArr.length - 1];

      // the from url may contain two 'domains', eg https://www.coursera.org/?q=www.coursera.org,
      // so we check the first to ensure this is not an internal referrer
      if (domains && domains[0].indexOf(currentHost) > -1) {
        from = null;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
      cookies.set(this.constants.initialReferrerTracker, from, cookieOptions);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      this.state.initialReferrer = from;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    return this.state.initialReferrer;
  }

  getCurrentVisitId() {
    const cookieOptions = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      domain: this.state.domain,
      minutes: 30,
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.visitId = this.state.visitId || cookies.get(this.constants.visitIdTracker);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    const lastActivityTime = this.state.lastActivityTime || cookies.get(this.constants.lastActivityTimeTracker);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    if (!this.state.visitId || isActivityTimeExpired(lastActivityTime)) {
      const id = generateUUID();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
      cookies.set(this.constants.visitIdTracker, id, cookieOptions);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      this.state.visitId = id;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    return this.state.visitId;
  }

  getAndIncrementSequence() {
    if (envHelper.isLocalStorageEnabled()) {
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | 0' is not assignable to... Remove this comment to see the full error message
      const retval = parseInt(window.localStorage.getItem(SEQUENCE_NUMBER_KEY) || 0, 10) + 1;
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
      window.localStorage.setItem(SEQUENCE_NUMBER_KEY, retval);
      return retval;
    }
  }

  updateLastActivityTime() {
    const time = new Date().getTime();
    const cookieOptions = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
      domain: this.state.domain,
      minutes: 30,
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    cookies.set(this.constants.lastActivityTimeTracker, time, cookieOptions);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
    this.state.lastActivityTime = time;
  }

  // originally built to be backward compatible with google analytics
  // push is used as one of the core interfaces, thus allowing for a simple primitive (Array)
  // to be constructed before this library instantiates itself
  // thus push can be used to configure the library
  // or to retain events that were generated before library was loaded
  push(command: $TSFixMe) {
    if (typeof command !== 'object') {
      return this;
    }

    if ((Array.isArray && Array.isArray(command)) || command.constructor === Array) {
      switch (command[0]) {
        case 'batch':
          command.shift();

          // support batching up commands
          while (command.length) {
            this.push(command.shift());
          }

          // if this is the first time we are batching, we are likely initializing 400
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchTimer' does not exist on type 'Four... Remove this comment to see the full error message
          if (this.batchTimer === -1 && this.canBatch) {
            const batchEvents = switchBatchStores(BATCH_INFLIGHT_KEY, BATCH_KEY);

            // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'never'.
            if (batchEvents && batchEvents.events.length) {
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
              this.poll();
            }

            // try to send it anyhow...
            if (window && window.onbeforeunload) {
              window.addEventListener('beforeunload', this.poll.bind(this));
            }
          }

          // allow scripts loaded before this library to continue pushing events
          if (envHelper.windowExists()) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property '_400' does not exist on type 'Window & t... Remove this comment to see the full error message
            window._400 = this;
          }

          break;

        case 'constant':
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
          this.constants[command[1]] = command[2];
          this.evaluateCapabilities();
          break;

        case 'send':
          this.send(command[1], command[2], command[3]);
          break;

        default:
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'state' does not exist on type 'FourHundr... Remove this comment to see the full error message
          this.state[command[0]] = command[1];
          break;
      }
    } else {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
      this.send(command);
    }

    return this;
  }

  send(_data: $TSFixMe, callback: $TSFixMe, forcePing: $TSFixMe) {
    let data = {};

    if (typeof _data === 'string') {
      data = { key: _data, value: {} };
    } else {
      data = _data || {};
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientType' does not exist on type '{}'.
    data.clientType = CLIENT_TYPE;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type '{}'.
    data.url = envHelper.href();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'app' does not exist on type '{}'.
    data.app = this.state.app;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'referrerUrl' does not exist on type '{}'... Remove this comment to see the full error message
    data.referrerUrl = this.getLastReferrer();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'initialReferrer' does not exist on type ... Remove this comment to see the full error message
    data.initialReferrer = this.getCurrentInitialReferrer();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'guid' does not exist on type '{}'.
    data.guid = generateUUID();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'visitId' does not exist on type '{}'.
    data.visitId = this.getCurrentVisitId();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'screenSize' does not exist on type '{}'.
    data.screenSize = this.state.screenSize;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientVersion' does not exist on type '{... Remove this comment to see the full error message
    data.clientVersion = this.state.clientVersion;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'clientTimestamp' does not exist on type ... Remove this comment to see the full error message
    data.clientTimestamp = new Date().getTime();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sequence' does not exist on type '{}'.
    data.sequence = this.getAndIncrementSequence();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type '{}'.
    data.value = {
      ..._data.value,
      appName: window.appName || 'unknown',
    };

    // cleanup any null values
    for (const key in data) {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      if (data[key] === null || data[key] === '' || data[key] === undefined) {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete data[key];
      }
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    if (this.constants.debug && !data.key?.startsWith('frontend_local_development')) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'archive' does not exist on type 'FourHun... Remove this comment to see the full error message
      this.archive.push(data);
      if (callback) callback();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'canBatch' does not exist on type 'FourHu... Remove this comment to see the full error message
    } else if (this.canBatch && !forcePing) {
      this.batchEvent(data);
      // callbacks aren't needed when batching
      // because some events could get sent on future page loads...
      if (callback) {
        callback();
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    } else if (this.constants.method === 'POST') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingPost' does not exist on type 'FourHu... Remove this comment to see the full error message
      this.pingPost(this.constants.beacon, data, callback);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    } else if (this.constants.method === 'GET') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ping' does not exist on type 'FourHundre... Remove this comment to see the full error message
      this.ping(this.constants.beacon, data, callback);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
    } else if (this.constants.method === 'IFRAME') {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingIframe' does not exist on type 'Four... Remove this comment to see the full error message
      this.pingIframe(this.constants.beacon, data, callback);
    }

    this.updateLastActivityTime();
    return this;
  }

  batchEvent(event: $TSFixMe) {
    const batchedEvents = getBatchFromStore(BATCH_KEY);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchingTimer' does not exist on type 'F... Remove this comment to see the full error message
    window.clearTimeout(this.batchingTimer);
    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    batchedEvents.events.push(event);

    try {
      window.localStorage.setItem(BATCH_KEY, JSON.stringify(batchedEvents));
    } catch (e) {
      // if store is too full, send out the events now
      if (e.code === LOCAL_STORAGE_QUOTA_EXCEEDED_CODE) {
        this.poll(event);
      } else {
        // if there is still trouble, post to iframe what you can and clear storage
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        batchedEvents.app = this.state.app;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        batchedEvents.clientVersion = this.state.clientVersion;
        window.localStorage.clear();
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'postIframe' does not exist on type 'Four... Remove this comment to see the full error message
        this.postIframe(this.constants.beaconBatch, batchedEvents);
      }
    }

    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    if (batchedEvents.events.length > MAX_POLL_QUEUE_SIZE) {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.poll();
    } else {
      let pollTime = MAX_POLL_TIME;

      // if this is the first event on the queue, let's just wait MAX_POLL_TIME
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      if (batchedEvents.events.length === 1) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchingTimerLast' does not exist on typ... Remove this comment to see the full error message
        this.batchingTimerLast = new Date().getTime();
      } else {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchingTimerLast' does not exist on typ... Remove this comment to see the full error message
        const waited = new Date().getTime() - this.batchingTimerLast;

        if (waited > MAX_POLL_TIME) {
          pollTime = MAX_POLL_TIME_INCREMENT;
        } else {
          pollTime = MAX_POLL_TIME - waited + MAX_POLL_TIME_INCREMENT;
        }
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchingTimer' does not exist on type 'F... Remove this comment to see the full error message
      this.batchingTimer = window.setTimeout(this.poll.bind(this), pollTime);
    }
  }

  poll(extraEvent: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingInFlight' does not exist on type 'Fo... Remove this comment to see the full error message
    if (this.pingInFlight === false) {
      const batchEvents = switchBatchStores(BATCH_KEY, BATCH_INFLIGHT_KEY);

      if (extraEvent) {
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        batchEvents.events.push(event);
      }

      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      batchEvents.app = this.state.app;
      // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
      batchEvents.clientVersion = this.state.clientVersion;

      // @ts-ignore ts-migrate(2339) FIXME: Property 'events' does not exist on type 'never'.
      if (batchEvents && batchEvents.events && batchEvents.events.length) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
        const ping = this.constants.method === 'IFRAME' ? this.pingIframe : this.pingPost;
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'pingInFlight' does not exist on type 'Fo... Remove this comment to see the full error message
        this.pingInFlight = true;
        ping(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'constants' does not exist on type 'FourH... Remove this comment to see the full error message
          this.constants.beaconBatch,
          batchEvents,
          function (xhr: $TSFixMe) {
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            this.pingInFlight = false;
            if (xhr.status === 200) {
              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              this.batchAttempts = 0;
              clearBatchFromStore(BATCH_INFLIGHT_KEY);
              if (xhr.responseText) {
                try {
                  const status = JSON.parse(xhr.responseText);
                  if (status['400']) {
                    logger.error(status['400']);
                  }
                } catch (e) {
                  logger.error('can not parse eventing response');
                }
              }
            } else if (xhr.status === 413) {
              // we have an edge case where our queue
              // was rejected by the server because of size limitations
              // we need to get rid of these events as fast as possible
              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              this.batchAttempts = 0;
              clearBatchFromStore(BATCH_INFLIGHT_KEY);

              const store = [];
              // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
              const store2 = batchEvents.events || [];

              // let's lop off the max size we'd like to send
              // could be optimized, but it is an edge case...
              while (store2.length > 0 && JSON.stringify(store).length * 2 < MAX_SERVER_ACCEPTED_SIZE) {
                // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                store.push(store2.pop());
              }

              // ensure we didn't get too big by the last push
              if (JSON.stringify(store).length * 2 > MAX_SERVER_ACCEPTED_SIZE) {
                store.pop();
              }

              // we risk losing events by not listening for an ack or retrying
              // the trade-off is the library stays simple and we fail fast
              // while attempting to preserve new events that may be happening
              if (store.length) {
                // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
                batchEvents.events = store;
                // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
                this.pingPost(this.constants.beaconBatch, batchEvents);
              } else {
                // if we get here, the last event is just to big by itself
                // we must purge it immediately
                // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
                batchEvents.events.pop();
              }

              // if there is more, restore the rest of the events back into
              // the normal loop of things so we can try and recover
              // but we may end up right back here if things are very bad
              if (store2.length) {
                // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
                batchEvents.events = store2;
                setBatchStore(BATCH_KEY, batchEvents);
                // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
                this.batchingTimer = window.setTimeout(this.poll.bind(this, extraEvent), MAX_POLL_TIME_INCREMENT);
              }
            } else {
              mergeBatchStores(BATCH_INFLIGHT_KEY, BATCH_KEY);

              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              this.batchAttempts += 1;

              // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
              if (this.batchAttempts <= MAX_POLL_ATTEMPTS) {
                // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
                this.batchingTimer = window.setTimeout(this.poll.bind(this, extraEvent), MAX_POLL_TIME_INCREMENT);
              }
            }
          }.bind(this)
        );
      }
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'batchingTimer' does not exist on type 'F... Remove this comment to see the full error message
      this.batchingTimer = window.setTimeout(this.poll.bind(this, extraEvent), MAX_POLL_TIME_INCREMENT);
    }
  }
}

export default FourHundred;
