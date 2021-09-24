'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PropTypes = _interopDefault(require('prop-types'));
var React = require('react');
var React__default = _interopDefault(React);
var redux = require('redux');
var isArray = _interopDefault(require('hs-lodash/isArray'));
var isObject = _interopDefault(require('hs-lodash/isObject'));
var without = _interopDefault(require('hs-lodash/without'));
var xor = _interopDefault(require('hs-lodash/xor'));
var intersection = _interopDefault(require('hs-lodash/intersection'));
var noop = _interopDefault(require('hs-lodash/noop'));
var hoistStatics = _interopDefault(require('hoist-non-react-statics'));
var isPlainObject = _interopDefault(require('hs-lodash/isPlainObject'));

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var browser = invariant;

function matchesType(targetType, draggedItemType) {
  if (isArray(targetType)) {
    return targetType.some(function (t) {
      return t === draggedItemType;
    });
  } else {
    return targetType === draggedItemType;
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var BEGIN_DRAG = 'dnd-core/BEGIN_DRAG';
var PUBLISH_DRAG_SOURCE = 'dnd-core/PUBLISH_DRAG_SOURCE';
var HOVER = 'dnd-core/HOVER';
var DROP = 'dnd-core/DROP';
var END_DRAG = 'dnd-core/END_DRAG';

function beginDrag(sourceIds) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { publishSource: true, clientOffset: null };
  var publishSource = options.publishSource,
      clientOffset = options.clientOffset,
      getSourceClientOffset = options.getSourceClientOffset;

  browser(isArray(sourceIds), 'Expected sourceIds to be an array.');

  var monitor = this.getMonitor();
  var registry = this.getRegistry();
  browser(!monitor.isDragging(), 'Cannot call beginDrag while dragging.');

  for (var i = 0; i < sourceIds.length; i++) {
    browser(registry.getSource(sourceIds[i]), 'Expected sourceIds to be registered.');
  }

  var sourceId = null;
  for (var _i = sourceIds.length - 1; _i >= 0; _i--) {
    if (monitor.canDragSource(sourceIds[_i])) {
      sourceId = sourceIds[_i];
      break;
    }
  }
  if (sourceId === null) {
    return;
  }

  var sourceClientOffset = null;
  if (clientOffset) {
    browser(typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
    sourceClientOffset = getSourceClientOffset(sourceId);
  }

  var source = registry.getSource(sourceId);
  var item = source.beginDrag(monitor, sourceId);
  browser(isObject(item), 'Item must be an object.');

  registry.pinSource(sourceId);

  var itemType = registry.getSourceType(sourceId);
  return {
    type: BEGIN_DRAG,
    itemType: itemType,
    item: item,
    sourceId: sourceId,
    clientOffset: clientOffset,
    sourceClientOffset: sourceClientOffset,
    isSourcePublic: publishSource
  };
}

function publishDragSource() {
  var monitor = this.getMonitor();
  if (!monitor.isDragging()) {
    return;
  }

  return { type: PUBLISH_DRAG_SOURCE };
}

function hover(targetIdsArg) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$clientOffset = _ref.clientOffset,
      clientOffset = _ref$clientOffset === undefined ? null : _ref$clientOffset;

  browser(isArray(targetIdsArg), 'Expected targetIds to be an array.');
  var targetIds = targetIdsArg.slice(0);

  var monitor = this.getMonitor();
  var registry = this.getRegistry();
  browser(monitor.isDragging(), 'Cannot call hover while not dragging.');
  browser(!monitor.didDrop(), 'Cannot call hover after drop.');

  // First check invariants.
  for (var i = 0; i < targetIds.length; i++) {
    var targetId = targetIds[i];
    browser(targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');

    var target = registry.getTarget(targetId);
    browser(target, 'Expected targetIds to be registered.');
  }

  var draggedItemType = monitor.getItemType();

  // Remove those targetIds that don't match the targetType.  This
  // fixes shallow isOver which would only be non-shallow because of
  // non-matching targets.
  for (var _i2 = targetIds.length - 1; _i2 >= 0; _i2--) {
    var _targetId = targetIds[_i2];
    var targetType = registry.getTargetType(_targetId);
    if (!matchesType(targetType, draggedItemType)) {
      targetIds.splice(_i2, 1);
    }
  }

  // Finally call hover on all matching targets.
  for (var _i3 = 0; _i3 < targetIds.length; _i3++) {
    var _targetId2 = targetIds[_i3];
    var _target = registry.getTarget(_targetId2);
    _target.hover(monitor, _targetId2);
  }

  return {
    type: HOVER,
    targetIds: targetIds,
    clientOffset: clientOffset
  };
}

function drop() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var monitor = this.getMonitor();
  var registry = this.getRegistry();
  browser(monitor.isDragging(), 'Cannot call drop while not dragging.');
  browser(!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');

  var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);

  targetIds.reverse();
  targetIds.forEach(function (targetId, index) {
    var target = registry.getTarget(targetId);

    var dropResult = target.drop(monitor, targetId);
    browser(typeof dropResult === 'undefined' || isObject(dropResult), 'Drop result must either be an object or undefined.');
    if (typeof dropResult === 'undefined') {
      dropResult = index === 0 ? {} : monitor.getDropResult();
    }

    _this.store.dispatch({
      type: DROP,
      dropResult: _extends({}, options, dropResult)
    });
  });
}

function endDrag() {
  var monitor = this.getMonitor();
  var registry = this.getRegistry();
  browser(monitor.isDragging(), 'Cannot call endDrag while not dragging.');

  var sourceId = monitor.getSourceId();
  var source = registry.getSource(sourceId, true);
  source.endDrag(monitor, sourceId);

  registry.unpinSource();

  return { type: END_DRAG };
}

var dragDropActions = /*#__PURE__*/Object.freeze({
  BEGIN_DRAG: BEGIN_DRAG,
  PUBLISH_DRAG_SOURCE: PUBLISH_DRAG_SOURCE,
  HOVER: HOVER,
  DROP: DROP,
  END_DRAG: END_DRAG,
  beginDrag: beginDrag,
  publishDragSource: publishDragSource,
  hover: hover,
  drop: drop,
  endDrag: endDrag
});

var initialState = {
  initialSourceClientOffset: null,
  initialClientOffset: null,
  clientOffset: null
};

function areOffsetsEqual(offsetA, offsetB) {
  if (offsetA === offsetB) {
    return true;
  }
  return offsetA && offsetB && offsetA.x === offsetB.x && offsetA.y === offsetB.y;
}

function dragOffset() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case BEGIN_DRAG:
      return {
        initialSourceClientOffset: action.sourceClientOffset,
        initialClientOffset: action.clientOffset,
        clientOffset: action.clientOffset
      };
    case HOVER:
      if (areOffsetsEqual(state.clientOffset, action.clientOffset)) {
        return state;
      }
      return _extends({}, state, {
        clientOffset: action.clientOffset
      });
    case END_DRAG:
    case DROP:
      return initialState;
    default:
      return state;
  }
}

function getSourceClientOffset(state) {
  var clientOffset = state.clientOffset,
      initialClientOffset = state.initialClientOffset,
      initialSourceClientOffset = state.initialSourceClientOffset;

  if (!clientOffset || !initialClientOffset || !initialSourceClientOffset) {
    return null;
  }
  return {
    x: clientOffset.x + initialSourceClientOffset.x - initialClientOffset.x,
    y: clientOffset.y + initialSourceClientOffset.y - initialClientOffset.y
  };
}

function getDifferenceFromInitialOffset(state) {
  var clientOffset = state.clientOffset,
      initialClientOffset = state.initialClientOffset;

  if (!clientOffset || !initialClientOffset) {
    return null;
  }
  return {
    x: clientOffset.x - initialClientOffset.x,
    y: clientOffset.y - initialClientOffset.y
  };
}

var ADD_SOURCE = 'dnd-core/ADD_SOURCE';
var ADD_TARGET = 'dnd-core/ADD_TARGET';
var REMOVE_SOURCE = 'dnd-core/REMOVE_SOURCE';
var REMOVE_TARGET = 'dnd-core/REMOVE_TARGET';

function addSource(sourceId) {
  return {
    type: ADD_SOURCE,
    sourceId: sourceId
  };
}

function addTarget(targetId) {
  return {
    type: ADD_TARGET,
    targetId: targetId
  };
}

function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    sourceId: sourceId
  };
}

function removeTarget(targetId) {
  return {
    type: REMOVE_TARGET,
    targetId: targetId
  };
}

var initialState$1 = {
  itemType: null,
  item: null,
  sourceId: null,
  targetIds: [],
  dropResult: null,
  didDrop: false,
  isSourcePublic: null
};

function dragOperation() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState$1;
  var action = arguments[1];

  switch (action.type) {
    case BEGIN_DRAG:
      return _extends({}, state, {
        itemType: action.itemType,
        item: action.item,
        sourceId: action.sourceId,
        isSourcePublic: action.isSourcePublic,
        dropResult: null,
        didDrop: false
      });
    case PUBLISH_DRAG_SOURCE:
      return _extends({}, state, {
        isSourcePublic: true
      });
    case HOVER:
      return _extends({}, state, {
        targetIds: action.targetIds
      });
    case REMOVE_TARGET:
      if (state.targetIds.indexOf(action.targetId) === -1) {
        return state;
      }
      return _extends({}, state, {
        targetIds: without(state.targetIds, action.targetId)
      });
    case DROP:
      return _extends({}, state, {
        dropResult: action.dropResult,
        didDrop: true,
        targetIds: []
      });
    case END_DRAG:
      return _extends({}, state, {
        itemType: null,
        item: null,
        sourceId: null,
        dropResult: null,
        didDrop: false,
        isSourcePublic: null,
        targetIds: []
      });
    default:
      return state;
  }
}

function refCount() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var action = arguments[1];

  switch (action.type) {
    case ADD_SOURCE:
    case ADD_TARGET:
      return state + 1;
    case REMOVE_SOURCE:
    case REMOVE_TARGET:
      return state - 1;
    default:
      return state;
  }
}

var NONE = [];
var ALL = [];

function dirtyHandlerIds() {
  var action = arguments[1];
  var dragOperation = arguments[2];

  switch (action.type) {
    case HOVER:
      break;
    case ADD_SOURCE:
    case ADD_TARGET:
    case REMOVE_TARGET:
    case REMOVE_SOURCE:
      return NONE;
    case BEGIN_DRAG:
    case PUBLISH_DRAG_SOURCE:
    case END_DRAG:
    case DROP:
    default:
      return ALL;
  }

  var targetIds = action.targetIds;
  var prevTargetIds = dragOperation.targetIds;

  var result = xor(targetIds, prevTargetIds);

  var didChange = false;
  if (result.length === 0) {
    for (var i = 0; i < targetIds.length; i++) {
      if (targetIds[i] !== prevTargetIds[i]) {
        didChange = true;
        break;
      }
    }
  } else {
    didChange = true;
  }

  if (!didChange) {
    return NONE;
  }

  var prevInnermostTargetId = prevTargetIds[prevTargetIds.length - 1];
  var innermostTargetId = targetIds[targetIds.length - 1];

  if (prevInnermostTargetId !== innermostTargetId) {
    if (prevInnermostTargetId) {
      result.push(prevInnermostTargetId);
    }
    if (innermostTargetId) {
      result.push(innermostTargetId);
    }
  }

  return result;
}

function areDirty(state, handlerIds) {
  if (state === NONE) {
    return false;
  }

  if (state === ALL || typeof handlerIds === 'undefined') {
    return true;
  }

  return intersection(handlerIds, state).length > 0;
}

function stateId() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  return state + 1;
}

function reduce() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  return {
    dirtyHandlerIds: dirtyHandlerIds(state.dirtyHandlerIds, action, state.dragOperation),
    dragOffset: dragOffset(state.dragOffset, action),
    refCount: refCount(state.refCount, action),
    dragOperation: dragOperation(state.dragOperation, action),
    stateId: stateId(state.stateId)
  };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.

var browserRaw = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof commonjsGlobal !== "undefined" ? commonjsGlobal : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

    // MessageChannels are desirable because they give direct access to the HTML
    // task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
    // 11-12, and in web workers in many engines.
    // Although message channels yield to any queued rendering and IO tasks, they
    // would be better than imposing the 4ms delay of timers.
    // However, they do not work reliably in Internet Explorer or Safari.

    // Internet Explorer 10 is the only browser that has setImmediate but does
    // not have MutationObservers.
    // Although setImmediate yields to the browser's renderer, it would be
    // preferrable to falling back to setTimeout since it does not have
    // the minimum 4ms penalty.
    // Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
    // Desktop to a lesser extent) that renders both setImmediate and
    // MessageChannel useless for the purposes of ASAP.
    // https://github.com/kriskowal/q/issues/396

    // Timers are implemented universally.
    // We fall back to timers in workers in most engines, and in foreground
    // contexts in the following browsers.
    // However, note that even this simple case requires nuances to operate in a
    // broad spectrum of browsers.
    //
    // - Firefox 3-13
    // - Internet Explorer 6-9
    // - iPad Safari 4.3
    // - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, { characterData: true });
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// rawAsap provides everything we need except exception management.


// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = browserRaw.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
var browserAsap = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    browserRaw(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

var nextUniqueId = 0;

function getNextUniqueId() {
  return nextUniqueId++;
}

var HandlerRoles = {
  SOURCE: 'SOURCE',
  TARGET: 'TARGET'
};

function validateSourceContract(source) {
  browser(typeof source.canDrag === 'function', 'Expected canDrag to be a function.');
  browser(typeof source.beginDrag === 'function', 'Expected beginDrag to be a function.');
  browser(typeof source.endDrag === 'function', 'Expected endDrag to be a function.');
}

function validateTargetContract(target) {
  browser(typeof target.canDrop === 'function', 'Expected canDrop to be a function.');
  browser(typeof target.hover === 'function', 'Expected hover to be a function.');
  browser(typeof target.drop === 'function', 'Expected beginDrag to be a function.');
}

function validateType(type, allowArray) {
  if (allowArray && isArray(type)) {
    type.forEach(function (t) {
      return validateType(t, false);
    });
    return;
  }

  browser(typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'symbol', allowArray ? 'Type can only be a string, a symbol, or an array of either.' : 'Type can only be a string or a symbol.');
}

function getNextHandlerId(role) {
  var id = getNextUniqueId().toString();
  switch (role) {
    case HandlerRoles.SOURCE:
      return 'S' + id;
    case HandlerRoles.TARGET:
      return 'T' + id;
    default:
      browser(false, 'Unknown role: ' + role);
  }
}

function parseRoleFromHandlerId(handlerId) {
  switch (handlerId[0]) {
    case 'S':
      return HandlerRoles.SOURCE;
    case 'T':
      return HandlerRoles.TARGET;
    default:
      browser(false, 'Cannot parse handler ID: ' + handlerId);
  }
}

var HandlerRegistry = function () {
  function HandlerRegistry(store) {
    classCallCheck(this, HandlerRegistry);

    this.store = store;

    this.types = {};
    this.handlers = {};

    this.pinnedSourceId = null;
    this.pinnedSource = null;
  }

  createClass(HandlerRegistry, [{
    key: 'addSource',
    value: function addSource$1(type, source) {
      validateType(type);
      validateSourceContract(source);

      var sourceId = this.addHandler(HandlerRoles.SOURCE, type, source);
      this.store.dispatch(addSource(sourceId));
      return sourceId;
    }
  }, {
    key: 'addTarget',
    value: function addTarget$1(type, target) {
      validateType(type, true);
      validateTargetContract(target);

      var targetId = this.addHandler(HandlerRoles.TARGET, type, target);
      this.store.dispatch(addTarget(targetId));
      return targetId;
    }
  }, {
    key: 'addHandler',
    value: function addHandler(role, type, handler) {
      var id = getNextHandlerId(role);
      this.types[id] = type;
      this.handlers[id] = handler;

      return id;
    }
  }, {
    key: 'containsHandler',
    value: function containsHandler(handler) {
      var _this = this;

      return Object.keys(this.handlers).some(function (key) {
        return _this.handlers[key] === handler;
      });
    }
  }, {
    key: 'getSource',
    value: function getSource(sourceId, includePinned) {
      browser(this.isSourceId(sourceId), 'Expected a valid source ID.');

      var isPinned = includePinned && sourceId === this.pinnedSourceId;
      var source = isPinned ? this.pinnedSource : this.handlers[sourceId];

      return source;
    }
  }, {
    key: 'getTarget',
    value: function getTarget(targetId) {
      browser(this.isTargetId(targetId), 'Expected a valid target ID.');
      return this.handlers[targetId];
    }
  }, {
    key: 'getSourceType',
    value: function getSourceType(sourceId) {
      browser(this.isSourceId(sourceId), 'Expected a valid source ID.');
      return this.types[sourceId];
    }
  }, {
    key: 'getTargetType',
    value: function getTargetType(targetId) {
      browser(this.isTargetId(targetId), 'Expected a valid target ID.');
      return this.types[targetId];
    }
  }, {
    key: 'isSourceId',
    value: function isSourceId(handlerId) {
      var role = parseRoleFromHandlerId(handlerId);
      return role === HandlerRoles.SOURCE;
    }
  }, {
    key: 'isTargetId',
    value: function isTargetId(handlerId) {
      var role = parseRoleFromHandlerId(handlerId);
      return role === HandlerRoles.TARGET;
    }
  }, {
    key: 'removeSource',
    value: function removeSource$1(sourceId) {
      var _this2 = this;

      browser(this.getSource(sourceId), 'Expected an existing source.');
      this.store.dispatch(removeSource(sourceId));

      browserAsap(function () {
        delete _this2.handlers[sourceId];
        delete _this2.types[sourceId];
      });
    }
  }, {
    key: 'removeTarget',
    value: function removeTarget$1(targetId) {
      var _this3 = this;

      browser(this.getTarget(targetId), 'Expected an existing target.');
      this.store.dispatch(removeTarget(targetId));

      browserAsap(function () {
        delete _this3.handlers[targetId];
        delete _this3.types[targetId];
      });
    }
  }, {
    key: 'pinSource',
    value: function pinSource(sourceId) {
      var source = this.getSource(sourceId);
      browser(source, 'Expected an existing source.');

      this.pinnedSourceId = sourceId;
      this.pinnedSource = source;
    }
  }, {
    key: 'unpinSource',
    value: function unpinSource() {
      browser(this.pinnedSource, 'No source is pinned at the time.');

      this.pinnedSourceId = null;
      this.pinnedSource = null;
    }
  }]);
  return HandlerRegistry;
}();

var DragDropMonitor = function () {
  function DragDropMonitor(store) {
    classCallCheck(this, DragDropMonitor);

    this.store = store;
    this.registry = new HandlerRegistry(store);
  }

  createClass(DragDropMonitor, [{
    key: 'subscribeToStateChange',
    value: function subscribeToStateChange(listener) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var handlerIds = options.handlerIds;

      browser(typeof listener === 'function', 'listener must be a function.');
      browser(typeof handlerIds === 'undefined' || isArray(handlerIds), 'handlerIds, when specified, must be an array of strings.');

      var prevStateId = this.store.getState().stateId;
      var handleChange = function handleChange() {
        var state = _this.store.getState();
        var currentStateId = state.stateId;
        try {
          var canSkipListener = currentStateId === prevStateId || currentStateId === prevStateId + 1 && !areDirty(state.dirtyHandlerIds, handlerIds);

          if (!canSkipListener) {
            listener();
          }
        } finally {
          prevStateId = currentStateId;
        }
      };

      return this.store.subscribe(handleChange);
    }
  }, {
    key: 'subscribeToOffsetChange',
    value: function subscribeToOffsetChange(listener) {
      var _this2 = this;

      browser(typeof listener === 'function', 'listener must be a function.');

      var previousState = this.store.getState().dragOffset;
      var handleChange = function handleChange() {
        var nextState = _this2.store.getState().dragOffset;
        if (nextState === previousState) {
          return;
        }

        previousState = nextState;
        listener();
      };

      return this.store.subscribe(handleChange);
    }
  }, {
    key: 'canDragSource',
    value: function canDragSource(sourceId) {
      var source = this.registry.getSource(sourceId);
      browser(source, 'Expected to find a valid source.');

      if (this.isDragging()) {
        return false;
      }

      return source.canDrag(this, sourceId);
    }
  }, {
    key: 'canDropOnTarget',
    value: function canDropOnTarget(targetId) {
      var target = this.registry.getTarget(targetId);
      browser(target, 'Expected to find a valid target.');

      if (!this.isDragging() || this.didDrop()) {
        return false;
      }

      var targetType = this.registry.getTargetType(targetId);
      var draggedItemType = this.getItemType();
      return matchesType(targetType, draggedItemType) && target.canDrop(this, targetId);
    }
  }, {
    key: 'isDragging',
    value: function isDragging() {
      return Boolean(this.getItemType());
    }
  }, {
    key: 'isDraggingSource',
    value: function isDraggingSource(sourceId) {
      var source = this.registry.getSource(sourceId, true);
      browser(source, 'Expected to find a valid source.');

      if (!this.isDragging() || !this.isSourcePublic()) {
        return false;
      }

      var sourceType = this.registry.getSourceType(sourceId);
      var draggedItemType = this.getItemType();
      if (sourceType !== draggedItemType) {
        return false;
      }

      return source.isDragging(this, sourceId);
    }
  }, {
    key: 'isOverTarget',
    value: function isOverTarget(targetId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { shallow: false };
      var shallow = options.shallow;

      if (!this.isDragging()) {
        return false;
      }

      var targetType = this.registry.getTargetType(targetId);
      var draggedItemType = this.getItemType();
      if (!matchesType(targetType, draggedItemType)) {
        return false;
      }

      var targetIds = this.getTargetIds();
      if (!targetIds.length) {
        return false;
      }

      var index = targetIds.indexOf(targetId);
      if (shallow) {
        return index === targetIds.length - 1;
      } else {
        return index > -1;
      }
    }
  }, {
    key: 'getItemType',
    value: function getItemType() {
      return this.store.getState().dragOperation.itemType;
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      return this.store.getState().dragOperation.item;
    }
  }, {
    key: 'getSourceId',
    value: function getSourceId() {
      return this.store.getState().dragOperation.sourceId;
    }
  }, {
    key: 'getTargetIds',
    value: function getTargetIds() {
      return this.store.getState().dragOperation.targetIds;
    }
  }, {
    key: 'getDropResult',
    value: function getDropResult() {
      return this.store.getState().dragOperation.dropResult;
    }
  }, {
    key: 'didDrop',
    value: function didDrop() {
      return this.store.getState().dragOperation.didDrop;
    }
  }, {
    key: 'isSourcePublic',
    value: function isSourcePublic() {
      return this.store.getState().dragOperation.isSourcePublic;
    }
  }, {
    key: 'getInitialClientOffset',
    value: function getInitialClientOffset() {
      return this.store.getState().dragOffset.initialClientOffset;
    }
  }, {
    key: 'getInitialSourceClientOffset',
    value: function getInitialSourceClientOffset() {
      return this.store.getState().dragOffset.initialSourceClientOffset;
    }
  }, {
    key: 'getClientOffset',
    value: function getClientOffset() {
      return this.store.getState().dragOffset.clientOffset;
    }
  }, {
    key: 'getSourceClientOffset',
    value: function getSourceClientOffset$1() {
      return getSourceClientOffset(this.store.getState().dragOffset);
    }
  }, {
    key: 'getDifferenceFromInitialOffset',
    value: function getDifferenceFromInitialOffset$1() {
      return getDifferenceFromInitialOffset(this.store.getState().dragOffset);
    }
  }]);
  return DragDropMonitor;
}();

var DragDropManager = function () {
  function DragDropManager(createBackend) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, DragDropManager);

    var store = redux.createStore(reduce);
    this.context = context;
    this.store = store;
    this.monitor = new DragDropMonitor(store);
    this.registry = this.monitor.registry;
    this.backend = createBackend(this);

    store.subscribe(this.handleRefCountChange.bind(this));
  }

  createClass(DragDropManager, [{
    key: 'handleRefCountChange',
    value: function handleRefCountChange() {
      var shouldSetUp = this.store.getState().refCount > 0;
      if (shouldSetUp && !this.isSetUp) {
        this.backend.setup();
        this.isSetUp = true;
      } else if (!shouldSetUp && this.isSetUp) {
        this.backend.teardown();
        this.isSetUp = false;
      }
    }
  }, {
    key: 'getContext',
    value: function getContext() {
      return this.context;
    }
  }, {
    key: 'getMonitor',
    value: function getMonitor() {
      return this.monitor;
    }
  }, {
    key: 'getBackend',
    value: function getBackend() {
      return this.backend;
    }
  }, {
    key: 'getRegistry',
    value: function getRegistry() {
      return this.registry;
    }
  }, {
    key: 'getActions',
    value: function getActions() {
      var manager = this;
      var dispatch = this.store.dispatch;


      function bindActionCreator(actionCreator) {
        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var action = actionCreator.apply(manager, args);
          if (typeof action !== 'undefined') {
            dispatch(action);
          }
        };
      }

      return Object.keys(dragDropActions).filter(function (key) {
        return typeof dragDropActions[key] === 'function';
      }).reduce(function (boundActions, key) {
        var action = dragDropActions[key];
        boundActions[key] = bindActionCreator(action); // eslint-disable-line no-param-reassign
        return boundActions;
      }, {});
    }
  }]);
  return DragDropManager;
}();

var DragSource = function () {
  function DragSource() {
    classCallCheck(this, DragSource);
  }

  createClass(DragSource, [{
    key: "canDrag",
    value: function canDrag() {
      return true;
    }
  }, {
    key: "isDragging",
    value: function isDragging(monitor, handle) {
      return handle === monitor.getSourceId();
    }
  }, {
    key: "endDrag",
    value: function endDrag() {}
  }]);
  return DragSource;
}();

var DropTarget = function () {
  function DropTarget() {
    classCallCheck(this, DropTarget);
  }

  createClass(DropTarget, [{
    key: "canDrop",
    value: function canDrop() {
      return true;
    }
  }, {
    key: "hover",
    value: function hover() {}
  }, {
    key: "drop",
    value: function drop() {}
  }]);
  return DropTarget;
}();

var TestBackend = function () {
  function TestBackend(manager) {
    classCallCheck(this, TestBackend);

    this.actions = manager.getActions();
  }

  createClass(TestBackend, [{
    key: 'setup',
    value: function setup() {
      this.didCallSetup = true;
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      this.didCallTeardown = true;
    }
  }, {
    key: 'connectDragSource',
    value: function connectDragSource() {
      return noop;
    }
  }, {
    key: 'connectDragPreview',
    value: function connectDragPreview() {
      return noop;
    }
  }, {
    key: 'connectDropTarget',
    value: function connectDropTarget() {
      return noop;
    }
  }, {
    key: 'simulateBeginDrag',
    value: function simulateBeginDrag(sourceIds, options) {
      this.actions.beginDrag(sourceIds, options);
    }
  }, {
    key: 'simulatePublishDragSource',
    value: function simulatePublishDragSource() {
      this.actions.publishDragSource();
    }
  }, {
    key: 'simulateHover',
    value: function simulateHover(targetIds, options) {
      this.actions.hover(targetIds, options);
    }
  }, {
    key: 'simulateDrop',
    value: function simulateDrop() {
      this.actions.drop();
    }
  }, {
    key: 'simulateEndDrag',
    value: function simulateEndDrag() {
      this.actions.endDrag();
    }
  }]);
  return TestBackend;
}();

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant$1 = function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var browser$1 = invariant$1;

function checkDecoratorArguments(functionName, signature) {
  if (process.env.NODE_ENV !== 'production') {
    for (var i = 0; i < (arguments.length <= 2 ? 0 : arguments.length - 2); i += 1) {
      var arg = arguments.length <= i + 2 ? undefined : arguments[i + 2];
      if (arg && arg.prototype && arg.prototype.render) {
        console.error( // eslint-disable-line no-console
        'You seem to be applying the arguments in the wrong order. ' + ('It should be ' + functionName + '(' + signature + ')(Component), not the other way around. ') + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#you-seem-to-be-applying-the-arguments-in-the-wrong-order');
        return;
      }
    }
  }
}

var CHILD_CONTEXT_TYPES = {
  dragDropManager: PropTypes.object.isRequired
};

var createChildContext = function createChildContext(backend, context) {
  return {
    dragDropManager: new DragDropManager(backend, context)
  };
};

var unpackBackendForEs5Users = function unpackBackendForEs5Users(backendOrModule) {
  // Auto-detect ES6 default export for people still using ES5
  var backend = backendOrModule;
  if ((typeof backend === 'undefined' ? 'undefined' : _typeof(backend)) === 'object' && typeof backend.default === 'function') {
    backend = backend.default;
  }
  browser$1(typeof backend === 'function', 'Expected the backend to be a function or an ES6 module exporting a default function. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-drop-context.html');
  return backend;
};

function DragDropContext(backendOrModule) {
  checkDecoratorArguments.apply(undefined, ['DragDropContext', 'backend'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params

  var backend = unpackBackendForEs5Users(backendOrModule);
  var childContext = createChildContext(backend);

  return function decorateContext(DecoratedComponent) {
    var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    var DragDropContextContainer = function (_Component) {
      inherits(DragDropContextContainer, _Component);

      function DragDropContextContainer() {
        classCallCheck(this, DragDropContextContainer);
        return possibleConstructorReturn(this, (DragDropContextContainer.__proto__ || Object.getPrototypeOf(DragDropContextContainer)).apply(this, arguments));
      }

      createClass(DragDropContextContainer, [{
        key: 'getDecoratedComponentInstance',
        value: function getDecoratedComponentInstance() {
          browser$1(this.child, 'In order to access an instance of the decorated component it can ' + 'not be a stateless component.');
          return this.child;
        }
      }, {
        key: 'getManager',
        value: function getManager() {
          return childContext.dragDropManager;
        }
      }, {
        key: 'getChildContext',
        value: function getChildContext() {
          return childContext;
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return React__default.createElement(DecoratedComponent, _extends({}, this.props, {
            ref: function ref(child) {
              return _this2.child = child;
            }
          }));
        }
      }]);
      return DragDropContextContainer;
    }(React.Component);

    DragDropContextContainer.DecoratedComponent = DecoratedComponent;
    DragDropContextContainer.displayName = 'DragDropContext(' + displayName + ')';
    DragDropContextContainer.childContextTypes = CHILD_CONTEXT_TYPES;


    return hoistStatics(DragDropContextContainer, DecoratedComponent);
  };
}

/**
 * This class is a React-Component based version of the DragDropContext.
 * This is an alternative to decorating an application component with an ES7 decorator.
 */

var DragDropContextProvider = function (_Component) {
  inherits(DragDropContextProvider, _Component);

  function DragDropContextProvider(props, context) {
    classCallCheck(this, DragDropContextProvider);

    var _this = possibleConstructorReturn(this, (DragDropContextProvider.__proto__ || Object.getPrototypeOf(DragDropContextProvider)).call(this, props, context));

    _this.backend = unpackBackendForEs5Users(props.backend);
    return _this;
  }

  createClass(DragDropContextProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _this2 = this;

      /**
       * This property determines which window global to use for creating the DragDropManager.
       * If a window has been injected explicitly via props, that is used first. If it is available
       * as a context value, then use that, otherwise use the browser global.
       */
      var getWindow = function getWindow() {
        if (_this2.props && _this2.props.window) {
          return _this2.props.window;
        } else if (_this2.context && _this2.context.window) {
          return _this2.context.window;
        } else if (typeof window !== 'undefined') {
          return window;
        }
        return undefined;
      };

      return createChildContext(this.backend, { window: getWindow() });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.Children.only(this.props.children);
    }
  }]);
  return DragDropContextProvider;
}(React.Component);

DragDropContextProvider.propTypes = {
  backend: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  children: PropTypes.element.isRequired,
  window: PropTypes.object // eslint-disable-line react/forbid-prop-types
};
DragDropContextProvider.defaultProps = {
  window: undefined
};
DragDropContextProvider.childContextTypes = CHILD_CONTEXT_TYPES;
DragDropContextProvider.displayName = 'DragDropContextProvider';
DragDropContextProvider.contextTypes = {
  window: PropTypes.object
};

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i += 1) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }

    var valA = objA[keysA[i]];
    var valB = objB[keysA[i]];

    if (valA !== valB) {
      return false;
    }
  }

  return true;
}

function shallowEqualScalar(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i += 1) {
    if (!hasOwn.call(objB, keysA[i])) {
      return false;
    }

    var valA = objA[keysA[i]];
    var valB = objB[keysA[i]];

    if (valA !== valB || (typeof valA === 'undefined' ? 'undefined' : _typeof(valA)) === 'object' || (typeof valB === 'undefined' ? 'undefined' : _typeof(valB)) === 'object') {
      return false;
    }
  }

  return true;
}

function DragLayer(collect) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  checkDecoratorArguments.apply(undefined, ['DragLayer', 'collect[, options]'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params
  browser$1(typeof collect === 'function', 'Expected "collect" provided as the first argument to DragLayer ' + 'to be a function that collects props to inject into the component. ', 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', collect);
  browser$1(isPlainObject(options), 'Expected "options" provided as the second argument to DragLayer to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html', options);

  return function decorateLayer(DecoratedComponent) {
    var _options$arePropsEqua = options.arePropsEqual,
        arePropsEqual = _options$arePropsEqua === undefined ? shallowEqualScalar : _options$arePropsEqua;

    var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    var DragLayerContainer = function (_Component) {
      inherits(DragLayerContainer, _Component);
      createClass(DragLayerContainer, [{
        key: 'getDecoratedComponentInstance',
        value: function getDecoratedComponentInstance() {
          browser$1(this.child, 'In order to access an instance of the decorated component it can ' + 'not be a stateless component.');
          return this.child;
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !arePropsEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
        }
      }]);

      function DragLayerContainer(props, context) {
        classCallCheck(this, DragLayerContainer);

        var _this = possibleConstructorReturn(this, (DragLayerContainer.__proto__ || Object.getPrototypeOf(DragLayerContainer)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);

        _this.manager = context.dragDropManager;
        browser$1(_typeof(_this.manager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

        _this.state = _this.getCurrentState();
        return _this;
      }

      createClass(DragLayerContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.isCurrentlyMounted = true;

          var monitor = this.manager.getMonitor();
          this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(this.handleChange);
          this.unsubscribeFromStateChange = monitor.subscribeToStateChange(this.handleChange);

          this.handleChange();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.isCurrentlyMounted = false;

          this.unsubscribeFromOffsetChange();
          this.unsubscribeFromStateChange();
        }
      }, {
        key: 'handleChange',
        value: function handleChange() {
          if (!this.isCurrentlyMounted) {
            return;
          }

          var nextState = this.getCurrentState();
          if (!shallowEqual(nextState, this.state)) {
            this.setState(nextState);
          }
        }
      }, {
        key: 'getCurrentState',
        value: function getCurrentState() {
          var monitor = this.manager.getMonitor();
          return collect(monitor);
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return React__default.createElement(DecoratedComponent, _extends({}, this.props, this.state, {
            ref: function ref(child) {
              return _this2.child = child;
            }
          }));
        }
      }]);
      return DragLayerContainer;
    }(React.Component);

    DragLayerContainer.DecoratedComponent = DecoratedComponent;
    DragLayerContainer.displayName = 'DragLayer(' + displayName + ')';
    DragLayerContainer.contextTypes = {
      dragDropManager: PropTypes.object.isRequired
    };


    return hoistStatics(DragLayerContainer, DecoratedComponent);
  };
}

var isDisposable_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports['default'] = isDisposable;

function isDisposable(obj) {
  return Boolean(obj && typeof obj.dispose === 'function');
}

module.exports = exports['default'];
});

unwrapExports(isDisposable_1);

var Disposable_1 = createCommonjsModule(function (module, exports) {

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

exports.__esModule = true;
var noop = function noop() {};

/**
 * The basic disposable.
 */

var Disposable = function () {
  function Disposable(action) {
    _classCallCheck(this, Disposable);

    this.isDisposed = false;
    this.action = action || noop;
  }

  Disposable.prototype.dispose = function dispose() {
    if (!this.isDisposed) {
      this.action.call(null);
      this.isDisposed = true;
    }
  };

  _createClass(Disposable, null, [{
    key: "empty",
    enumerable: true,
    value: { dispose: noop }
  }]);

  return Disposable;
}();

exports["default"] = Disposable;
module.exports = exports["default"];
});

unwrapExports(Disposable_1);

var CompositeDisposable_1 = createCommonjsModule(function (module, exports) {

var _interopRequireWildcard = function _interopRequireWildcard(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
};

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

exports.__esModule = true;



var _isDisposable2 = _interopRequireWildcard(isDisposable_1);

/**
 * Represents a group of disposable resources that are disposed together.
 */

var CompositeDisposable = function () {
  function CompositeDisposable() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
      disposables[_key] = arguments[_key];
    }

    _classCallCheck(this, CompositeDisposable);

    if (Array.isArray(disposables[0]) && disposables.length === 1) {
      disposables = disposables[0];
    }

    for (var i = 0; i < disposables.length; i++) {
      if (!_isDisposable2['default'](disposables[i])) {
        throw new Error('Expected a disposable');
      }
    }

    this.disposables = disposables;
    this.isDisposed = false;
  }

  /**
   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
   * @param {Disposable} item Disposable to add.
   */

  CompositeDisposable.prototype.add = function add(item) {
    if (this.isDisposed) {
      item.dispose();
    } else {
      this.disposables.push(item);
    }
  };

  /**
   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
   * @param {Disposable} item Disposable to remove.
   * @returns {Boolean} true if found; false otherwise.
   */

  CompositeDisposable.prototype.remove = function remove(item) {
    if (this.isDisposed) {
      return false;
    }

    var index = this.disposables.indexOf(item);
    if (index === -1) {
      return false;
    }

    this.disposables.splice(index, 1);
    item.dispose();
    return true;
  };

  /**
   * Disposes all disposables in the group and removes them from the group.
   */

  CompositeDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    var len = this.disposables.length;
    var currentDisposables = new Array(len);
    for (var i = 0; i < len; i++) {
      currentDisposables[i] = this.disposables[i];
    }

    this.isDisposed = true;
    this.disposables = [];
    this.length = 0;

    for (var i = 0; i < len; i++) {
      currentDisposables[i].dispose();
    }
  };

  return CompositeDisposable;
}();

exports['default'] = CompositeDisposable;
module.exports = exports['default'];
});

unwrapExports(CompositeDisposable_1);

var SerialDisposable_1 = createCommonjsModule(function (module, exports) {

var _interopRequireWildcard = function _interopRequireWildcard(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
};

var _classCallCheck = function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

exports.__esModule = true;



var _isDisposable2 = _interopRequireWildcard(isDisposable_1);

var SerialDisposable = function () {
  function SerialDisposable() {
    _classCallCheck(this, SerialDisposable);

    this.isDisposed = false;
    this.current = null;
  }

  /**
   * Gets the underlying disposable.
   * @return The underlying disposable.
   */

  SerialDisposable.prototype.getDisposable = function getDisposable() {
    return this.current;
  };

  /**
   * Sets the underlying disposable.
   * @param {Disposable} value The new underlying disposable.
   */

  SerialDisposable.prototype.setDisposable = function setDisposable() {
    var value = arguments[0] === undefined ? null : arguments[0];

    if (value != null && !_isDisposable2['default'](value)) {
      throw new Error('Expected either an empty value or a valid disposable');
    }

    var isDisposed = this.isDisposed;
    var previous = undefined;

    if (!isDisposed) {
      previous = this.current;
      this.current = value;
    }

    if (previous) {
      previous.dispose();
    }

    if (isDisposed && value) {
      value.dispose();
    }
  };

  /**
   * Disposes the underlying disposable as well as all future replacements.
   */

  SerialDisposable.prototype.dispose = function dispose() {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;
    var previous = this.current;
    this.current = null;

    if (previous) {
      previous.dispose();
    }
  };

  return SerialDisposable;
}();

exports['default'] = SerialDisposable;
module.exports = exports['default'];
});

unwrapExports(SerialDisposable_1);

var modules = createCommonjsModule(function (module, exports) {

var _interopRequireWildcard = function _interopRequireWildcard(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
};

exports.__esModule = true;



var _isDisposable3 = _interopRequireWildcard(isDisposable_1);

exports.isDisposable = _isDisposable3['default'];



var _Disposable3 = _interopRequireWildcard(Disposable_1);

exports.Disposable = _Disposable3['default'];



var _CompositeDisposable3 = _interopRequireWildcard(CompositeDisposable_1);

exports.CompositeDisposable = _CompositeDisposable3['default'];



var _SerialDisposable3 = _interopRequireWildcard(SerialDisposable_1);

exports.SerialDisposable = _SerialDisposable3['default'];
});

unwrapExports(modules);
var modules_1 = modules.isDisposable;
var modules_2 = modules.Disposable;
var modules_3 = modules.CompositeDisposable;
var modules_4 = modules.SerialDisposable;

function decorateHandler(_ref) {
  var DecoratedComponent = _ref.DecoratedComponent,
      createHandler = _ref.createHandler,
      createMonitor = _ref.createMonitor,
      createConnector = _ref.createConnector,
      registerHandler = _ref.registerHandler,
      containerDisplayName = _ref.containerDisplayName,
      getType = _ref.getType,
      collect = _ref.collect,
      options = _ref.options;
  var _options$arePropsEqua = options.arePropsEqual,
      arePropsEqual = _options$arePropsEqua === undefined ? shallowEqualScalar : _options$arePropsEqua;

  var displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

  var DragDropContainer = function (_Component) {
    inherits(DragDropContainer, _Component);
    createClass(DragDropContainer, [{
      key: 'getHandlerId',
      value: function getHandlerId() {
        return this.handlerId;
      }
    }, {
      key: 'getDecoratedComponentInstance',
      value: function getDecoratedComponentInstance() {
        return this.decoratedComponentInstance;
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps, nextState) {
        return !arePropsEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
      }
    }]);

    function DragDropContainer(props, context) {
      classCallCheck(this, DragDropContainer);

      var _this = possibleConstructorReturn(this, (DragDropContainer.__proto__ || Object.getPrototypeOf(DragDropContainer)).call(this, props, context));

      _this.handleChange = _this.handleChange.bind(_this);
      _this.handleChildRef = _this.handleChildRef.bind(_this);

      browser$1(_typeof(_this.context.dragDropManager) === 'object', 'Could not find the drag and drop manager in the context of %s. ' + 'Make sure to wrap the top-level component of your app with DragDropContext. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);

      _this.manager = _this.context.dragDropManager;
      _this.handlerMonitor = createMonitor(_this.manager);
      _this.handlerConnector = createConnector(_this.manager.getBackend());
      _this.handler = createHandler(_this.handlerMonitor);

      _this.disposable = new modules_4();
      _this.receiveProps(props);
      _this.state = _this.getCurrentState();
      _this.dispose();
      return _this;
    }

    createClass(DragDropContainer, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.isCurrentlyMounted = true;
        this.disposable = new modules_4();
        this.currentType = null;
        this.receiveProps(this.props);
        this.handleChange();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!arePropsEqual(nextProps, this.props)) {
          this.receiveProps(nextProps);
          this.handleChange();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this.dispose();
        this.isCurrentlyMounted = false;
      }
    }, {
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.handler.receiveProps(props);
        this.receiveType(getType(props));
      }
    }, {
      key: 'receiveType',
      value: function receiveType(type) {
        if (type === this.currentType) {
          return;
        }

        this.currentType = type;

        var _registerHandler = registerHandler(type, this.handler, this.manager),
            handlerId = _registerHandler.handlerId,
            unregister = _registerHandler.unregister;

        this.handlerId = handlerId;
        this.handlerMonitor.receiveHandlerId(handlerId);
        this.handlerConnector.receiveHandlerId(handlerId);

        var globalMonitor = this.manager.getMonitor();
        var unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, { handlerIds: [handlerId] });

        this.disposable.setDisposable(new modules_3(new modules_2(unsubscribe), new modules_2(unregister)));
      }
    }, {
      key: 'handleChange',
      value: function handleChange() {
        if (!this.isCurrentlyMounted) {
          return;
        }

        var nextState = this.getCurrentState();
        if (!shallowEqual(nextState, this.state)) {
          this.setState(nextState);
        }
      }
    }, {
      key: 'dispose',
      value: function dispose() {
        this.disposable.dispose();
        this.handlerConnector.receiveHandlerId(null);
      }
    }, {
      key: 'handleChildRef',
      value: function handleChildRef(component) {
        this.decoratedComponentInstance = component;
        this.handler.receiveComponent(component);
      }
    }, {
      key: 'getCurrentState',
      value: function getCurrentState() {
        var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor);

        if (process.env.NODE_ENV !== 'production') {
          browser$1(isPlainObject(nextState), 'Expected `collect` specified as the second argument to ' + '%s for %s to return a plain object of props to inject. ' + 'Instead, received %s.', containerDisplayName, displayName, nextState);
        }

        return nextState;
      }
    }, {
      key: 'render',
      value: function render() {
        return React__default.createElement(DecoratedComponent, _extends({}, this.props, this.state, {
          ref: this.handleChildRef
        }));
      }
    }]);
    return DragDropContainer;
  }(React.Component);

  DragDropContainer.DecoratedComponent = DecoratedComponent;
  DragDropContainer.displayName = containerDisplayName + '(' + displayName + ')';
  DragDropContainer.contextTypes = {
    dragDropManager: PropTypes.object.isRequired
  };


  return hoistStatics(DragDropContainer, DecoratedComponent);
}

function registerSource(type, source, manager) {
  var registry = manager.getRegistry();
  var sourceId = registry.addSource(type, source);

  function unregisterSource() {
    registry.removeSource(sourceId);
  }

  return {
    handlerId: sourceId,
    unregister: unregisterSource
  };
}

var ALLOWED_SPEC_METHODS = ['canDrag', 'beginDrag', 'isDragging', 'endDrag'];
var REQUIRED_SPEC_METHODS = ['beginDrag'];

function createSourceFactory(spec) {
  Object.keys(spec).forEach(function (key) {
    browser$1(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drag source specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', ALLOWED_SPEC_METHODS.join(', '), key);
    browser$1(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
  });
  REQUIRED_SPEC_METHODS.forEach(function (key) {
    browser$1(typeof spec[key] === 'function', 'Expected %s in the drag source specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', key, key, spec[key]);
  });

  var Source = function () {
    function Source(monitor) {
      classCallCheck(this, Source);

      this.monitor = monitor;
      this.props = null;
      this.component = null;
    }

    createClass(Source, [{
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.props = props;
      }
    }, {
      key: 'receiveComponent',
      value: function receiveComponent(component) {
        this.component = component;
      }
    }, {
      key: 'canDrag',
      value: function canDrag() {
        if (!spec.canDrag) {
          return true;
        }

        return spec.canDrag(this.props, this.monitor);
      }
    }, {
      key: 'isDragging',
      value: function isDragging(globalMonitor, sourceId) {
        if (!spec.isDragging) {
          return sourceId === globalMonitor.getSourceId();
        }

        return spec.isDragging(this.props, this.monitor);
      }
    }, {
      key: 'beginDrag',
      value: function beginDrag() {
        var item = spec.beginDrag(this.props, this.monitor, this.component);
        if (process.env.NODE_ENV !== 'production') {
          browser$1(isPlainObject(item), 'beginDrag() must return a plain object that represents the dragged item. ' + 'Instead received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', item);
        }
        return item;
      }
    }, {
      key: 'endDrag',
      value: function endDrag() {
        if (!spec.endDrag) {
          return;
        }

        spec.endDrag(this.props, this.monitor, this.component);
      }
    }]);
    return Source;
  }();

  return function createSource(monitor) {
    return new Source(monitor);
  };
}

var isCallingCanDrag = false;
var isCallingIsDragging = false;

var SourceMonitor = function () {
  function SourceMonitor(manager) {
    classCallCheck(this, SourceMonitor);

    this.internalMonitor = manager.getMonitor();
  }

  createClass(SourceMonitor, [{
    key: 'receiveHandlerId',
    value: function receiveHandlerId(sourceId) {
      this.sourceId = sourceId;
    }
  }, {
    key: 'canDrag',
    value: function canDrag() {
      browser$1(!isCallingCanDrag, 'You may not call monitor.canDrag() inside your canDrag() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');

      try {
        isCallingCanDrag = true;
        return this.internalMonitor.canDragSource(this.sourceId);
      } finally {
        isCallingCanDrag = false;
      }
    }
  }, {
    key: 'isDragging',
    value: function isDragging() {
      browser$1(!isCallingIsDragging, 'You may not call monitor.isDragging() inside your isDragging() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source-monitor.html');

      try {
        isCallingIsDragging = true;
        return this.internalMonitor.isDraggingSource(this.sourceId);
      } finally {
        isCallingIsDragging = false;
      }
    }
  }, {
    key: 'getItemType',
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: 'getDropResult',
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: 'didDrop',
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: 'getInitialClientOffset',
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: 'getInitialSourceClientOffset',
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: 'getSourceClientOffset',
    value: function getSourceClientOffset() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: 'getClientOffset',
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: 'getDifferenceFromInitialOffset',
    value: function getDifferenceFromInitialOffset() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);
  return SourceMonitor;
}();

function createSourceMonitor(manager) {
  return new SourceMonitor(manager);
}

function cloneWithRef(element, newRef) {
  var previousRef = element.ref;
  browser$1(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' + 'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' + 'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');

  if (!previousRef) {
    // When there is no ref on the element, use the new ref directly
    return React.cloneElement(element, {
      ref: newRef
    });
  }

  return React.cloneElement(element, {
    ref: function ref(node) {
      newRef(node);

      if (previousRef) {
        previousRef(node);
      }
    }
  });
}

function throwIfCompositeComponentElement(element) {
  // Custom components can no longer be wrapped directly in React DnD 2.0
  // so that we don't need to depend on findDOMNode() from react-dom.
  if (typeof element.type === 'string') {
    return;
  }

  var displayName = element.type.displayName || element.type.name || 'the component';

  throw new Error('Only native element nodes can now be passed to React DnD connectors.' + ('You can either wrap ' + displayName + ' into a <div>, or turn it into a ') + 'drag source or a drop target itself.');
}

function wrapHookToRecognizeElement(hook) {
  return function () {
    var elementOrNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // When passed a node, call the hook straight away.
    if (!React.isValidElement(elementOrNode)) {
      var node = elementOrNode;
      hook(node, options);
      return undefined;
    }

    // If passed a ReactElement, clone it and attach this function as a ref.
    // This helps us achieve a neat API where user doesn't even know that refs
    // are being used under the hood.
    var element = elementOrNode;
    throwIfCompositeComponentElement(element);

    // When no options are passed, use the hook directly
    var ref = options ? function (node) {
      return hook(node, options);
    } : hook;

    return cloneWithRef(element, ref);
  };
}

function wrapConnectorHooks(hooks) {
  var wrappedHooks = {};

  Object.keys(hooks).forEach(function (key) {
    var hook = hooks[key];
    var wrappedHook = wrapHookToRecognizeElement(hook);
    wrappedHooks[key] = function () {
      return wrappedHook;
    };
  });

  return wrappedHooks;
}

function areOptionsEqual(nextOptions, currentOptions) {
  if (currentOptions === nextOptions) {
    return true;
  }

  return currentOptions !== null && nextOptions !== null && shallowEqual(currentOptions, nextOptions);
}

function createSourceConnector(backend) {
  var currentHandlerId = void 0;

  var currentDragSourceNode = void 0;
  var currentDragSourceOptions = void 0;
  var disconnectCurrentDragSource = void 0;

  var currentDragPreviewNode = void 0;
  var currentDragPreviewOptions = void 0;
  var disconnectCurrentDragPreview = void 0;

  function reconnectDragSource() {
    if (disconnectCurrentDragSource) {
      disconnectCurrentDragSource();
      disconnectCurrentDragSource = null;
    }

    if (currentHandlerId && currentDragSourceNode) {
      disconnectCurrentDragSource = backend.connectDragSource(currentHandlerId, currentDragSourceNode, currentDragSourceOptions);
    }
  }

  function reconnectDragPreview() {
    if (disconnectCurrentDragPreview) {
      disconnectCurrentDragPreview();
      disconnectCurrentDragPreview = null;
    }

    if (currentHandlerId && currentDragPreviewNode) {
      disconnectCurrentDragPreview = backend.connectDragPreview(currentHandlerId, currentDragPreviewNode, currentDragPreviewOptions);
    }
  }

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDragSource();
    reconnectDragPreview();
  }

  var hooks = wrapConnectorHooks({
    dragSource: function connectDragSource(node, options) {
      if (node === currentDragSourceNode && areOptionsEqual(options, currentDragSourceOptions)) {
        return;
      }

      currentDragSourceNode = node;
      currentDragSourceOptions = options;

      reconnectDragSource();
    },

    dragPreview: function connectDragPreview(node, options) {
      if (node === currentDragPreviewNode && areOptionsEqual(options, currentDragPreviewOptions)) {
        return;
      }

      currentDragPreviewNode = node;
      currentDragPreviewOptions = options;

      reconnectDragPreview();
    }
  });

  return {
    receiveHandlerId: receiveHandlerId,
    hooks: hooks
  };
}

function isValidType(type, allowArray) {
       return typeof type === 'string' || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'symbol' || allowArray && isArray(type) && type.every(function (t) {
              return isValidType(t, false);
       });
}

function DragSource$1(type, spec, collect) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  checkDecoratorArguments.apply(undefined, ['DragSource', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params
  var getType = type;
  if (typeof type !== 'function') {
    browser$1(isValidType(type), 'Expected "type" provided as the first argument to DragSource to be ' + 'a string, or a function that returns a string given the current props. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', type);
    getType = function getType() {
      return type;
    };
  }
  browser$1(isPlainObject(spec), 'Expected "spec" provided as the second argument to DragSource to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', spec);
  var createSource = createSourceFactory(spec);
  browser$1(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
  browser$1(isPlainObject(options), 'Expected "options" provided as the fourth argument to DragSource to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);

  return function decorateSource(DecoratedComponent) {
    return decorateHandler({
      connectBackend: function connectBackend(backend, sourceId) {
        return backend.connectDragSource(sourceId);
      },
      containerDisplayName: 'DragSource',
      createHandler: createSource,
      registerHandler: registerSource,
      createMonitor: createSourceMonitor,
      createConnector: createSourceConnector,
      DecoratedComponent: DecoratedComponent,
      getType: getType,
      collect: collect,
      options: options
    });
  };
}

function registerTarget(type, target, manager) {
  var registry = manager.getRegistry();
  var targetId = registry.addTarget(type, target);

  function unregisterTarget() {
    registry.removeTarget(targetId);
  }

  return {
    handlerId: targetId,
    unregister: unregisterTarget
  };
}

var ALLOWED_SPEC_METHODS$1 = ['canDrop', 'hover', 'drop'];

function createTargetFactory(spec) {
  Object.keys(spec).forEach(function (key) {
    browser$1(ALLOWED_SPEC_METHODS$1.indexOf(key) > -1, 'Expected the drop target specification to only have ' + 'some of the following keys: %s. ' + 'Instead received a specification with an unexpected "%s" key. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', ALLOWED_SPEC_METHODS$1.join(', '), key);
    browser$1(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' + 'Instead received a specification with %s: %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', key, key, spec[key]);
  });

  var Target = function () {
    function Target(monitor) {
      classCallCheck(this, Target);

      this.monitor = monitor;
      this.props = null;
      this.component = null;
    }

    createClass(Target, [{
      key: 'receiveProps',
      value: function receiveProps(props) {
        this.props = props;
      }
    }, {
      key: 'receiveMonitor',
      value: function receiveMonitor(monitor) {
        this.monitor = monitor;
      }
    }, {
      key: 'receiveComponent',
      value: function receiveComponent(component) {
        this.component = component;
      }
    }, {
      key: 'canDrop',
      value: function canDrop() {
        if (!spec.canDrop) {
          return true;
        }

        return spec.canDrop(this.props, this.monitor);
      }
    }, {
      key: 'hover',
      value: function hover() {
        if (!spec.hover) {
          return;
        }

        spec.hover(this.props, this.monitor, this.component);
      }
    }, {
      key: 'drop',
      value: function drop() {
        if (!spec.drop) {
          return undefined;
        }

        var dropResult = spec.drop(this.props, this.monitor, this.component);
        if (process.env.NODE_ENV !== 'production') {
          browser$1(typeof dropResult === 'undefined' || isPlainObject(dropResult), 'drop() must either return undefined, or an object that represents the drop result. ' + 'Instead received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', dropResult);
        }
        return dropResult;
      }
    }]);
    return Target;
  }();

  return function createTarget(monitor) {
    return new Target(monitor);
  };
}

var isCallingCanDrop = false;

var TargetMonitor = function () {
  function TargetMonitor(manager) {
    classCallCheck(this, TargetMonitor);

    this.internalMonitor = manager.getMonitor();
  }

  createClass(TargetMonitor, [{
    key: 'receiveHandlerId',
    value: function receiveHandlerId(targetId) {
      this.targetId = targetId;
    }
  }, {
    key: 'canDrop',
    value: function canDrop() {
      browser$1(!isCallingCanDrop, 'You may not call monitor.canDrop() inside your canDrop() implementation. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target-monitor.html');

      try {
        isCallingCanDrop = true;
        return this.internalMonitor.canDropOnTarget(this.targetId);
      } finally {
        isCallingCanDrop = false;
      }
    }
  }, {
    key: 'isOver',
    value: function isOver(options) {
      return this.internalMonitor.isOverTarget(this.targetId, options);
    }
  }, {
    key: 'getItemType',
    value: function getItemType() {
      return this.internalMonitor.getItemType();
    }
  }, {
    key: 'getItem',
    value: function getItem() {
      return this.internalMonitor.getItem();
    }
  }, {
    key: 'getDropResult',
    value: function getDropResult() {
      return this.internalMonitor.getDropResult();
    }
  }, {
    key: 'didDrop',
    value: function didDrop() {
      return this.internalMonitor.didDrop();
    }
  }, {
    key: 'getInitialClientOffset',
    value: function getInitialClientOffset() {
      return this.internalMonitor.getInitialClientOffset();
    }
  }, {
    key: 'getInitialSourceClientOffset',
    value: function getInitialSourceClientOffset() {
      return this.internalMonitor.getInitialSourceClientOffset();
    }
  }, {
    key: 'getSourceClientOffset',
    value: function getSourceClientOffset() {
      return this.internalMonitor.getSourceClientOffset();
    }
  }, {
    key: 'getClientOffset',
    value: function getClientOffset() {
      return this.internalMonitor.getClientOffset();
    }
  }, {
    key: 'getDifferenceFromInitialOffset',
    value: function getDifferenceFromInitialOffset() {
      return this.internalMonitor.getDifferenceFromInitialOffset();
    }
  }]);
  return TargetMonitor;
}();

function createTargetMonitor(manager) {
  return new TargetMonitor(manager);
}

function createTargetConnector(backend) {
  var currentHandlerId = void 0;

  var currentDropTargetNode = void 0;
  var currentDropTargetOptions = void 0;
  var disconnectCurrentDropTarget = void 0;

  function reconnectDropTarget() {
    if (disconnectCurrentDropTarget) {
      disconnectCurrentDropTarget();
      disconnectCurrentDropTarget = null;
    }

    if (currentHandlerId && currentDropTargetNode) {
      disconnectCurrentDropTarget = backend.connectDropTarget(currentHandlerId, currentDropTargetNode, currentDropTargetOptions);
    }
  }

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDropTarget();
  }

  var hooks = wrapConnectorHooks({
    dropTarget: function connectDropTarget(node, options) {
      if (node === currentDropTargetNode && areOptionsEqual(options, currentDropTargetOptions)) {
        return;
      }

      currentDropTargetNode = node;
      currentDropTargetOptions = options;

      reconnectDropTarget();
    }
  });

  return {
    receiveHandlerId: receiveHandlerId,
    hooks: hooks
  };
}

function DropTarget$1(type, spec, collect) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  checkDecoratorArguments.apply(undefined, ['DropTarget', 'type, spec, collect[, options]'].concat(Array.prototype.slice.call(arguments))); // eslint-disable-line prefer-rest-params
  var getType = type;
  if (typeof type !== 'function') {
    browser$1(isValidType(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' + 'a string, an array of strings, or a function that returns either given ' + 'the current props. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', type);
    getType = function getType() {
      return type;
    };
  }
  browser$1(isPlainObject(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' + 'a plain object. Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', spec);
  var createTarget = createTargetFactory(spec);
  browser$1(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' + 'a function that returns a plain object of props to inject. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
  browser$1(isPlainObject(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' + 'a plain object when specified. ' + 'Instead, received %s. ' + 'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);

  return function decorateTarget(DecoratedComponent) {
    return decorateHandler({
      connectBackend: function connectBackend(backend, targetId) {
        return backend.connectDropTarget(targetId);
      },
      containerDisplayName: 'DropTarget',
      createHandler: createTarget,
      registerHandler: registerTarget,
      createMonitor: createTargetMonitor,
      createConnector: createTargetConnector,
      DecoratedComponent: DecoratedComponent,
      getType: getType,
      collect: collect,
      options: options
    });
  };
}

exports.DragDropContext = DragDropContext;
exports.DragDropContextProvider = DragDropContextProvider;
exports.DragLayer = DragLayer;
exports.DragSource = DragSource$1;
exports.DropTarget = DropTarget$1;
