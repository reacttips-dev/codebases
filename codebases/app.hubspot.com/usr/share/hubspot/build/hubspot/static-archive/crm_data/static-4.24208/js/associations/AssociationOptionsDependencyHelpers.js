'use es6';

import { getObjectType, getId, toStringExpanded } from 'customer-data-objects/model/ImmutableModel';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import CompaniesStore from 'crm_data/companies/CompaniesStore';
import DealsStore from 'crm_data/deals/DealsStore';
import ElasticSearchStore from 'crm_data/elasticSearch/ElasticSearchStore';
import TicketsStore from 'crm_data/tickets/TicketsStore';
import AssociationsStore from 'crm_data/associations/AssociationsStore';
import { LOADING } from 'crm_data/constants/LoadingStatus';
import { isOfMinSearchLength } from 'crm_data/elasticSearch/ElasticSearchValidation';
import { MIN_SEARCH_LENGTH } from 'customer-data-objects/search/ElasticSearchConstants';
import { List } from 'immutable';
import identity from 'transmute/identity';
var getStoreForObjectType = {
  CONTACT: ContactsStore,
  COMPANY: CompaniesStore,
  DEAL: DealsStore,
  TICKET: TicketsStore
};
var getApiResultsKeyForElasticSearch = {
  CONTACT: 'contacts',
  DEAL: 'deals',
  COMPANY: 'companies',
  TICKET: 'results'
};
var ELASTIC_SEARCH_OPTIONS = {
  cacheTimeout: 30000
}; // These functions make calls to various stores
// DO NOT USE THESE FUNCTIONS OUTSIDE OF A DEREF

export function parseMatches(matches) {
  return matches.filter(identity).map(function (match) {
    var id = getId(match);
    var objectType = getObjectType(match);
    return {
      id: id,
      objectType: objectType,
      record: match,
      text: toStringExpanded(match),
      value: objectType + " " + id
    };
  }).sortBy(function (match) {
    return match.text.toLowerCase();
  }).toArray();
}
export function hasMinimumSearchText(searchText) {
  var minimumSearchCount = isOfMinSearchLength(searchText) ? 0 : MIN_SEARCH_LENGTH;
  return searchText.length >= minimumSearchCount;
}
export function getAssociatedRecordsFromIds(ids, objectType) {
  if (!ids || !ids.size) {
    return [];
  }

  var store = getStoreForObjectType[objectType];
  var records = store.get(ids).filterNot(function (record) {
    return !record;
  });

  if (!records || !records.size) {
    return LOADING;
  }

  return parseMatches(records);
}
export function getIdsFromOptions(values, type) {
  if (!values || !values[type] || !values[type].length) {
    return List();
  }

  var ids = values[type].map(function (value) {
    return Number(value.split(' ')[1]);
  });
  return List(ids);
}
export function getAssociationsFromElasticSearch(subjectId, searchQuery, objectType) {
  var resultsKey = getApiResultsKeyForElasticSearch[objectType];
  var associatedIds = ElasticSearchStore.get({
    objectType: objectType,
    searchQuery: searchQuery,
    options: ELASTIC_SEARCH_OPTIONS
  });

  if (!associatedIds) {
    return LOADING;
  }

  var records = associatedIds.get(resultsKey);
  return getAssociatedRecordsFromIds(records, objectType);
}
export function getAssociationsFromAssociationsStore(objectType, subjectId, associationType, filterType) {
  // A new/unsaved object with no id by definition has no associations
  if (!subjectId || subjectId === 'null') {
    return [];
  }

  var associatedIds = AssociationsStore.get({
    objectType: objectType,
    objectId: subjectId,
    associationType: associationType
  });

  if (!associatedIds) {
    return LOADING;
  }

  var records = associatedIds.get('results');
  return getAssociatedRecordsFromIds(records, filterType);
}