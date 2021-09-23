'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useState } from 'react';
import getComponentName from 'react-utils/getComponentName';
import { attachWrappedComponent } from './utils';
/**
 * An HOC that injects a `composing` prop into the wrapped component that indicates whether IME
 * composition is in progress.
 *
 * @param {JSX.Component} Component
 * @returns {JSX.Component}
 */

var IMEAware = function IMEAware(Component) {
  var IMEAwareComponent = /*#__PURE__*/forwardRef(function (props, ref) {
    var handlers = {};
    /* eslint-disable react-hooks/rules-of-hooks */

    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        composing = _useState2[0],
        setComposing = _useState2[1];

    ['onCompositionStart', 'onCompositionEnd'].forEach(function (handlerKey) {
      var receivedHandlerRef = useRef();
      var handlerRef = useRef();

      if (!handlerRef.current || receivedHandlerRef.current !== props[handlerKey]) {
        receivedHandlerRef.current = props[handlerKey];

        handlerRef.current = function (evt) {
          setComposing(handlerKey === 'onCompositionStart');
          if (props[handlerKey]) props[handlerKey](evt);
        };
      }

      handlers[handlerKey] = handlerRef.current;
    });
    /* eslint-enable react-hooks/rules-of-hooks */

    return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {}, handlers, {
      composing: composing,
      ref: ref
    }));
  });
  IMEAwareComponent.displayName = "IMEAware(" + getComponentName(Component) + ")";
  IMEAwareComponent.propTypes = Object.assign({}, Component.propTypes);
  delete IMEAwareComponent.propTypes.composing;
  IMEAwareComponent.defaultProps = Component.defaultProps;
  attachWrappedComponent(IMEAwareComponent, Component);
  return IMEAwareComponent;
};

export default IMEAware;