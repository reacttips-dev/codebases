'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import AvatarCell from '../cells/AvatarCell';
import ColumnRecord from './ColumnRecord';
export var avatarColumn = function avatarColumn() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var onPreviewClick = params.onPreviewClick,
      property = params.property,
      order = params.order,
      objectType = params.objectType,
      rest = _objectWithoutProperties(params, ["onPreviewClick", "property", "order", "objectType"]);

  return ColumnRecord(Object.assign({}, rest, {
    Header: propertyLabelTranslator('name'),
    // hard-coded, HubSpot-defined
    id: 'name',
    order: order,
    accessor: function accessor(record) {
      return record;
    },
    Cell: function Cell(cellProps) {
      return /*#__PURE__*/_jsx(AvatarCell, Object.assign({}, cellProps, {
        objectType: objectType,
        onPreviewClick: onPreviewClick,
        property: property
      }));
    }
  }));
};
export default avatarColumn;