'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { DEFAULT_COLUMN_WIDTH } from 'customer-data-table/constants/ColumnConstants';
import AssociationCell from 'customer-data-table/cells/AssociationCell';
import ColumnRecord from './ColumnRecord';
import get from 'transmute/get';
import invariant from 'react-utils/invariant';
export default (function (params) {
  invariant(params, 'propertyColumn requires params');

  var Header = params.Header,
      extraCellProps = params.extraCellProps,
      objectType = params.objectType,
      _params$order = params.order,
      order = _params$order === void 0 ? 0 : _params$order,
      id = params.id,
      _params$width = params.width,
      width = _params$width === void 0 ? DEFAULT_COLUMN_WIDTH : _params$width,
      _params$UNSAFE_flexWi = params.UNSAFE_flexWidth,
      UNSAFE_flexWidth = _params$UNSAFE_flexWi === void 0 ? false : _params$UNSAFE_flexWi,
      rest = _objectWithoutProperties(params, ["Header", "extraCellProps", "objectType", "order", "id", "width", "UNSAFE_flexWidth"]);

  return ColumnRecord(Object.assign({}, rest, {
    Header: Header,
    id: id,
    order: order,
    sortable: false,
    width: UNSAFE_flexWidth ? undefined : width,
    accessor: function accessor(record) {
      return get('associations', record);
    },
    Cell: function Cell(cellProps) {
      return /*#__PURE__*/_jsx(AssociationCell, Object.assign({}, cellProps, {}, extraCellProps, {
        objectType: objectType
      }));
    }
  }));
});