'use es6'; // From hub-http

export function triggerEvent(eventName, data) {
  var event;

  if (typeof window.Event === 'function') {
    event = Object.assign(new Event(eventName), data);
  } else {
    event = Object.assign(document.createEvent('Event'), data);
    event.initEvent(eventName, true, true);
  }

  window.dispatchEvent(event);
}