'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_COLUMN_WIDTH } from 'customer-data-table/constants/ColumnConstants';
import { getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import ColumnRecord from './ColumnRecord';
import get from 'transmute/get';
import invariant from 'react-utils/invariant';

var propertyColumn = function propertyColumn(params) {
  invariant(params, 'propertyColumn requires params');

  var _Cell = params.Cell,
      CustomCell = params.CustomCell,
      Header = params.Header,
      _params$alignRight = params.alignRight,
      alignRight = _params$alignRight === void 0 ? false : _params$alignRight,
      extraCellProps = params.extraCellProps,
      accessor = params.accessor,
      _params$UNSAFE_flexWi = params.UNSAFE_flexWidth,
      UNSAFE_flexWidth = _params$UNSAFE_flexWi === void 0 ? false : _params$UNSAFE_flexWi,
      objectType = params.objectType,
      _params$order = params.order,
      order = _params$order === void 0 ? 0 : _params$order,
      property = params.property,
      _params$sortable = params.sortable,
      sortable = _params$sortable === void 0 ? true : _params$sortable,
      _params$width = params.width,
      width = _params$width === void 0 ? DEFAULT_COLUMN_WIDTH : _params$width,
      rest = _objectWithoutProperties(params, ["Cell", "CustomCell", "Header", "alignRight", "extraCellProps", "accessor", "UNSAFE_flexWidth", "objectType", "order", "property", "sortable", "width"]);

  invariant(property, 'propertyColumn requires a property');
  var className = alignRight ? 'text-right' : 'text-left';
  var label = get('label', property) || '--';
  var name = get('name', property);
  var hubspotDefined = get('hubspotDefined', property);

  var defaultAccessor = function defaultAccessor(record) {
    return getProperty(record, name);
  };

  return ColumnRecord(Object.assign({}, rest, {
    Header: Header || /*#__PURE__*/_jsx("span", {
      className: className,
      children: hubspotDefined ? propertyLabelTranslator(label) : label
    }),
    id: name,
    order: order,
    sortable: sortable,
    width: UNSAFE_flexWidth ? undefined : width,
    accessor: accessor || defaultAccessor,
    Cell: function Cell(cellProps) {
      return /*#__PURE__*/_jsx(_Cell, Object.assign({}, cellProps, {}, extraCellProps, {
        CustomCell: CustomCell,
        id: get('value', cellProps),
        objectType: objectType,
        property: property
      }));
    }
  }));
};

export default propertyColumn;