'use es6';

import partial from 'transmute/partial';
import { CONTACT, COMPANY, DEAL, TICKET, ENGAGEMENT, TASK } from 'customer-data-objects/constants/ObjectTypes';
import { getSearchResultsHandler, search, searchEditable } from 'crm_data/elasticSearch/api/ElasticSearchAPIInternals';
var parse = getSearchResultsHandler;
var searchContacts = partial(search, CONTACT);
var searchCompanies = partial(search, COMPANY);
var searchDeals = partial(search, DEAL);
var searchTickets = partial(search, TICKET);
var searchEngagements = partial(search, ENGAGEMENT);
var searchTasks = partial(search, TASK); // allow `search` and `searchEditable` exports to be spied. imports are immutable in babel 7

var searchLocal = search;
var searchEditableLocal = searchEditable;
export { parse, searchLocal as search, searchEditableLocal as searchEditable, searchCompanies, searchContacts, searchDeals, searchTickets, searchEngagements, searchTasks };