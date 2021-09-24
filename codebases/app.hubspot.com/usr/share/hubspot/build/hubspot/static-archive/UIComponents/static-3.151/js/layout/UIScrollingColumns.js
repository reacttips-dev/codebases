'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import UIScrollingColumn from '../layout/UIScrollingColumn';
var COLUMN_OPTIONS = ['both', 'left', 'right'];
export default function UIScrollingColumns(props) {
  var className = props.className,
      leftColumnContent = props.leftColumnContent,
      leftColumnHeader = props.leftColumnHeader,
      leftColumnFooter = props.leftColumnFooter,
      leftColumnMinWidth = props.leftColumnMinWidth,
      leftColumnScrollDirection = props.leftColumnScrollDirection,
      maxHeight = props.maxHeight,
      rightColumnContent = props.rightColumnContent,
      rightColumnFooter = props.rightColumnFooter,
      rightColumnHeader = props.rightColumnHeader,
      rightColumnScrollDirection = props.rightColumnScrollDirection,
      rightColumnWidth = props.rightColumnWidth,
      scrollColumn = props.scrollColumn,
      style = props.style,
      _leftColumnClassName = props._leftColumnClassName,
      _leftColumnFooterClassName = props._leftColumnFooterClassName,
      _leftColumnHeaderClassName = props._leftColumnHeaderClassName,
      _rightColumnClassName = props._rightColumnClassName,
      _rightColumnFooterClassName = props._rightColumnFooterClassName,
      _rightColumnHeaderClassName = props._rightColumnHeaderClassName,
      rest = _objectWithoutProperties(props, ["className", "leftColumnContent", "leftColumnHeader", "leftColumnFooter", "leftColumnMinWidth", "leftColumnScrollDirection", "maxHeight", "rightColumnContent", "rightColumnFooter", "rightColumnHeader", "rightColumnScrollDirection", "rightColumnWidth", "scrollColumn", "style", "_leftColumnClassName", "_leftColumnFooterClassName", "_leftColumnHeaderClassName", "_rightColumnClassName", "_rightColumnFooterClassName", "_rightColumnHeaderClassName"]);

  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    className: classNames('private-scroll-columns', className, maxHeight != undefined && 'private-scroll-columns--custom-height', scrollColumn !== 'both' && 'private-scroll-columns--grow'),
    style: Object.assign({}, style, {
      maxHeight: maxHeight
    }),
    children: [/*#__PURE__*/_jsx(UIScrollingColumn, {
      className: classNames("private-scroll-columns--inset private-scroll-columns--left", _leftColumnClassName, scrollColumn === 'left' && 'private-scroll-columns__column--overflows'),
      flexBasis: leftColumnMinWidth,
      flexGrow: 9999,
      flexShrink: 1,
      footerClassName: _leftColumnFooterClassName,
      footerContent: leftColumnFooter,
      headerClassName: _leftColumnHeaderClassName,
      headerContent: leftColumnHeader,
      maxHeight: maxHeight,
      scrollDirection: leftColumnScrollDirection,
      children: leftColumnContent
    }), /*#__PURE__*/_jsx(UIScrollingColumn, {
      className: classNames("private-scroll-columns--inset private-scroll-columns--right", _rightColumnClassName, scrollColumn === 'right' && 'private-scroll-columns__column--overflows'),
      flexBasis: rightColumnWidth,
      flexGrow: 1,
      flexShrink: 1,
      footerClassName: _rightColumnFooterClassName,
      footerContent: rightColumnFooter,
      headerClassName: _rightColumnHeaderClassName,
      headerContent: rightColumnHeader,
      maxHeight: maxHeight,
      scrollDirection: rightColumnScrollDirection,
      children: rightColumnContent
    })]
  }));
}
UIScrollingColumns.propTypes = {
  leftColumnContent: PropTypes.node,
  leftColumnFooter: PropTypes.node,
  leftColumnHeader: PropTypes.node,
  leftColumnMinWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  leftColumnScrollDirection: UIScrollingColumn.propTypes.scrollDirection,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rightColumnContent: PropTypes.node,
  rightColumnFooter: PropTypes.node,
  rightColumnHeader: PropTypes.node,
  rightColumnScrollDirection: UIScrollingColumn.propTypes.scrollDirection,
  rightColumnWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scrollColumn: PropTypes.oneOf(COLUMN_OPTIONS).isRequired,
  _leftColumnClassName: PropTypes.string,
  _rightColumnClassName: PropTypes.string,
  _leftColumnHeaderClassName: PropTypes.string,
  _rightColumnHeaderClassName: PropTypes.string,
  _leftColumnFooterClassName: PropTypes.string,
  _rightColumnFooterClassName: PropTypes.string
};
UIScrollingColumns.defaultProps = {
  leftColumnMinWidth: 250,
  rightColumnWidth: '40%',
  scrollColumn: 'both',
  leftColumnScrollDirection: UIScrollingColumn.defaultProps.scrollDirection,
  rightColumnScrollDirection: UIScrollingColumn.defaultProps.scrollDirection
};
UIScrollingColumns.displayName = 'UIScrollingColumns';