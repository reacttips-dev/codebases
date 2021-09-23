'use es6';
/* eslint no-console: 0 */

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import dispatcher from 'dispatcher/dispatcher';
import enviro from 'enviro';
import { OrderedMap, Seq } from 'immutable';
import Raven from 'Raven';
import makeDeferred from 'hs-promise-utils/defer';
var throwDevErrors = !enviro.deployed();
var showDevOutput = throwDevErrors || enviro.getShort() !== 'prod';
var showDebugOutput = enviro.debug('dispatch') && typeof console.group === 'function';
var hasDevTools = window.__REDUX_DEVTOOLS_EXTENSION__;
var devToolsExtension;

if (hasDevTools) {
  devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: 'Dispatcher',
    instanceId: 'crm_dispatcher'
  });
}

if (showDevOutput) {
  if (showDebugOutput) {
    console.info("Disable flux debugging by running `enviro.setDebug('dispatch', false)`.");
  } else {
    console.info("Enable flux debugging by running `enviro.setDebug('dispatch', true)`.");
  }
}

var failurePattern = /^[\w_]+_FAIL(\w*)?\d*$/;

function _dispatch(actionType, data) {
  if (showDebugOutput) {
    var isFailure = failurePattern.test(actionType);
    var backgroundColor = isFailure ? '#d94c53' : '#00bda5';
    var color = isFailure ? '#d94c53' : '#33475b';
    console.groupCollapsed("%c dispatch%c " + actionType, "background-color:" + backgroundColor + ";color:white;padding:.15em .25em", "color:" + color);
    console.log("%cactionType: %c" + actionType, 'color:#99acc2', 'color:#33475b');
    console.log('%c      data:', 'color:#99acc2', data);
    console.groupEnd();
  }

  dispatcher.dispatch({
    actionType: actionType,
    data: data
  });

  if (hasDevTools) {
    try {
      devToolsExtension.send(actionType, data);
    } catch (e) {
      console.error('Could not send data to dev tools', actionType, data);
    }
  }
}

var queue = OrderedMap();
var scheduled = null;

function attemptQueuedDispatch(deferred, next) {
  var _next = _slicedToArray(next, 2),
      actionType = _next[0],
      data = _next[1];

  try {
    _dispatch(actionType, data);

    deferred.resolve();
  } catch (error) {
    if (!showDevOutput) {
      Raven.captureException(error);
    }

    deferred.reject(error);
  }
}

export function flushQueue() {
  var oldQueue = queue;
  scheduled = null;
  queue = OrderedMap();

  if (showDebugOutput) {
    console.group("%c    flush%c " + oldQueue.size + " actions", 'background-color:#5e6ab8;color:white;padding:.15em .25em', 'color:#99acc2');
  }

  oldQueue.forEach(attemptQueuedDispatch);

  if (showDebugOutput) {
    console.groupEnd();
  }
}
/**
 * Can be used in places where we may have used defer(dispatch)
 * in the past to circumvent the "no dispatch inside a dispatch" rule.
 *
 * Beware that dispatchQueues are deduplicated so if it's called with the
 * exact same actionType and payload in one flush, the second call will be
 * dropped.
 *
 * It's most useful in stores that fetch their own data.
 *
 * @param  {string}  actionType
 * @param  {any}     data
 * @return {Promise} resolved when the action is finally dispatched
 */

export function dispatchQueue(actionType, data) {
  if (!scheduled) {
    scheduled = setTimeout(flushQueue, 1);
  }

  var key = Seq.of(actionType, data);

  if (!queue.has(key)) {
    if (showDebugOutput) {
      console.groupCollapsed("%c    queue%c " + actionType, 'background-color:#b4bbe8;color:white;padding:.15em .25em', 'color:#33475b');
      console.log("%cactionType: %c" + actionType, 'color:#99acc2', 'color:#33475b');
      console.log('%c      data:', 'color:#99acc2', data);
      console.groupEnd();
    }

    queue = queue.set(key, makeDeferred());
  } else if (showDebugOutput) {
    console.groupCollapsed("%c    queue%c " + actionType + " %cduplicate", 'background-color:#b4bbe8;color:white;padding:.15em .25em', 'color:#33475b', 'background-color:#f5c26b;color:white;padding:.15em .25em');
    console.log("%cactionType: %c" + actionType, 'color:#99acc2', 'color:#33475b');
    console.log('%c      data:', 'color:#99acc2', data);
    console.groupEnd();
  }

  return queue.get(key).promise;
}
/**
 * Can be used safely in a situation where the dispatch might be called during
 * another dispatch but not all the time. This is most useful in action creators
 * that are sometimes called in component lifecycle methods.
 *
 * It returns a promise because it *could* be dispatched asychronously.
 *
 * @param  {string}  actionType
 * @param  {any}     data
 * @return {Promise} resolves when the action has successfully dispatched
 */

export function dispatchSafe(actionType, data) {
  if (dispatcher.isDispatching()) {
    return dispatchQueue(actionType, data);
  }

  return new Promise(function (resolve) {
    _dispatch(actionType, data);

    resolve();
  });
}
/**
 * Can be used when an immediate synchronouse dispatch is required.
 *
 * For example, when an action is dispatched in response to user input.
 *
 * @param  {string}   actionType
 * @param  {any}      data
 */

export function dispatchImmediate(actionType, data) {
  if (!dispatcher.isDispatching()) {
    return _dispatch(actionType, data);
  }

  var currentActionType = dispatcher.$Dispatcher_pendingPayload ? dispatcher.$Dispatcher_pendingPayload.actionType : '<UNKNOWN ACTION TYPE>'; // in development we want to throw this error to make sure it gets fixed!

  if (!enviro.deployed()) {
    var message = "Error: dispatch-in-a-dispatch: dispatchImmediate `" + actionType + "` failed" + (" because `" + currentActionType + "`") + ' is already dispatching.' + '\n\nRead more: https://product.hubteam.com/docs/crm-handbook/flux/dispatch-in-a-dispatch.html'; // log this out just in case because sometimes react swallows errors in life
    // cycle handlers

    console.error(message);
    throw new Error(message);
  } // if we're not on prod/qa we want to log the error to sentry/console but
  // still allow the page to continue executing to mitigate the effects of
  // sneaky errors


  if (enviro.getShort() !== 'prod' || !enviro.deployed()) {
    console.error("Warning: dispatch-in-a-dispatch: action `" + actionType + "` was sent with `dispatchQueue`" + (" because `" + currentActionType + "`") + ' is already dispatching.' + '\n\nRead more: https://product.hubteam.com/docs/crm-handbook/flux/dispatch-in-a-dispatch.html');
  } else {
    Raven.captureException(new Error("dispatch-in-a-dispatch: action `" + actionType + "` was sent with `dispatchQueue`" + (" because `" + currentActionType + "`") + 'is already dispatching.'));
  }

  return dispatchSafe(actionType, data);
}