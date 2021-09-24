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
import styled from 'styled-components';
import UIScrollOverhang from './UIScrollOverhang';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import refObject from '../utils/propTypes/refObject';
import { toPx } from '../utils/Styles';

var isHorizontal = function isHorizontal(direction) {
  return direction === 'horizontal' || direction === 'both';
};

var isVertical = function isVertical(direction) {
  return direction === 'vertical' || direction === 'both';
};

var DefaultScrollContainer = styled.div.withConfig({
  displayName: "UIScrollContainer__DefaultScrollContainer",
  componentId: "foi2n4-0"
})(["height:100%;width:100%;max-height:", ";max-width:", ";overflow-x:", ";overflow-y:", ";position:relative;"], function (props) {
  return toPx(props.maxHeight);
}, function (props) {
  return toPx(props.maxWidth);
}, function (props) {
  return isHorizontal(props.scrollDirection) ? 'auto' : 'hidden';
}, function (props) {
  return isVertical(props.scrollDirection) ? 'auto' : 'hidden';
});
DefaultScrollContainer.propTypes = {
  children: PropTypes.node,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scrollDirection: PropTypes.oneOf(['horizontal', 'vertical', 'both', 'none']).isRequired
};
DefaultScrollContainer.defaultProps = {
  scrollDirection: 'both'
};

var UIScrollContainer = /*#__PURE__*/function (_Component) {
  _inherits(UIScrollContainer, _Component);

  function UIScrollContainer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIScrollContainer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIScrollContainer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.refCallback = function (ref) {
      var _this$props = _this.props,
          scrollElementRef = _this$props.scrollElementRef,
          connectDragSource = _this$props.connectDragSource,
          connectDropTarget = _this$props.connectDropTarget;
      if (!(scrollElementRef || connectDragSource || connectDropTarget)) return;
      var el = findDOMNode(ref);

      if (scrollElementRef) {
        scrollElementRef.current = el;
      }

      if (connectDragSource) connectDragSource(el);
      if (connectDropTarget) connectDropTarget(el);
    };

    return _this;
  }

  _createClass(UIScrollContainer, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          maxHeight = _this$props2.maxHeight,
          maxWidth = _this$props2.maxWidth,
          ScrollContainer = _this$props2.ScrollContainer,
          scrollDirection = _this$props2.scrollDirection,
          __scrollElementRef = _this$props2.scrollElementRef,
          rest = _objectWithoutProperties(_this$props2, ["children", "maxHeight", "maxWidth", "ScrollContainer", "scrollDirection", "scrollElementRef"]);

      return /*#__PURE__*/_jsx(UIScrollOverhang, Object.assign({}, rest, {
        children: /*#__PURE__*/_jsx(ScrollContainer, {
          maxHeight: maxHeight,
          maxWidth: maxWidth,
          ref: this.refCallback,
          scrollDirection: scrollDirection,
          children: children
        })
      }));
    }
  }]);

  return UIScrollContainer;
}(Component);

UIScrollContainer.propTypes = Object.assign({}, UIScrollOverhang.propTypes, {}, DefaultScrollContainer.propTypes, {
  ScrollContainer: getComponentPropType(DefaultScrollContainer),
  scrollElementRef: refObject,
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func
});
UIScrollContainer.defaultProps = Object.assign({}, UIScrollOverhang.defaultProps, {}, DefaultScrollContainer.defaultProps, {
  ScrollContainer: DefaultScrollContainer
});
UIScrollContainer.displayName = 'UIScrollContainer';
export default UIScrollContainer;