'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component, Children } from 'react';
import styled from 'styled-components';
import { TABLE_DEFAULT_FONT_SIZE } from 'HubStyleTokens/sizes';
import { FONT_FAMILIES, setFontSize } from '../utils/Styles';
var ActionsRowTR = styled.tr.withConfig({
  displayName: "UITableActionsRow__ActionsRowTR",
  componentId: "dgk84u-0"
})(["position:relative;"]);
var ActionsRowTH = styled.th.withConfig({
  displayName: "UITableActionsRow__ActionsRowTH",
  componentId: "dgk84u-1"
})(["&&{", ";", ";padding-right:0;text-transform:none;}"], FONT_FAMILIES.default, setFontSize(TABLE_DEFAULT_FONT_SIZE));

function renderWithActions(TH, actions, children, openAtColumnIndex) {
  var childArray = Children.toArray(children);
  var visibleChildren = childArray.slice(0, openAtColumnIndex);
  return visibleChildren.concat([/*#__PURE__*/_jsx(TH, {
    colSpan: childArray.length - openAtColumnIndex,
    children: /*#__PURE__*/_jsx("div", {
      className: "is--text--help",
      children: actions
    })
  }, "actions")]);
}

var UITableActionsRow = /*#__PURE__*/function (_Component) {
  _inherits(UITableActionsRow, _Component);

  function UITableActionsRow() {
    _classCallCheck(this, UITableActionsRow);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITableActionsRow).apply(this, arguments));
  }

  _createClass(UITableActionsRow, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          actions = _this$props.actions,
          children = _this$props.children,
          open = _this$props.open,
          openAtColumnIndex = _this$props.openAtColumnIndex,
          TH = _this$props.TH,
          TR = _this$props.TR,
          rest = _objectWithoutProperties(_this$props, ["actions", "children", "open", "openAtColumnIndex", "TH", "TR"]);

      return /*#__PURE__*/_jsx(TR, Object.assign({}, rest, {
        role: "presentation",
        "aria-live": "polite",
        children: open ? renderWithActions(TH, actions, children, openAtColumnIndex) : children
      }));
    }
  }]);

  return UITableActionsRow;
}(Component);

export { UITableActionsRow as default };
UITableActionsRow.displayName = 'UITableActionsRow';
UITableActionsRow.propTypes = {
  actions: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  openAtColumnIndex: PropTypes.number.isRequired,
  TH: PropTypes.elementType,
  TR: PropTypes.elementType
};
UITableActionsRow.defaultProps = {
  open: false,
  TH: ActionsRowTH,
  TR: ActionsRowTR
};