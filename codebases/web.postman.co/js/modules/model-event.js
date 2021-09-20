import _ from 'lodash';
import async from 'async';

const DEFAULT_QUEUE_HANDLER_TIMEOUT = 30 * 1000; // 30 seconds

/**
 *
 * @param {String} name
 * @param {String} namespace
 * @param {Object=} data
 * @param {Array[Object]} events
 * @param {Object=} meta
 */
let createEvent = function (name, namespace, data, events, meta) {
    // If the model or the actions are empty then it needs to error out.
    if (_.isEmpty(name) || _.isEmpty(namespace)) {
      throw new Error('ModelEvent: Cannot create event without name or namespace');
    }

    let event = { name, namespace };

    data && (event.data = data);
    events && (event.events = events);
    meta && (event.meta = meta);

    // returns the instruction POJO.
    return event;
  },

  /**
   *
   */
  getEventName = function (event) {
    return event && event.name;
  },

  getEventNamespace = function (event) {
    return event && event.namespace;
  },

  getEventData = function (event) {
    return event && event.data;
  },

  getEventMeta = function (event) {
    return event && event.meta;
  },

  getLowLevelEvents = function (event) {
    return event && event.events;
  },

  getActor = function (event) {
    return event && event.meta && event.meta.actor;
  },

  /**
   * @param {Object} event - Source event Object to extract data from.
   * @param {Object} criteria - Event and namespace to extract data from.
   */
  findEvents = function (event, criteria) {
    if (!event) {
      return [];
    }
    if (criteria.name === event.name && criteria.namespace === event.namespace) {
      return [event];
    }
    let eventData = [];
    _.forEach(event.events, (e) => {
      let data = findEvents(e, criteria);
      if (!_.isEmpty(data)) {
        eventData = data;
        return false;
      }
    });
    return eventData;
  },

  processEvent = function (event, allowedEvents, iteratee, callback) {
    // bail out
    if (!event || !iteratee) {
      return;
    }

    // bail out
    if (!allowedEvents) {
      callback(new Error('Could not find handlers dictionary to process events'));
    }

    let lowLevelEvents;

    // if there is a handler for the current event, process with it
    if (_.includes(allowedEvents, getEventName(event))) {
      (iteratee.length < 2) && console.warn('It looks like you are trying to pass a handler to processEvent without a callback.');

      return iteratee(event, callback);
    }

    lowLevelEvents = getLowLevelEvents(event);

    // otherwise try if the low level events can be handled
    async.eachSeries(lowLevelEvents, function (event, cb) {
      // resetting call stack here
      // for really large events the call stack can blow up really fast
      setTimeout(function () {
        return processEvent(event, allowedEvents, iteratee, cb);
      }, 0);
    }, callback);
  },

  /**
   * For a given event in a heirarchical structure perform a unit of work on match of a criteria.
   *
   * The event is processed recursively until a match is found in the criteria. If a match is found
   * the processing stops at that level.
   *
   * @param {Object} event
   * @param {Array.<Object>} allowedEvents
   * @param {Function} iteratee - your work, executed synchronously
   *
   */
  processEventSync = function (event, allowedEvents, iteratee) {
    // bail out
    if (!event || !iteratee || !allowedEvents) {
      return;
    }

    let lowLevelEvents;

    // if there is a handler for the current event, process with it
    if (_.includes(allowedEvents, getEventName(event))) {
      return iteratee(event);
    }

    lowLevelEvents = getLowLevelEvents(event);

    _.forEach(lowLevelEvents, (childEvent) => {
      processEventSync(childEvent, allowedEvents, iteratee);
    });
  },

  subscribeToQueue = function subscribeToQueue (handler, timeout) {
    if (!handler) {
      return;
    }

    let modelEventsChannel = pm.eventBus.channel('model-events'),
        handlerQueue,
        disposeEventListener;

    function asyncQueueWorker (event, cb) {
      // flag used to make sure the worker callback `cb` is not called multiple times.
      // queue will throw error if `cb` is called multiple times.
      let done = false;

      // Watchdog that calls cb in 1 minute so that queue is not blocked
      let watchdog = setTimeout(() => {
        !done && _.isFunction(cb) && cb();
        done = true;
        pm.logger.error('Model Event queue terminating handler for: ', getEventNamespace(event), getEventName(event));
      }, timeout || DEFAULT_QUEUE_HANDLER_TIMEOUT);

      const doneCb = () => {
        watchdog && clearTimeout(watchdog);
        !done && _.isFunction(cb) && cb();
        done = true;
      };

      try {
        handler(event, doneCb);
      }
      catch (e) {
        watchdog && clearTimeout(watchdog);
        !done && _.isFunction(cb) && cb();
        done = true;
      }
    }

    handlerQueue = async.queue(asyncQueueWorker, 1);

    disposeEventListener = modelEventsChannel.subscribe(function (event) {
      handlerQueue.push(event, _.noop);
    });

    return function disposeEventQueueSubscription () {
      disposeEventListener && disposeEventListener();
      handlerQueue.kill();
    };
  },

  subscribeToCurrentWindowQueue = function (handler, timeout) {
    if (!handler) {
      return;
    }

    let windowEventsChannel = pm.windowEvents,
        handlerQueue;

    function asyncQueueWorker (event, cb) {
      // flag used to make sure the worker callback `cb` is not called multiple times.
      // queue will throw error if `cb` is called multiple times.
      let done = false;

      // Watchdog that calls cb in 1 minute so that queue is not blocked
      let watchdog = setTimeout(() => {
        !done && _.isFunction(cb) && cb();
        done = true;
        pm.logger.error('Model Event queue terminating handler for: ', getEventNamespace(event), getEventName(event));
      }, timeout || DEFAULT_QUEUE_HANDLER_TIMEOUT);

      const doneCb = () => {
        watchdog && clearTimeout(watchdog);
        !done && _.isFunction(cb) && cb();
        done = true;
      };

      try {
        handler(event, doneCb);
      }
      catch (e) {
        watchdog && clearTimeout(watchdog);
        !done && _.isFunction(cb) && cb();
        done = true;
      }
    }

    handlerQueue = async.queue(asyncQueueWorker, 1);

    let windowEventsListener = function (event) {
      handlerQueue.push(event, _.noop);
    };

    windowEventsChannel.addListener('window-event', windowEventsListener);

    return function disposeEventQueueSubscription () {
      windowEventsChannel.removeListener('window-event', windowEventsListener);
      handlerQueue.kill();
    };
  };


export {
  createEvent,
  getEventName,
  getEventData,
  getEventMeta,
  getEventNamespace,
  getLowLevelEvents,
  getActor,
  processEvent,
  processEventSync,
  findEvents,
  subscribeToQueue,
  subscribeToCurrentWindowQueue
};
