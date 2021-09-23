'use es6';

import { fromJS } from 'immutable';
import { batchFetchByDomain } from 'crm_data/companies/api/CompaniesAPI';
import { byDomains } from 'crm_data/companies/api/CompaniesAPIQuery';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import { PROSPECT_ADD_SUCCESS } from '../../prospects/ProspectsActionTypes';
var PREFIX = 'COMPANIES_EXIST';
registerPooledObjectService({
  actionTypePrefix: PREFIX,
  fetcher: function fetcher() {
    return batchFetchByDomain(byDomains.apply(void 0, arguments));
  }
});
var CompaniesExistStore = definePooledObjectStore({
  actionTypePrefix: PREFIX
}).defineResponseTo(PROSPECT_ADD_SUCCESS, function (state, _ref) {
  var domain = _ref.domain,
      company = _ref.company;
  var companyId = company.get('companyId');
  return state.set(domain, fromJS({
    domain: domain,
    primaryCompanyIds: [companyId],
    allAssociatedCompanyIds: [companyId]
  }));
}).register();
export default CompaniesExistStore;