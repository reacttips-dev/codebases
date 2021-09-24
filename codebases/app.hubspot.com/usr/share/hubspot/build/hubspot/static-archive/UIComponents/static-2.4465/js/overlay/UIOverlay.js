'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import memoizeOne from 'react-utils/memoizeOne';
import UIClickable from '../button/UIClickable';
import { hidden } from '../utils/propTypes/decorators';

var getStyle = function getStyle(style, centerContent, width) {
  return centerContent ? Object.assign({}, style, {
    maxWidth: width
  }) : style;
};

var USE_CLASSES = {
  dark: '',
  light: 'private-overlay--light'
};

var UIOverlay = /*#__PURE__*/function (_Component) {
  _inherits(UIOverlay, _Component);

  function UIOverlay(props) {
    var _this;

    _classCallCheck(this, UIOverlay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIOverlay).call(this, props));

    _this.handleClick = function (evt) {
      var onClick = _this.props.onClick;
      if (onClick) onClick(evt);
    };

    _this._getStyle = memoizeOne(getStyle);
    return _this;
  }

  _createClass(UIOverlay, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          centerContent = _this$props.centerContent,
          children = _this$props.children,
          className = _this$props.className,
          contextual = _this$props.contextual,
          onClick = _this$props.onClick,
          style = _this$props.style,
          tabIndex = _this$props.tabIndex,
          use = _this$props.use,
          width = _this$props.width,
          Inner = _this$props.Inner,
          rest = _objectWithoutProperties(_this$props, ["centerContent", "children", "className", "contextual", "onClick", "style", "tabIndex", "use", "width", "Inner"]);

      var isSandboxed = contextual || this.context.sandboxed;
      var computedClassName = classNames("private-overlay uiOverlay-backdrop", className, USE_CLASSES[use], isSandboxed && 'private-overlay--contextual');
      var computedChildrenWrapperClassName = centerContent ? 'private-modal__container' : "";
      var isClickable = onClick;
      var Overlay = isClickable ? UIClickable : 'div';
      var overlayProps = isClickable ? {
        cursor: 'auto'
      } : undefined;
      return /*#__PURE__*/_jsx(Overlay, Object.assign({}, rest, {}, overlayProps, {
        className: computedClassName,
        onClick: this.handleClick,
        role: "presentation",
        tabIndex: isSandboxed ? null : tabIndex,
        children: /*#__PURE__*/_jsx(Inner, {
          className: computedChildrenWrapperClassName,
          ref: function ref(_ref) {
            _this2._innerEl = findDOMNode(_ref);
          },
          style: this._getStyle(style, centerContent, width),
          children: children
        })
      }));
    }
  }]);

  return UIOverlay;
}(Component);

UIOverlay.propTypes = {
  centerContent: PropTypes.bool.isRequired,
  children: PropTypes.node,
  contextual: PropTypes.bool.isRequired,
  use: PropTypes.oneOf(Object.keys(USE_CLASSES)),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  Inner: hidden(PropTypes.elementType)
};
UIOverlay.contextTypes = {
  sandboxed: PropTypes.bool
};
UIOverlay.defaultProps = {
  centerContent: true,
  contextual: false,
  use: 'dark',
  Inner: 'div'
};
UIOverlay.displayName = 'UIOverlay';
export default UIOverlay;