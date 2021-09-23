'use es6';

import { fetchContactProperties } from '../clients/fetchContactProperties';
import get from 'transmute/get';
import { PhoneNumberProperty } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { getLabel } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
export var getCustomPhoneContactProperties = function getCustomPhoneContactProperties() {
  return fetchContactProperties().then(function (data) {
    if (!data) return null;
    var properties = get('properties', data);
    var customPhoneNumberProperties = properties.filter(function (property) {
      return !property.deleted && !property.calculated && !property.readOnlyValue && !property.hubspotDefined && !property.hidden && property.fieldType === 'text' && property.type === 'string';
    });
    return customPhoneNumberProperties.reduce(function (acc, property) {
      acc.push(new PhoneNumberProperty({
        propertyName: get('name', property),
        label: getLabel(property),
        hubspotDefined: false
      }));
      return acc;
    }, []);
  });
};