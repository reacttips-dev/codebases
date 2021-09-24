"use strict";
'use es6'; // make sure we support IE11 when triggering events

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerEvent = void 0;

var triggerEvent = function triggerEvent(eventName, data) {
  var event;

  if (typeof window.Event === 'function') {
    event = Object.assign(new Event(eventName), data);
  } else {
    event = Object.assign(document.createEvent('Event'), data);
    event.initEvent(eventName, true, true);
  }

  window.dispatchEvent(event);
};

exports.triggerEvent = triggerEvent;