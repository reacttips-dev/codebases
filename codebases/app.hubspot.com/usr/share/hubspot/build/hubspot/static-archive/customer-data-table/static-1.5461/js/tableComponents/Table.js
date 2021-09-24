'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIStickyHeaderTable from 'UIComponents/table/UIStickyHeaderTable';

var Table = function Table(props) {
  var children = props.children,
      __clasName = props.className,
      condensed = props.condensed,
      moreCondensed = props.moreCondensed,
      condensedFooter = props.condensedFooter,
      rest = _objectWithoutProperties(props, ["children", "className", "condensed", "moreCondensed", "condensedFooter"]); // TODO: remove this and just pass in "tableClassName" in "getTableProps"


  var tableClassName = moreCondensed ? 'table-more-condensed' : undefined;
  var condensedFooterClass = condensedFooter ? 'm-bottom-1' : '';
  return /*#__PURE__*/_jsx(UIStickyHeaderTable, Object.assign({
    className: condensedFooterClass + " " + __clasName,
    condensed: condensed,
    tableClassName: tableClassName
  }, rest, {
    children: children
  }));
};

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  condensed: PropTypes.bool,
  condensedFooter: PropTypes.bool,
  maxHeight: PropTypes.string,
  moreCondensed: PropTypes.bool
};
Table.defaultProps = {
  condensed: false,
  maxHeight: '100%'
};
export default Table;