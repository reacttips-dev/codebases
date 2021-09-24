'use es6';

import { useCallback, useEffect, useRef } from 'react';

var defaultCallback = function defaultCallback(arg) {
  return arg;
};
/**
 * useElementResized is a custom hook meant to help solve the problem of
 * "I want to know when this component resized, and when it does, do something"
 *
 * It is a react hook that takes a `callback` that will be called with the dom node of `componentRef` whenever it is resized
 *
 * @param componentRef - a React.ref object that is placed on the react element in which you care to watch
 *
 * @param callback - a function you pass in to this hook that is called with the current value of the reactRef every time ResizeObserver observes a resize
 *
 * @param ResizeObserverImplementation - Allows you to override the ResizeObserver implementation used internally. The only use case this is intended for is helping with unit testing
 * */


export var useElementResized = function useElementResized(_ref) {
  var _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? defaultCallback : _ref$callback,
      componentRef = _ref.componentRef,
      _ref$ResizeObserverIm = _ref.ResizeObserverImplementation,
      ResizeObserverImplementation = _ref$ResizeObserverIm === void 0 ? ResizeObserver : _ref$ResizeObserverIm;
  var callbackRef = useRef(callback);
  var handler = useCallback(function () {
    if (componentRef.current) {
      callbackRef.current(componentRef.current);
    }
  }, [componentRef]);
  useEffect(function () {
    var staticReferenceToCurrentRef = componentRef.current;

    if (staticReferenceToCurrentRef) {
      var myObserver = new ResizeObserverImplementation(handler);
      myObserver.observe(staticReferenceToCurrentRef);
      return function () {
        myObserver.unobserve(staticReferenceToCurrentRef);
      };
    }

    return function () {};
  }, [componentRef, handler, ResizeObserverImplementation]);
  useEffect(function () {
    callbackRef.current = callback;
  }, [callback]);
};