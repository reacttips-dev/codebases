'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { fromJS, Map as ImmutableMap } from 'immutable';
import User from 'hub-http-shims/UserDataJS/user';
import { CONTACTS, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { PROSPECTS } from 'customer-data-objects/property/PropertySourceIds';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import { POST, PUT } from 'crm_data/constants/HTTPVerbs';
import { del, get, post, put, send } from 'crm_data/api/ImmutableAPI';
import * as sharedApi from 'crm_data/inboundDB/sharedAPI';
import { byIds } from './CompaniesAPIQuery';
var BASE_URI = 'companies/v2/companies';
var BASE_URI_V3 = 'companies/v3/companies';
var BASE_DOMAIN_URI = 'companies/v2/domains';
var BATCH_API = BASE_URI + "/batch";
var BATCH_DOMAIN_API = BASE_DOMAIN_URI + "/batch";
var BACKFILL_API = BASE_URI + "/backfill";
var contactsCrmUiSourceHeaders = {
  'X-Properties-Source': CONTACTS,
  'X-Properties-SourceId': CRM_UI
};
var contactsProspectsSourceHeaders = {
  'X-Properties-Source': CONTACTS,
  'X-Properties-SourceId': PROSPECTS
};
export function createCompany(payload) {
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: POST
  }, BASE_URI, {
    properties: payload
  }, function (result) {
    return ImmutableMap().set(result.companyId, CompanyRecord.fromJS(result));
  });
}
export function createCompanyFromProspect(name, domain, ownerId) {
  var sourceId = User.get().get('email');
  var properties = [{
    name: 'name',
    source: CRM_UI,
    sourceId: sourceId,
    value: name
  }, {
    name: 'domain',
    source: CRM_UI,
    sourceId: sourceId,
    value: domain
  }];

  if (ownerId !== -1) {
    properties.push({
      name: 'hubspot_owner_id',
      source: CRM_UI,
      sourceId: sourceId,
      value: ownerId
    });
  }

  return send({
    headers: contactsProspectsSourceHeaders,
    type: POST
  }, BASE_URI, {
    properties: properties
  }, function (result) {
    return CompanyRecord.fromJS(result);
  });
}
export function deleteCompany(companyId) {
  return sharedApi.del(BASE_URI + "/" + companyId);
}

var parseCompanies = function parseCompanies(result) {
  return result.reduce(function (coll, val, key) {
    return coll.set(key, CompanyRecord.fromJS(val));
  }, ImmutableMap());
};

export function fetch(ids) {
  return get(BATCH_API, byIds(ids)).then(parseCompanies);
}
export function fetchById(id) {
  return get(BASE_URI_V3 + "/" + id).then(function (result) {
    // companies v3 returns ID as objectId rather than companyId
    // this converts the id to match the standard in CompanyRecord
    var _result$toJS = result.toJS(),
        objectId = _result$toJS.objectId,
        company = _objectWithoutProperties(_result$toJS, ["objectId"]);

    return CompanyRecord.fromJS(Object.assign({
      companyId: objectId
    }, company));
  });
}
export function update(companyUpdate) {
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: PUT
  }, BASE_URI + "/" + companyUpdate.get('companyId'), companyUpdate);
}
export function updateCompanyProperties(company, propertyUpdates) {
  var companyId = company.get('companyId');
  return send({
    headers: contactsCrmUiSourceHeaders,
    type: PUT
  }, BASE_URI + "/" + companyId, {
    companyId: companyId,
    properties: propertyUpdates.reduce(function (acc, value, name) {
      acc.push({
        name: name,
        value: value,
        source: CRM_UI,
        sourceId: User.get().get('email')
      });
      return acc;
    }, [])
  });
}
export function fetchByDomain(domain, limit, offset) {
  if (limit == null) {
    limit = 5;
  }

  if (offset == null) {
    offset = {
      companyId: null,
      isPrimary: true
    };
  }

  var options = {
    requestOptions: {
      properties: ['name', 'domain', 'hubspot_owner_id', 'hubspot_team_id']
    },
    limit: limit,
    offset: offset
  };
  return post(BASE_DOMAIN_URI + "/" + encodeURIComponent(domain) + "/companies", options).then(function (res) {
    var companies = res.get('results');
    var results = companies.reduce(function (map, company) {
      return map = map.set(company.get('companyId'), CompanyRecord.fromJS(company));
    }, ImmutableMap());
    return res.set('results', results);
  });
}
export function batchFetchByDomain(query) {
  return get(BATCH_DOMAIN_API, query, fromJS);
}
export function backfillCompanies() {
  return put(BACKFILL_API);
}
export function removeDomain(subject, domain) {
  var companyId = subject.get('companyId');
  return del(BASE_URI + "/" + companyId + "/domains/" + encodeURIComponent(domain));
}