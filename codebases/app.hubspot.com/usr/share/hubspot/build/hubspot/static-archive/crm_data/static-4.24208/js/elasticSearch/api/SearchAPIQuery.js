'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _QUERY_MAP;

import DealsSearchAPIQuery from 'crm_data/deals/api/DealsSearchAPIQuery';
import EngagementsSearchAPIQuery from 'crm_data/engagements/api/EngagementsSearchAPIQuery';
import TasksSearchAPIQuery from 'crm_data/tasks/TasksSearchAPIQuery';
import TicketsSearchAPIQuery from 'crm_data/tickets/api/TicketsSearchAPIQuery';
import * as ContactsSearchAPIQuery from 'crm_data/contacts/api/ContactsSearchAPIQuery';
import CompaniesSearchAPIQuery from 'crm_data/companies/api/CompaniesSearchAPIQuery';
import VisitsSearchAPIQuery from 'crm_data/visits/VisitsSearchAPIQuery';
import { CONTACT, COMPANY, DEAL, ENGAGEMENT, TASK, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import CrmObjectSearchAPIQuery from 'crm_data/crmObjects/CrmObjectSearchAPIQuery';
var QUERY_MAP = (_QUERY_MAP = {}, _defineProperty(_QUERY_MAP, CONTACT, ContactsSearchAPIQuery), _defineProperty(_QUERY_MAP, COMPANY, CompaniesSearchAPIQuery), _defineProperty(_QUERY_MAP, DEAL, DealsSearchAPIQuery), _defineProperty(_QUERY_MAP, ENGAGEMENT, EngagementsSearchAPIQuery), _defineProperty(_QUERY_MAP, TASK, TasksSearchAPIQuery), _defineProperty(_QUERY_MAP, TICKET, TicketsSearchAPIQuery), _defineProperty(_QUERY_MAP, VISIT, VisitsSearchAPIQuery), _QUERY_MAP);
var SearchAPIQuery = {
  default: function _default(query, objectType, isCrmObject) {
    var api = QUERY_MAP[objectType];

    if (api) {
      return api.defaultQuery ? api.defaultQuery(query) : api.default(query);
    }

    if (isCrmObject) {
      return CrmObjectSearchAPIQuery.default(objectType, query);
    }

    return undefined;
  }
};
export default SearchAPIQuery;