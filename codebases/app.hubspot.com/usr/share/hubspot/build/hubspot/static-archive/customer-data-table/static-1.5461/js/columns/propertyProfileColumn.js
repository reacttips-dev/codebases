'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { getId, getObjectType, getProperty } from 'customer-data-objects/record/ObjectRecordAccessors';
import { getPropertyType, getPropertyFieldType } from '../tableFunctions';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import get from 'transmute/get';
import ColumnRecord from './ColumnRecord';
import invariant from 'react-utils/invariant';
var LABEL_COLUMNS = ['dealname', 'subject'];
/**
 * HACK: "Label columns" are currently hardcoded per object type, but we
 * can't do that for portal-defined objects. This is a workaround until
 * we can imnplement a solution that works for all object types:
 * https://git.hubteam.com/HubSpot/CRM-Issues/issues/5556
 */

var isLabelColumn = function isLabelColumn(name, objectType, order) {
  if (isObjectTypeId(objectType) && order === 0) {
    return true;
  }

  return LABEL_COLUMNS.includes(name);
};

export default (function (params) {
  invariant(params, 'propertyProfileColumn requires params');
  var property = params.property,
      _Cell = params.Cell,
      order = params.order,
      extraCellProps = params.extraCellProps,
      objectType = params.objectType;
  invariant(property, 'propertyProfileColumn requires a property');
  var name = property.get('name');
  var label = property.get('label') || '--';
  var isHubspotDefined = property.get('hubspotDefined');
  var labelColumn = isLabelColumn(name, objectType, order);
  var type = getPropertyType(property);
  var fieldType = getPropertyFieldType(property);
  var options = get('options', property);
  return ColumnRecord({
    Header: isHubspotDefined ? propertyLabelTranslator(label) : label,
    id: name,
    order: labelColumn ? 0 : order,
    accessor: function accessor(record) {
      var value = getProperty(record, name);
      return ImmutableMap({
        name: value,
        id: getId(record),
        objectType: isObjectTypeId(objectType) ? objectType : getObjectType(record),
        // HACK: The following values are used to derive the property value
        // when it is an enum/date/datetime/html type. This is a hack, only meant to
        // hold us over to table v2.
        value: value,
        type: type,
        fieldType: fieldType,
        options: options,
        isHubspotDefined: isHubspotDefined
      });
    },
    Cell: function Cell(cellProps) {
      return /*#__PURE__*/_jsx(_Cell, Object.assign({}, cellProps, {}, extraCellProps, {
        property: property
      }));
    },
    draggable: labelColumn ? false : undefined
  });
});