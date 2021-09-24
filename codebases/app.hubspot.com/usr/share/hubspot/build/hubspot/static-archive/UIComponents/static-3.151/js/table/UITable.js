'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import cx from 'classnames';
import { TABLE_CELL_VERTICAL_ALIGNMENT, TABLE_HEADER_VERTICAL_ALIGNMENT } from 'HubStyleTokens/misc';
import { TABLE_CELL_HEIGHT, TABLE_COMPACT_CELL_HEIGHT, TABLE_COMPACT_PADDING_Y, TABLE_DEFAULT_FONT_SIZE, TABLE_DEFAULT_PADDING_X, TABLE_DEFAULT_PADDING_Y, TABLE_HEADER_FONT_SIZE, TABLE_HEADER_HEIGHT, TABLE_HEADER_PADDING_BOTTOM, TABLE_HEADER_PADDING_TOP } from 'HubStyleTokens/sizes';
import { BASE_FONT_COLOR, TABLE_BACKGROUND_COLOR, TABLE_BORDER_COLOR, TABLE_HEADER_BACKGROUND_COLOR, TABLE_ROW_HOVER_BACKGROUND_COLOR } from 'HubStyleTokens/theme';
import { MICRO_TRANSITION_TIMING } from 'HubStyleTokens/times';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styled from 'styled-components';
import UIScrollContainer from '../scroll/UIScrollContainer';
import UISection from '../section/UISection';
import { FONT_FAMILIES } from '../utils/Styles';
var TableScrollContainer = styled(UIScrollContainer).withConfig({
  displayName: "UITable__TableScrollContainer",
  componentId: "sc-12xz3i6-0"
})(["height:", ";"], function (_ref) {
  var scrollDirection = _ref.scrollDirection;
  return scrollDirection === 'both' && '100%';
});
var Table = styled.table.withConfig({
  displayName: "UITable__Table",
  componentId: "sc-12xz3i6-1"
})(["font-size:", ";background-color:", ";border-collapse:collapse;width:100%;", ";th,td{border-color:", ";border-style:solid;border-width:1px 0 0;line-height:normal;vertical-align:middle;}thead{th{", ";font-size:", ";background-color:", ";color:", ";height:", ";padding-bottom:", ";padding-left:", ";padding-right:", ";padding-top:", ";text-align:left;text-transform:uppercase;vertical-align:", ";}}tfoot{td,th{", ";height:", ";padding:", " ", ";text-align:left;}}tbody{td{hyphens:auto;height:", ";overflow-wrap:break-word;padding:", " ", ";vertical-align:", ";.private-tag--inline{vertical-align:", ";}}}", ";", ";", ";", ";.private-card &{border:0;border-radius:inherit;thead{th,.private-table-sort-toggle{background-color:transparent;border-top:0;}}}.private-panel__body &{", ";}"], TABLE_DEFAULT_FONT_SIZE, TABLE_BACKGROUND_COLOR, function (props) {
  return (props.flush || props.responsive) && "&& { margin-bottom: 0; }";
}, TABLE_BORDER_COLOR, FONT_FAMILIES.medium, TABLE_HEADER_FONT_SIZE, TABLE_HEADER_BACKGROUND_COLOR, BASE_FONT_COLOR, TABLE_HEADER_HEIGHT, TABLE_HEADER_PADDING_BOTTOM, TABLE_DEFAULT_PADDING_X, TABLE_DEFAULT_PADDING_X, TABLE_HEADER_PADDING_TOP, TABLE_HEADER_VERTICAL_ALIGNMENT, FONT_FAMILIES.demibold, TABLE_CELL_HEIGHT, TABLE_DEFAULT_PADDING_Y, TABLE_DEFAULT_PADDING_X, TABLE_CELL_HEIGHT, TABLE_DEFAULT_PADDING_Y, TABLE_DEFAULT_PADDING_X, TABLE_CELL_VERTICAL_ALIGNMENT, TABLE_CELL_VERTICAL_ALIGNMENT, function (props) {
  return props.bordered !== false && "\n      border-color: " + TABLE_BORDER_COLOR + ";\n      border-style: solid;\n      border-width: 0 1px 1px;\n  ";
}, function (props) {
  return props.condensed && "\n      thead th {\n        height: " + TABLE_HEADER_HEIGHT + ";\n        padding-bottom: " + TABLE_COMPACT_PADDING_Y + ";\n        padding-top: " + TABLE_COMPACT_PADDING_Y + "\n      }\n\n      tbody {\n        td, th {\n          height: " + TABLE_COMPACT_CELL_HEIGHT + ";\n          padding-bottom: " + TABLE_COMPACT_PADDING_Y + ";\n          padding-top: " + TABLE_COMPACT_PADDING_Y + ";\n        }\n      }\n  ";
}, function (props) {
  return props.hover && "\n      tbody {\n        tr {\n          transition: background-color " + MICRO_TRANSITION_TIMING + " ease-out;\n        }\n        tr:hover {\n          background-color: " + TABLE_ROW_HOVER_BACKGROUND_COLOR + ";\n        }\n      }\n  ";
}, function (props) {
  return props.truncated && "\n      table-layout: fixed;\n\n      td,\n      th {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n      }\n  ";
}, function (props) {
  return props.bordered !== true && "border-width: 0 0 1px;";
});
var UITable = /*#__PURE__*/forwardRef(function (props, ref) {
  var bordered = props.bordered,
      children = props.children,
      className = props.className,
      condensed = props.condensed,
      flush = props.flush,
      height = props.height,
      hover = props.hover,
      responsive = props.responsive,
      responsiveWrapperClassName = props.responsiveWrapperClassName,
      ScrollContainer = props.ScrollContainer,
      truncated = props.truncated,
      rest = _objectWithoutProperties(props, ["bordered", "children", "className", "condensed", "flush", "height", "hover", "responsive", "responsiveWrapperClassName", "ScrollContainer", "truncated"]);

  var computedClassName = cx('table private-table', className, bordered && 'table-bordered', condensed && 'table-condensed private-table--condensed');

  var renderedTable = /*#__PURE__*/_jsx(Table, Object.assign({}, rest, {
    className: computedClassName,
    bordered: bordered,
    condensed: condensed,
    flush: flush,
    hover: hover,
    ref: ref,
    responsive: responsive,
    truncated: truncated,
    children: children
  }));

  return responsive ? /*#__PURE__*/_jsx(UISection, {
    className: cx("table-responsive private-scroll__wrapper--tables", responsiveWrapperClassName),
    flush: flush,
    height: height,
    children: /*#__PURE__*/_jsx(ScrollContainer, {
      scrollDirection: height != null ? 'both' : 'horizontal',
      children: renderedTable
    })
  }) : renderedTable;
});
UITable.propTypes = {
  bordered: PropTypes.oneOf([true, false, 'auto']),
  children: PropTypes.node.isRequired,
  condensed: PropTypes.bool.isRequired,
  flush: PropTypes.bool.isRequired,
  height: UISection.propTypes.height,
  hover: PropTypes.bool.isRequired,
  responsive: PropTypes.bool.isRequired,
  responsiveWrapperClassName: PropTypes.string,
  ScrollContainer: PropTypes.elementType.isRequired,
  truncated: PropTypes.bool.isRequired
};
UITable.defaultProps = {
  bordered: 'auto',
  condensed: false,
  flush: false,
  hover: true,
  responsive: true,
  ScrollContainer: TableScrollContainer,
  truncated: false
};
UITable.displayName = 'UITable';
export default UITable;