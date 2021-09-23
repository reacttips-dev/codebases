'use es6';

import { List, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import invariant from 'react-utils/invariant';
import { COMPANIES_UPDATED, COMPANY_DOMAIN_FOUND, COMPANY_DOMAIN_NOT_FOUND, COMPANIES_FETCH_SUCCEEDED, COMPANIES_REFRESH_QUEUED, COMPANY_CREATED, COMPANIES_UPDATE_STARTED, COMPANIES_UPDATE_FAILED, COMPANIES_UPDATE_SUCCEEDED, COMPANY_DOMAIN_REMOVED, ASSOCIATIONS_REFRESH_QUEUED } from 'crm_data/actions/ActionTypes';
import { transact } from 'crm_data/flux/transact';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import * as CompaniesAPI from 'crm_data/companies/api/CompaniesAPI';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
import { COMPANY_TO_CONTACT, COMPANY_TO_DEAL, COMPANY_TO_TICKET } from 'crm_data/associations/AssociationTypes';

var toPropertyList = function toPropertyList(record) {
  return record.get('properties').reduce(function (list, _ref, name) {
    var value = _ref.value,
        source = _ref.source,
        sourceId = _ref.sourceId;
    return list.push({
      value: value,
      name: name,
      sourceId: sourceId,
      source: source
    });
  }, List());
};

var makeAssociationKey = function makeAssociationKey(id, associationType) {
  return ImmutableMap({
    objectId: id,
    objectType: COMPANY,
    associationType: associationType
  });
};

export function refresh(ids) {
  dispatchQueue(COMPANIES_REFRESH_QUEUED, ImmutableSet(ids));
  dispatchQueue(ASSOCIATIONS_REFRESH_QUEUED, ImmutableSet([makeAssociationKey(ids[0], COMPANY_TO_CONTACT), makeAssociationKey(ids[0], COMPANY_TO_DEAL), makeAssociationKey(ids[0], COMPANY_TO_TICKET)]));
}
export function createCompany(record) {
  var properties = toPropertyList(record);
  return CompaniesAPI.createCompany(properties).then(function (response) {
    var company = response.first();
    dispatchImmediate(COMPANY_CREATED, company);
    return company;
  });
}
export function deleteCompany(companyId, callback) {
  return CompaniesAPI.deleteCompany(companyId).then(function () {
    setTimeout(function () {
      dispatchImmediate(COMPANIES_UPDATED, ImmutableMap().set("" + companyId, null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  }).done();
}
export function updateCompanies(companies) {
  invariant(ImmutableMap.isMap(companies), 'Companies Actions: expected companies to be a Map but got "%s"');
  return dispatchImmediate(COMPANIES_UPDATED, companies);
}
export function updateCompany(company, updates) {
  var companyId = company.get('companyId');
  return transact({
    operation: function operation() {
      return CompaniesAPI.update(ImmutableMap({
        companyId: companyId,
        properties: updates
      }));
    },
    commit: [COMPANIES_UPDATED, ImmutableMap().set(companyId, updates.reduce(function (updated, property) {
      return updated.setIn(['properties', property.get('name'), 'value'], property.get('value'));
    }, company))],
    rollback: [COMPANIES_UPDATED, company]
  });
}
export function updateCompanyProperties(company, nextProperties) {
  var id = "" + company.get('companyId');
  var properties = nextProperties.map(function (_, name) {
    return getProperty(company, name);
  });
  dispatchImmediate(COMPANIES_UPDATE_STARTED, {
    id: id,
    properties: properties,
    nextProperties: nextProperties
  });
  return CompaniesAPI.updateCompanyProperties(company, nextProperties).then(function () {
    return dispatchImmediate(COMPANIES_UPDATE_SUCCEEDED, {
      id: id,
      properties: nextProperties,
      prevProperties: properties
    });
  }, function (error) {
    dispatchImmediate(COMPANIES_UPDATE_FAILED, {
      error: error,
      id: id,
      nextProperties: nextProperties,
      properties: properties
    });
    throw error;
  });
}
export function fetchByDomain(domain) {
  return CompaniesAPI.fetchByDomain(domain).then(function (companies) {
    dispatchImmediate(COMPANIES_FETCH_SUCCEEDED, companies);
    dispatchImmediate(COMPANY_DOMAIN_FOUND, {
      domain: domain,
      companies: companies
    });
  }, function () {
    return dispatchImmediate(COMPANY_DOMAIN_NOT_FOUND, {
      domain: domain
    });
  }).done();
}
export function removeDomain(subject, domain) {
  return CompaniesAPI.removeDomain(subject, domain).then(function () {
    return dispatchImmediate(COMPANY_DOMAIN_REMOVED, {
      domain: domain,
      company: subject
    });
  });
}