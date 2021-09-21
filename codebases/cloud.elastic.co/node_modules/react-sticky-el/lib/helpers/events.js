"use strict";

exports.__esModule = true;
exports.listen = listen;
exports.unlisten = unlisten;
////////////////////////////////////////////////////////////////////////////////////////
// Small helpers that provide an easy and efficient way to add/remove event listeners //
////////////////////////////////////////////////////////////////////////////////////////
var elementsWithListeners = [];
var registeredListeners = [];

function createListener(el) {
  return {
    el: el,
    callbacks: {},
    realCallbacks: {},
    realListenersCnt: 0
  };
}

function addCallback(listener, event, cb) {
  if (listener.callbacks[event]) {
    if (listener.callbacks[event].indexOf(cb) === -1) {
      listener.callbacks[event].push(cb);
    }

    return;
  }

  listener.callbacks[event] = [cb];

  listener.realCallbacks[event] = function (e) {
    for (var i = 0, l = listener.callbacks[event].length; i < l; i += 1) {
      listener.callbacks[event][i](e);
    }
  };

  listener.el.addEventListener(event, listener.realCallbacks[event]);
  listener.realListenersCnt += 1;
}

function removeCallback(listener, event, cb) {
  if (!listener.callbacks[event]) {
    return;
  }

  var idx = listener.callbacks[event].indexOf(cb);

  if (idx === -1) {
    return;
  }

  listener.callbacks[event].splice(idx, 1);

  if (listener.callbacks[event].length > 0) {
    return;
  } // no more listeners, lets clean up


  listener.el.removeEventListener(event, listener.realCallbacks[event]);
  delete listener.callbacks[event];
  delete listener.realCallbacks[event];
  listener.realListenersCnt -= 1;
}

function addListener(el, event, cb) {
  var idx = elementsWithListeners.indexOf(el);

  if (idx === -1) {
    idx = elementsWithListeners.length;
    elementsWithListeners.push(el);
    registeredListeners.push(createListener(el));
  }

  var listener = registeredListeners[idx];
  addCallback(listener, event, cb);
}

function removeListener(el, event, cb) {
  var idx = elementsWithListeners.indexOf(el);

  if (idx === -1) {
    return;
  }

  var listener = registeredListeners[idx];
  removeCallback(listener, event, cb);

  if (listener.realListenersCnt > 0) {
    return;
  } // no more listeners lets clean up


  elementsWithListeners.splice(idx, 1);
  registeredListeners.splice(idx, 1);
}
/**
 * Subscribe cb to events list
 * @param  {HTMLElement}   el       target element
 * @param  {Array}         events   array of event names
 * @param  {Function} cb   callback that should be called
 */


function listen(el, events, cb) {
  for (var i = 0, l = events.length; i < l; i += 1) {
    addListener(el, events[i], cb);
  }
}
/**
 * Unsubscribe cb from events list
 * @param  {HTMLElement}   el       target element
 * @param  {Array}         events   array of event names
 * @param  {Function} cb   callback that should be unsubscribed
 */


function unlisten(el, events, cb) {
  for (var i = 0, l = events.length; i < l; i += 1) {
    removeListener(el, events[i], cb);
  }
}