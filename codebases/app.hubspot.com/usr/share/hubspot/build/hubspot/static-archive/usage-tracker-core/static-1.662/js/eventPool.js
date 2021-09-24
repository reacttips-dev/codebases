'use es6';

import { createQueue, debounce, isArray } from './common/helpers';
import { storageKey } from './storageKeys';
var PAGE_LOADED_TIME = Date.now();
var PAGE_LOAD_DEFER_TIMER = 6000;
var DEBOUNCE_TIMER = 2000;
var SERIALIZED_ARRAY = JSON.stringify([]);
var hasDeferredExecution = false;
var pageHasLoaded = false;

var getTimeSincePageLoad = function getTimeSincePageLoad() {
  return Date.now() - PAGE_LOADED_TIME;
};

var shouldDefer = function shouldDefer() {
  if (pageHasLoaded) {
    return false;
  }

  return getTimeSincePageLoad() < PAGE_LOAD_DEFER_TIMER;
};

var execute = function execute(callback) {
  return callback();
};

var deferredExecution = function deferredExecution() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (hasDeferredExecution) {
    return;
  }

  setTimeout(function () {
    execute.apply(void 0, args);
    pageHasLoaded = true;
  }, PAGE_LOAD_DEFER_TIMER - getTimeSincePageLoad());
  hasDeferredExecution = true;
};

var debouncedExecution = debounce(execute, DEBOUNCE_TIMER);
export var scheduleFlush = function scheduleFlush() {
  if (shouldDefer()) {
    deferredExecution.apply(void 0, arguments);
  } else {
    debouncedExecution.apply(void 0, arguments);
  }
};
export var createEventPool = function createEventPool(_ref) {
  var getTempStorage = _ref.getTempStorage,
      setTempStorage = _ref.setTempStorage;
  var isInitialized = false;
  var eventQueue = createQueue();
  return {
    getIsInitialized: function getIsInitialized() {
      return isInitialized;
    },
    initialize: function initialize(_ref2) {
      var normalizeEvent = _ref2.normalizeEvent;

      try {
        var storedEvents = getTempStorage(storageKey) || SERIALIZED_ARRAY;
        var parsedEvents = JSON.parse(storedEvents);

        if (parsedEvents && isArray(parsedEvents)) {
          parsedEvents.forEach(function (event) {
            if (event && typeof event === 'object') {
              eventQueue.enqueue(normalizeEvent(event));
            }
          });
        }

        isInitialized = true;
      } catch (err) {
        /* noOp */
      }
    },
    push: function push(event) {
      try {
        var storedEvents = getTempStorage(storageKey) || SERIALIZED_ARRAY;
        var parsedEvents = JSON.parse(storedEvents);
        parsedEvents.push(event);
        setTempStorage(storageKey, JSON.stringify(parsedEvents));
      } catch (err) {
        /* noOp */
      }

      eventQueue.enqueue(event);
    },
    flush: function flush() {
      var events = [];

      do {
        var event = eventQueue.dequeue();

        if (event) {
          events.unshift(event);
        }
      } while (eventQueue.peek());

      try {
        setTempStorage(storageKey, SERIALIZED_ARRAY);
      } catch (err) {
        /* noOp */
      }

      return events;
    },
    peek: eventQueue.peek
  };
};