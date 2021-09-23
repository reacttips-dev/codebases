'use es6';

import { COMPANY_DOMAIN_FOUND, COMPANY_DOMAIN_NOT_FOUND, COMPANY_CREATED } from 'crm_data/actions/ActionTypes';
import { fetchByDomain } from 'crm_data/companies/CompaniesActions';
import { defineFactory } from 'general-store';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
var EXPIRE_TIMEOUT = 30000;
var EMPTY_MAP = ImmutableMap();
var fetched = ImmutableSet();
var expireTime = ImmutableMap();
export default defineFactory().defineName('CompaniesDomainStore').defineGetInitialState(function () {
  return ImmutableMap();
}).defineGet(function (state, domain) {
  if (!fetched.has(domain) && (expireTime.has(domain) && expireTime.get(domain) + EXPIRE_TIMEOUT < Date.now() || !state.has(domain))) {
    fetched = fetched.add(domain);
    fetchByDomain(domain);
  }

  return state.get(domain);
}).defineResponseTo([COMPANY_DOMAIN_FOUND, COMPANY_DOMAIN_NOT_FOUND], function (state, _ref) {
  var domain = _ref.domain,
      companies = _ref.companies;
  var now = Date.now();
  fetched = fetched.remove(domain);
  expireTime = expireTime.set(domain, now);
  return state.set(domain, companies || EMPTY_MAP);
}).defineResponseTo(COMPANY_CREATED, function (state, company) {
  var domain = company.properties.getIn(['domain', 'value']);
  var now = Date.now();
  fetched = fetched.remove(domain);
  expireTime = expireTime.set(domain, now);
  return state.update(domain, function () {
    var matches = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EMPTY_MAP;
    return matches.set(company.companyId, company);
  });
}).register();