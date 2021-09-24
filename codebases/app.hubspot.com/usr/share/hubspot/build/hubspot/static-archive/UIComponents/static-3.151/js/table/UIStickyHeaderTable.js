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
import devLogger from 'react-utils/devLogger';
import styled from 'styled-components';
import UITable from './UITable';
import UISection from '../section/UISection';
import UIScrollContainer from '../scroll/UIScrollContainer';
import { isIE11 } from '../utils/BrowserTest';
import { TABLE_BORDER_COLOR } from 'HubStyleTokens/theme';
import { TABLE_HEADER_HEIGHT, MERCURY_LAYER } from 'HubStyleTokens/sizes';
var Section = styled(UISection).withConfig({
  displayName: "UIStickyHeaderTable__Section",
  componentId: "gnh73d-0"
})(["border:1px solid ", ";"], TABLE_BORDER_COLOR);
var Table = styled(UITable).withConfig({
  displayName: "UIStickyHeaderTable__Table",
  componentId: "gnh73d-1"
})(["border-width:0;thead{display:flex;position:absolute;position:sticky;top:0;", ";background-color:white;z-index:", ";th{border-top-width:0;}}tbody{display:table;", ";tr:first-child td{", ";}}"], !isIE11() && "border-bottom: 1px solid " + TABLE_BORDER_COLOR, MERCURY_LAYER, isIE11() && "transform: translateY(" + TABLE_HEADER_HEIGHT + ")", !isIE11() && "border-top-width: 0");

var UIStickyHeaderTable = /*#__PURE__*/function (_Component) {
  _inherits(UIStickyHeaderTable, _Component);

  function UIStickyHeaderTable() {
    _classCallCheck(this, UIStickyHeaderTable);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIStickyHeaderTable).apply(this, arguments));
  }

  _createClass(UIStickyHeaderTable, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          condensed = _this$props.condensed,
          maxHeight = _this$props.maxHeight,
          ScrollContainer = _this$props.ScrollContainer,
          tableClassName = _this$props.tableClassName,
          rest = _objectWithoutProperties(_this$props, ["children", "condensed", "maxHeight", "ScrollContainer", "tableClassName"]);

      if (process.env.NODE_ENV !== 'production') {
        if (typeof maxHeight === 'string' && maxHeight.includes('%')) {
          devLogger.warn({
            message: 'UIStickyHeaderTable: `maxHeight` must be a fixed value, not a % value.',
            key: 'sticky-maxheight'
          });
        }
      }

      return /*#__PURE__*/_jsx(Section, Object.assign({}, rest, {
        children: /*#__PURE__*/_jsx(ScrollContainer, {
          maxHeight: maxHeight,
          scrollDirection: "both",
          children: /*#__PURE__*/_jsx(Table, {
            className: tableClassName,
            condensed: condensed,
            flush: true,
            responsive: false,
            children: children
          })
        })
      }));
    }
  }]);

  return UIStickyHeaderTable;
}(Component);

export { UIStickyHeaderTable as default };
UIStickyHeaderTable.propTypes = {
  children: PropTypes.node,
  condensed: UITable.propTypes.condensed,
  flush: UISection.propTypes.flush,
  hover: UITable.propTypes.hover,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  ScrollContainer: PropTypes.elementType,
  tableClassName: PropTypes.string
};
UIStickyHeaderTable.defaultProps = {
  condensed: UITable.defaultProps.condensed,
  flush: UITable.defaultProps.flush,
  hover: UITable.defaultProps.hover,
  ScrollContainer: UIScrollContainer
};
UIStickyHeaderTable.displayName = 'UIStickyHeaderTable';