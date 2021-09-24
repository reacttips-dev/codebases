'use es6';

import { List } from 'immutable';
import PortalIdParser from 'PortalIdParser';
import { API, CRM_UI, IMPORT } from 'customer-data-objects/property/PropertySourceTypes';
var propertySourceAllowList = [API, CRM_UI, IMPORT];
export var createObject = function createObject(lineItem) {
  var skipSourceValidation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return {
    portalId: PortalIdParser.get(),
    properties: lineItem.get('properties').reduce(function (properties, lineItemProperty, name) {
      var _lineItemProperty$toO = lineItemProperty.toObject(),
          value = _lineItemProperty$toO.value,
          source = _lineItemProperty$toO.source;

      if (skipSourceValidation) {
        return properties.push({
          name: name,
          value: value
        });
      }

      return propertySourceAllowList.includes(source) ? properties.push({
        name: name,
        value: value
      }) : properties;
    }, List()).toArray()
  };
};