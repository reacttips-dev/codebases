'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import { EERIE, KOALA, OLAF, MONOLITH } from 'HubStyleTokens/colors';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { hidden } from '../utils/propTypes/decorators';
import UICloseButton from '../button/UICloseButton';
import UIDragHandle from './UIDragHandle';
import UITooltip from '../tooltip/UITooltip';
import UITruncateString from '../text/UITruncateString';
import { setInputMetrics, setInputAppearance, setGrabCursor } from '../utils/Styles';
import { INPUT_DEFAULT_PADDING_Y, BASE_FONT_SIZE, JUPITER_LAYER } from 'HubStyleTokens/sizes';
import { rgba } from '../core/Color';
var draggingMixin = css(["", ";box-shadow:0 0 12px 0 ", ";z-index:", ";"], setGrabCursor('grabbing'), rgba(MONOLITH, 0.1), JUPITER_LAYER);
var Outer = styled.div.withConfig({
  displayName: "UIMoveableObject__Outer",
  componentId: "p1065t-0"
})(["position:relative;", " ", ";font-size:", ";background-color:", ";", " .private-moveable-object + &{margin-top:12px;}"], setInputAppearance(), setInputMetrics(parseInt(INPUT_DEFAULT_PADDING_Y, 10) - 1, 26, 30), BASE_FONT_SIZE, function (_ref) {
  var use = _ref.use;
  return use === 'on-dark' ? OLAF : KOALA;
}, function (_ref2) {
  var isDragging = _ref2.isDragging;
  return isDragging && draggingMixin;
});
var CloseButton = styled(UICloseButton).withConfig({
  displayName: "UIMoveableObject__CloseButton",
  componentId: "p1065t-1"
})(["top:16px;margin-right:-12px;"]);
var TooltipAnchor = styled.span.withConfig({
  displayName: "UIMoveableObject__TooltipAnchor",
  componentId: "p1065t-2"
})(["height:100%;position:absolute;right:0;top:0;width:30px;"]);

var UIMoveableObject = /*#__PURE__*/function (_Component) {
  _inherits(UIMoveableObject, _Component);

  function UIMoveableObject() {
    _classCallCheck(this, UIMoveableObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIMoveableObject).apply(this, arguments));
  }

  _createClass(UIMoveableObject, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          closeable = _this$props.closeable,
          closeDisabledMessage = _this$props.closeDisabledMessage,
          draggable = _this$props.draggable,
          isCloseDisabled = _this$props.isCloseDisabled,
          dragHandle = _this$props.dragHandle,
          DragHandle = _this$props.DragHandle,
          onClose = _this$props.onClose,
          truncate = _this$props.truncate,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "closeable", "closeDisabledMessage", "draggable", "isCloseDisabled", "dragHandle", "DragHandle", "onClose", "truncate"]);

      var content = truncate ? /*#__PURE__*/_jsx(UITruncateString, {
        children: children
      }) : children;

      var renderedChildren = /*#__PURE__*/_jsxs(Outer, Object.assign({}, rest, {
        className: classNames('private-moveable-object', className),
        children: [content, closeable && /*#__PURE__*/_jsx(UITooltip, {
          title: closeDisabledMessage,
          children: /*#__PURE__*/_jsx(TooltipAnchor, {
            children: /*#__PURE__*/_jsx(CloseButton, {
              color: EERIE,
              disabled: isCloseDisabled,
              onClick: onClose,
              size: "sm"
            })
          })
        })]
      }));

      if (draggable) {
        var ComputedDragHandle = dragHandle || DragHandle;
        return /*#__PURE__*/_jsx(ComputedDragHandle, {
          children: renderedChildren
        });
      }

      return renderedChildren;
    }
  }]);

  return UIMoveableObject;
}(Component);

export { UIMoveableObject as default };
UIMoveableObject.propTypes = {
  children: PropTypes.node.isRequired,
  closeable: PropTypes.bool.isRequired,
  closeDisabledMessage: PropTypes.string,
  draggable: PropTypes.bool.isRequired,
  isCloseDisabled: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  dragHandle: hidden(getComponentPropType(UIDragHandle)),
  DragHandle: getComponentPropType(UIDragHandle).isRequired,
  truncate: hidden(PropTypes.bool),
  use: PropTypes.oneOf(['default', 'on-dark'])
};
UIMoveableObject.defaultProps = {
  closeable: true,
  draggable: true,
  isCloseDisabled: false,
  isDragging: false,
  DragHandle: UIDragHandle,
  truncate: true,
  use: 'default'
};
UIMoveableObject.displayName = 'UIMoveableObject';