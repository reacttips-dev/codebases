'use es6';

import PropTypes from 'prop-types';
export var makeEventRelay = function makeEventRelay() {
  var listeners = [];
  var wrappedHandler;

  var handle = function handle(evt) {
    if (typeof wrappedHandler === 'function') wrappedHandler(evt);
    listeners.forEach(function (listener) {
      return listener(evt);
    });
  };

  return {
    getHandle: function getHandle(handler) {
      wrappedHandler = handler;
      return handle;
    },
    subscribe: function subscribe(listener) {
      return listeners.push(listener);
    },
    unsubscribe: function unsubscribe(listener) {
      return listeners.splice(listeners.indexOf(listener), 1);
    }
  };
};
export var eventRelayPropType = PropTypes.shape({
  subscribe: PropTypes.func.isRequired
});