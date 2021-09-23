'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import { stringify } from 'hub-http/helpers/params';
import { COMPANY, CONTACT, DEAL, ENGAGEMENT, TASK, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import DealRecord from 'customer-data-objects/deal/DealRecord';
import EngagementRecord from 'customer-data-objects/engagement/EngagementRecord';
import TicketRecord from 'customer-data-objects/ticket/TicketRecord';
import VisitRecord from 'customer-data-objects/visit/VisitRecord';
import { updateCompanies } from 'crm_data/companies/CompaniesActions';
import { updateContacts } from 'crm_data/contacts/ContactsActions';
import { isEligible } from 'crm_data/crmSearch/isEligible';
import { updateDeals } from 'crm_data/deals/DealsActions';
import { updateEngagements } from 'crm_data/engagements/EngagementsActions';
import { updateTickets } from 'crm_data/tickets/TicketsActions';
import { updateCompanies as updateCompaniesForVisits } from 'crm_data/visits/VisitsActions';
import { getQueryParamStr } from 'crm_data/contacts/api/ContactsExtraParams';
import { isObjectTypeId } from 'customer-data-objects/constants/ObjectTypeIds';
import { updateCrmObjects } from 'crm_data/crmObjects/CrmObjectActions';
import CrmObjectRecord from 'customer-data-objects/crmObject/CrmObjectRecord';
var CRM_SEARCH_BASE = 'sales-views/v2/crm-search/with-placeholders';
var SEARCH_API_BASE = 'contacts/search/v1/search/';
var API_INFO = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, CONTACT, {
  updateStore: updateContacts,
  Record: ContactRecord,
  dataKey: 'contacts'
}), _defineProperty(_ImmutableMap, COMPANY, {
  updateStore: updateCompanies,
  Record: CompanyRecord,
  dataKey: 'companies'
}), _defineProperty(_ImmutableMap, DEAL, {
  updateStore: updateDeals,
  Record: DealRecord,
  dataKey: 'deals'
}), _defineProperty(_ImmutableMap, ENGAGEMENT, {
  updateStore: updateEngagements,
  Record: EngagementRecord,
  dataKey: 'engagements'
}), _defineProperty(_ImmutableMap, TASK, {
  updateStore: updateEngagements,
  Record: EngagementRecord,
  dataKey: 'engagements'
}), _defineProperty(_ImmutableMap, TICKET, {
  updateStore: updateTickets,
  Record: TicketRecord,
  dataKey: 'results'
}), _defineProperty(_ImmutableMap, VISIT, {
  updateStore: updateCompaniesForVisits,
  Record: VisitRecord,
  dataKey: 'results'
}), _ImmutableMap));

var buildUrl = function buildUrl(url) {
  for (var _len = arguments.length, rawParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rawParams[_key - 1] = arguments[_key];
  }

  var params = rawParams.filter(function (p) {
    return !!p;
  });
  return params.length ? url + "?" + params.join('&') : url;
};

var getApiUrls = memoize(function () {
  var _ImmutableMap2;

  var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return ImmutableMap((_ImmutableMap2 = {}, _defineProperty(_ImmutableMap2, CONTACT, buildUrl(SEARCH_API_BASE + "contacts", getQueryParamStr(), queryString)), _defineProperty(_ImmutableMap2, COMPANY, buildUrl(SEARCH_API_BASE + "companies/v2", queryString)), _defineProperty(_ImmutableMap2, DEAL, buildUrl(SEARCH_API_BASE + "deals", queryString)), _defineProperty(_ImmutableMap2, ENGAGEMENT, SEARCH_API_BASE + "engagements"), _defineProperty(_ImmutableMap2, TASK, SEARCH_API_BASE + "engagements"), _defineProperty(_ImmutableMap2, TICKET, SEARCH_API_BASE + "services/tickets?includeAllValues=true&allPropertiesFetchMode=latest_version"), _defineProperty(_ImmutableMap2, VISIT, 'companyprospects/v1/prospects/search'), _ImmutableMap2));
});
export function elasticSearchApiInfo(objectType) {
  if (isObjectTypeId(objectType)) {
    return {
      updateStore: updateCrmObjects,
      Record: CrmObjectRecord,
      dataKey: 'results'
    };
  }

  var info = API_INFO.get(objectType);

  if (isEligible(objectType)) {
    return Object.assign({}, info, {
      dataKey: 'results'
    });
  }

  return info;
}
export function elasticSearchApiUrl(objectType, queryParams) {
  if (isObjectTypeId(objectType) || isEligible(objectType)) {
    var queryString = stringify(queryParams);
    return "" + CRM_SEARCH_BASE + (queryString ? "?" + queryString : '');
  }

  return getApiUrls(stringify(queryParams)).get(objectType);
}