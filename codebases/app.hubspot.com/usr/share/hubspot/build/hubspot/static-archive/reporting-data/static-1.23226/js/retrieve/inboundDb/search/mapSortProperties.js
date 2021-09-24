'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _SORT_ID_PROPERTIES, _DataTypes$COMPANIES, _DataTypes$DEALS, _DataTypes$TICKETS, _fromJS;

import { fromJS, List } from 'immutable';
import * as DataTypes from '../../../constants/dataTypes';
import { extractPropertyNamespace, getObjectId, namespaceProperty } from '../../../properties/namespaceProperty';
var SORT_ID_PROPERTIES = (_SORT_ID_PROPERTIES = {}, _defineProperty(_SORT_ID_PROPERTIES, DataTypes.CONTACTS, 'vid'), _defineProperty(_SORT_ID_PROPERTIES, DataTypes.COMPANIES, 'company-id'), _defineProperty(_SORT_ID_PROPERTIES, DataTypes.DEALS, 'dealId'), _defineProperty(_SORT_ID_PROPERTIES, DataTypes.TICKETS, 'hs_ticket_id'), _SORT_ID_PROPERTIES);
var SORT_PROPERTY_MAP = fromJS((_fromJS = {}, _defineProperty(_fromJS, DataTypes.CONTACTS, _defineProperty({
  vid: ['lastname', 'firstname', 'email', 'hs_object_id'],
  hs_object_id: ['lastname', 'firstname', 'email', 'hs_object_id']
}, getObjectId(DataTypes.CONTACTS), ['lastname', 'firstname', 'email', 'hs_object_id'])), _defineProperty(_fromJS, DataTypes.COMPANIES, (_DataTypes$COMPANIES = {}, _defineProperty(_DataTypes$COMPANIES, 'company-id', ['name', 'hs_object_id']), _defineProperty(_DataTypes$COMPANIES, "hs_object_id", ['name', 'hs_object_id']), _defineProperty(_DataTypes$COMPANIES, getObjectId(DataTypes.COMPANIES), ['name', 'hs_object_id']), _DataTypes$COMPANIES)), _defineProperty(_fromJS, DataTypes.DEALS, (_DataTypes$DEALS = {
  dealId: ['dealname', 'hs_object_id'],
  hs_object_id: ['dealname', 'hs_object_id']
}, _defineProperty(_DataTypes$DEALS, getObjectId(DataTypes.DEALS), ['dealname', 'hs_object_id']), _defineProperty(_DataTypes$DEALS, "dealstage", ['dealstage.displayOrder', 'dealstage']), _DataTypes$DEALS)), _defineProperty(_fromJS, DataTypes.TICKETS, (_DataTypes$TICKETS = {
  hs_object_id: ['subject', 'hs_object_id']
}, _defineProperty(_DataTypes$TICKETS, 'hs_ticket_id', ['subject', 'hs_object_id']), _defineProperty(_DataTypes$TICKETS, getObjectId(DataTypes.TICKETS), ['subject', 'hs_object_id']), _DataTypes$TICKETS)), _fromJS));

var getMappedProperty = function getMappedProperty(dataType, property) {
  return SORT_PROPERTY_MAP.getIn([dataType, property], List([property])).toJS();
};

var mapCrossObjectProperty = function mapCrossObjectProperty(property) {
  var _extractPropertyNames = extractPropertyNamespace(property),
      dataType = _extractPropertyNames.dataType,
      propertyName = _extractPropertyNames.propertyName;

  return getMappedProperty(dataType, propertyName).map(function (mappedProperty) {
    return namespaceProperty(dataType, mappedProperty === 'hs_object_id' ? SORT_ID_PROPERTIES[dataType] : mappedProperty);
  });
};

export default (function (config, sorts) {
  var dataType = config.get('dataType');
  var isCrossObject = dataType === DataTypes.CROSS_OBJECT;
  var updatedSorts = [];
  sorts.forEach(function (_ref) {
    var property = _ref.property,
        order = _ref.order;
    var mappedProperties = isCrossObject ? mapCrossObjectProperty(property) : getMappedProperty(dataType, property);
    updatedSorts = updatedSorts.concat(mappedProperties.map(function (mappedProperty) {
      return {
        property: mappedProperty,
        order: order
      };
    }));
  });
  return updatedSorts;
});