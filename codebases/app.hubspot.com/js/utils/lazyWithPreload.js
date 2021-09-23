'use es6';

import { createElement, forwardRef, lazy } from 'react'; // stolen from https://github.com/ianschmitz/react-lazy-with-preload/blob/master/src/index.ts

export var lazyWithPreload = function lazyWithPreload(factory) {
  var LazyComponent = /*#__PURE__*/lazy(factory);
  var factoryPromise;
  var LoadedComponent;
  var Component = /*#__PURE__*/forwardRef(function (props, ref) {
    return /*#__PURE__*/createElement(LoadedComponent || LazyComponent, Object.assign(ref ? {
      ref: ref
    } : {}, props));
  });

  Component.preload = function () {
    if (!factoryPromise) {
      factoryPromise = factory().then(function (module) {
        LoadedComponent = module.default;
      });
    }

    return factoryPromise;
  };

  return Component;
};