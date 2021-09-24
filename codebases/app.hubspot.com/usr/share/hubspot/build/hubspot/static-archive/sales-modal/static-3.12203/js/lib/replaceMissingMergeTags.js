'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import * as ContactApi from 'sales-modal/api/ContactApi';
import * as CompanyApi from 'sales-modal/api/CompanyApi';
export default (function (contact, mergeTagInputFields, sourceId) {
  var source = 'SEQUENCES';
  var vid = contact.get('vid');
  var associatedCompany = contact.get('associated-company');
  var propertiesToUpdateMap = ImmutableMap({
    company: [],
    contact: [],
    deal: [],
    ticket: []
  });
  var propertiesToUpdate = mergeTagInputFields.reduce(function (updateMap, updatedPropertyValue, property) {
    if (updatedPropertyValue === '') {
      return updateMap;
    }

    var _property$split = property.split('.'),
        _property$split2 = _slicedToArray(_property$split, 2),
        propertyType = _property$split2[0],
        propertyName = _property$split2[1];

    if (propertyType === 'company') {
      var companyProperties = updateMap.get('company');
      return updateMap.set('company', companyProperties.concat([{
        source: source,
        sourceId: sourceId,
        name: propertyName,
        value: updatedPropertyValue
      }]));
    }

    if (propertyType === 'contact') {
      var contactProperties = updateMap.get('contact');
      return updateMap.set('contact', contactProperties.concat([{
        source: source,
        property: propertyName,
        'source-id': sourceId,
        value: updatedPropertyValue
      }]));
    }

    if (propertyType === 'deal') {
      var dealProperties = updateMap.get('deal');
      return updateMap.set('deal', dealProperties.concat([{
        source: source,
        sourceId: sourceId,
        property: propertyName,
        value: updatedPropertyValue
      }]));
    }

    if (propertyType === 'ticket') {
      var ticketProperties = updateMap.get('ticket');
      return updateMap.set('ticket', ticketProperties.concat([{
        source: source,
        sourceId: sourceId,
        property: propertyName,
        value: updatedPropertyValue
      }]));
    }

    return updateMap;
  }, propertiesToUpdateMap);
  var updatedContactProperties = propertiesToUpdate.get('contact');
  var updatedCompanyProperties = propertiesToUpdate.get('company');

  if (updatedContactProperties.length > 0 && vid) {
    ContactApi.updateContactProperties(vid, updatedContactProperties).then(null, function (err) {
      if (err.status === 403) {
        return;
      }

      throw err;
    });
  }

  if (updatedCompanyProperties.length > 0 && associatedCompany !== undefined) {
    var companyId = associatedCompany.get('company-id');
    CompanyApi.updateCompanyProperties(companyId, updatedCompanyProperties).then(null, function (err) {
      if (err.status === 403) {
        return;
      }

      throw err;
    });
  }
});