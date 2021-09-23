'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { isValidElement, cloneElement } from 'react';
import { isValidElementType } from 'react-is';
import invariant from 'react-utils/invariant';
var mergeTypes = {
  passive: function passive(originalProps, newProps) {
    return Object.assign({}, newProps, {}, originalProps);
  },
  aggressive: function aggressive(originalProps, newProps) {
    return newProps;
  },
  none: function none() {
    return {};
  }
};
var defaultOpts = {
  mergeType: 'passive'
};
export var render = function render(Renderer, props) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _defaultOpts$opts = Object.assign({}, defaultOpts, {}, opts),
      mergeType = _defaultOpts$opts.mergeType;

  if (process.env.NODE_ENV !== 'production') {
    invariant(mergeType === 'passive' || mergeType === 'aggressive' || mergeType === 'none', "CustomRenderer: invalid merge type (expected aggressive|passive|none, got " + mergeType + ")");
  }

  if ( /*#__PURE__*/isValidElement(Renderer)) {
    return /*#__PURE__*/cloneElement(Renderer, mergeTypes[mergeType](Renderer.props, props));
  }

  if (isValidElementType(Renderer)) {
    return /*#__PURE__*/_jsx(Renderer, Object.assign({}, props));
  }

  return Renderer;
};
export var propType = PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]);