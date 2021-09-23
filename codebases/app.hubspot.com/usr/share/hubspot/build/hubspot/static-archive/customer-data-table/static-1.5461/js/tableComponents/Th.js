'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { GREAT_WHITE } from 'HubStyleTokens/colors';
import { PureComponent, cloneElement } from 'react';
import ThDragDrop from './ThDragDrop';
import UISortTH from 'UIComponents/table/UISortTH';
import styled from 'styled-components';
var StyledUISortTH = styled(UISortTH).withConfig({
  displayName: "Th__StyledUISortTH",
  componentId: "xmqsgg-0"
})(["display:flex;flex-direction:row;padding:0 !important;border-bottom:none !important;&:last-of-type{max-width:none !important;}"]);
var StyledCellContent = styled.div.withConfig({
  displayName: "Th__StyledCellContent",
  componentId: "xmqsgg-1"
})(["display:flex;flex-direction:row;flex-grow:1;justify-content:space-between;height:100%;border-right:", ";.cell-text{align-content:center;display:flex;flex-direction:row;flex-grow:1;padding:", ";justify-content:", ";align-items:", ";}"], function (_ref) {
  var isSelectViewCell = _ref.isSelectViewCell;
  return isSelectViewCell ? "1px solid " + GREAT_WHITE : null;
}, function (_ref2) {
  var isSelectViewCell = _ref2.isSelectViewCell;
  return isSelectViewCell ? '0' : '14px 24px';
}, function (_ref3) {
  var isSelectViewCell = _ref3.isSelectViewCell;
  return isSelectViewCell ? 'center' : null;
}, function (_ref4) {
  var isSelectViewCell = _ref4.isSelectViewCell;
  return isSelectViewCell ? 'center' : null;
});
/* for resizing
 * add in a resizing component with onTouchStart and onMouseDown
 *
 */

var sortDirections = {
  '-1': 'ascending',
  1: 'descending',
  none: 'none'
};

var Th = /*#__PURE__*/function (_PureComponent) {
  _inherits(Th, _PureComponent);

  function Th() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Th);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Th)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    _this.renderContent = function (args) {
      var arrowsNode = args.arrowsNode,
          children = args.children;

      var _this$props = _this.props,
          _this$props$children = _slicedToArray(_this$props.children, 2),
          __ = _this$props$children[0],
          ResizeAffordance = _this$props$children[1],
          id = _this$props.id,
          onSelectAllChange = _this$props.onSelectAllChange,
          resizable = _this$props.resizable;

      return /*#__PURE__*/_jsxs(StyledCellContent, {
        className: "truncate-text",
        isSelectViewCell: id === '_selector',
        children: [/*#__PURE__*/_jsxs("div", {
          className: "cell-text truncate-text",
          children: [id === '_selector' && children && children.props && children.props.children ? /*#__PURE__*/cloneElement(children.props.children, {
            onSelectAllChange: onSelectAllChange
          }) : children, arrowsNode]
        }), resizable && ResizeAffordance]
      });
    };

    return _this;
  }

  _createClass(Th, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          _this$props2$children = _slicedToArray(_this$props2.children, 2),
          content = _this$props2$children[0],
          ResizeAffordance = _this$props2$children[1],
          __dispatcher = _this$props2.dispatcher,
          draggable = _this$props2.draggable,
          id = _this$props2.id,
          onColumnReorder = _this$props2.onColumnReorder,
          __onSelectAllChange = _this$props2.onSelectAllChange,
          resizable = _this$props2.resizable,
          sortDirection = _this$props2.sortDirection,
          sortKey = _this$props2.sortKey,
          sortable = _this$props2.sortable,
          toggleSort = _this$props2.toggleSort,
          style = _this$props2.style,
          rest = _objectWithoutProperties(_this$props2, ["children", "dispatcher", "draggable", "id", "onColumnReorder", "onSelectAllChange", "resizable", "sortDirection", "sortKey", "sortable", "toggleSort", "style"]);

      var sort = sortKey === id ? sortDirection : 'none';
      if (draggable) return /*#__PURE__*/_jsx(ThDragDrop, Object.assign({}, rest, {
        content: content,
        id: id,
        isSortable: sortable,
        onClick: toggleSort,
        onColumnReorder: onColumnReorder,
        ResizeAffordance: resizable ? ResizeAffordance : null,
        sort: sortDirections[sort],
        style: style,
        StyledUISortTH: StyledUISortTH
      }));
      return /*#__PURE__*/_createElement(StyledUISortTH, Object.assign({}, rest, {
        Content: this.renderContent,
        disabled: !sortable,
        key: id,
        onClick: toggleSort,
        role: "columnheader",
        sort: sortDirections[sort],
        style: style
      }), content);
    }
  }]);

  return Th;
}(PureComponent);

export { Th as default };