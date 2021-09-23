'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { COMPANY_CREATED, COMPANIES_UPDATE_STARTED, COMPANIES_UPDATE_FAILED, COMPANY_DOMAIN_REMOVED } from 'crm_data/actions/ActionTypes';
import { fetch } from 'crm_data/companies/api/CompaniesAPI';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import { ASSOCIATE_CONTACT_AND_COMPANY, DISASSOCIATE_CONTACT_AND_COMPANY } from 'crm_schema/association/AssociationActionTypes';
var PREFIX = 'COMPANIES';
registerPooledObjectService({
  actionTypePrefix: PREFIX,
  fetcher: fetch,
  fetchLimit: 250
});
var CompaniesStore = definePooledObjectStore({
  actionTypePrefix: PREFIX
}).defineResponseTo(COMPANY_CREATED, function (state, company) {
  var companyId = "" + company.get('companyId');
  return state.set(companyId, company);
}).defineResponseTo(COMPANIES_UPDATE_STARTED, function (state, _ref) {
  var id = _ref.id,
      nextProperties = _ref.nextProperties;
  return state.updateIn([id], function (company) {
    return nextProperties.reduce(function (acc, value, name) {
      return setProperty(acc, name, value);
    }, company);
  });
}).defineResponseTo(COMPANIES_UPDATE_FAILED, function (state, _ref2) {
  var id = _ref2.id,
      nextProperties = _ref2.nextProperties,
      properties = _ref2.properties;
  return state.updateIn([id], function (company) {
    return properties.reduce(function (acc, value, name) {
      // don't overwrite changes made since the update began
      if (nextProperties.get(name) !== getProperty(acc, name)) {
        return acc;
      }

      return setProperty(acc, name, value);
    }, company);
  });
}).defineResponseTo(COMPANY_DOMAIN_REMOVED, function (state, _ref3) {
  var domain = _ref3.domain,
      company = _ref3.company;
  var companyId = "" + company.get('companyId');
  return state.updateIn([companyId], function (companyRecord) {
    var filteredResults = companyRecord.get('additionalDomains').filter(function (entry) {
      return entry.get('domain') !== domain;
    });
    return companyRecord.set('additionalDomains', filteredResults);
  });
}).defineResponseTo(DISASSOCIATE_CONTACT_AND_COMPANY, function (state, _ref4) {
  var subjectId = _ref4.subjectId;
  var companyId = "" + subjectId;

  if (!state.get(companyId)) {
    return state;
  }

  return state.update(companyId, function (companyRecord) {
    var contactCount = getProperty(companyRecord, 'num_associated_contacts');
    var oneLessContact = parseInt(contactCount, 10) - 1;
    return setProperty(companyRecord, 'num_associated_contacts', oneLessContact);
  });
}).defineResponseTo(ASSOCIATE_CONTACT_AND_COMPANY, function (state, _ref5) {
  var subjectId = _ref5.subjectId;
  var companyId = "" + subjectId;

  if (!state.get(companyId)) {
    return state;
  }

  return state.update(companyId, function (companyRecord) {
    var contactCount = getProperty(companyRecord, 'num_associated_contacts') || 0;
    var oneMoreContact = parseInt(contactCount, 10) + 1;
    return setProperty(companyRecord, 'num_associated_contacts', oneMoreContact);
  });
}).register(dispatcher);
export default CompaniesStore;