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
import classNames from 'classnames';
import styled from 'styled-components';
import { GRID_BREAKPOINT_SMALL } from 'HubStyleTokens/sizes';
import { toPx } from '../utils/Styles';
import { hidden } from '../utils/propTypes/decorators';
import { SIZE_CLASSES, DIALOG_USE_CLASSES } from './DialogConstants';
var ABOVE_MOBILE_BREAKPOINT = toPx(parseInt(GRID_BREAKPOINT_SMALL, 10) + 1);
var Div = styled.div.withConfig({
  displayName: "UIDialog__Div",
  componentId: "sc-11it9l3-0"
})(["position:relative;width:", ";@media only screen and (min-width:", "){top:", ";}"], function (_ref) {
  var _dialogWidth = _ref._dialogWidth;
  return toPx(_dialogWidth);
}, ABOVE_MOBILE_BREAKPOINT, function (_ref2) {
  var headerOverflow = _ref2.headerOverflow;
  return toPx(headerOverflow);
});

var UIDialog = /*#__PURE__*/function (_Component) {
  _inherits(UIDialog, _Component);

  function UIDialog() {
    _classCallCheck(this, UIDialog);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIDialog).apply(this, arguments));
  }

  _createClass(UIDialog, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          centered = _this$props.centered,
          children = _this$props.children,
          className = _this$props.className,
          use = _this$props.use,
          size = _this$props.size,
          rest = _objectWithoutProperties(_this$props, ["centered", "children", "className", "use", "size"]);

      return /*#__PURE__*/_jsx(Div, Object.assign({}, rest, {
        className: classNames("private-modal uiDialog-root", DIALOG_USE_CLASSES[use], SIZE_CLASSES[size], className, centered && 'private-modal--centered'),
        children: children
      }));
    }
  }]);

  return UIDialog;
}(Component);

UIDialog.propTypes = {
  _dialogWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  centered: PropTypes.bool.isRequired,
  children: PropTypes.node,
  headerOverflow: hidden(PropTypes.number),
  size: PropTypes.oneOf(Object.keys(SIZE_CLASSES)),
  use: PropTypes.oneOf(Object.keys(DIALOG_USE_CLASSES))
};
UIDialog.defaultProps = {
  centered: false,
  size: 'medium',
  use: 'default'
};
UIDialog.displayName = 'UIDialog';
UIDialog.Selector = Div;
export default UIDialog;