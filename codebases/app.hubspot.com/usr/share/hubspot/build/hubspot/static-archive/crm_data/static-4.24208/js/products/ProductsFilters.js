'use es6';

import { fromJS, Map as ImmutableMap, List } from 'immutable';
import { ECOMM_SYNCED, FOLDER_ID, ECOMM_STORE_ID, EXTERNAL_ACCOUNT_ID } from 'customer-data-objects/product/ProductProperties';
import ProductQuery from 'crm_data/products/ProductQuery';
var PRODUCT_TYPE = 1;
var FOLDER_TYPE = 2;
/**
 * @deprecated use hubSpotSourceFilter instead
 */

export var hubSpotProductsFilter = fromJS([{
  operator: 'NOT_HAS_PROPERTY',
  property: ECOMM_SYNCED
}]);
export var hubSpotSourceFilter = fromJS([{
  operator: 'NOT_HAS_PROPERTY',
  property: EXTERNAL_ACCOUNT_ID
}]);
/**
 * @deprecated use getExternalAccountIdFilter instead
 */

export function getEcommStoreIdFilter(storeId) {
  return fromJS([{
    operator: 'EQ',
    property: ECOMM_STORE_ID,
    value: storeId
  }]);
}
export function getExternalAccountIdFilter(accountId) {
  return fromJS([{
    operator: 'EQ',
    property: EXTERNAL_ACCOUNT_ID,
    value: accountId
  }]);
}
export var productsAndFoldersFilter = fromJS([{
  operator: 'IN',
  property: 'type',
  values: [PRODUCT_TYPE, FOLDER_TYPE]
}]);
export function getFolderIdFilter(folderId) {
  if (folderId === null || folderId === undefined) {
    return fromJS([{
      operator: 'NOT_HAS_PROPERTY',
      property: FOLDER_ID
    }]);
  }

  return fromJS([{
    operator: 'EQ',
    property: FOLDER_ID,
    value: String(folderId)
  }]);
}
export var indexPageFilter = productsAndFoldersFilter.concat(getFolderIdFilter(null));
export function removeFilters(contactSearchQuery, filtersToRemove) {
  // Remove 'filtersToRemove' from all filterGroups in the contact search query
  return contactSearchQuery.update('filterGroups', function (filterGroups) {
    return filterGroups.reduce(function (acc, filterGroup) {
      var updatedFilterGroup = filterGroup.update('filters', function (queryFilters) {
        return queryFilters.filterNot(function (filter) {
          return filtersToRemove.includes(filter);
        });
      });
      return updatedFilterGroup.get('filters').isEmpty() ? acc : acc.push(updatedFilterGroup);
    }, List());
  });
}
export function removeFiltersByProperty(contactSearchQuery, propertiesToRemove) {
  return contactSearchQuery.update('filterGroups', function (filterGroups) {
    return filterGroups.reduce(function (acc, filterGroup) {
      var updatedFilterGroup = filterGroup.update('filters', function (queryFilters) {
        return queryFilters.filterNot(function (filter) {
          return typeof propertiesToRemove === 'string' ? filter.get('property') === propertiesToRemove : propertiesToRemove.includes(filter.get('property'));
        });
      });
      return updatedFilterGroup.get('filters').isEmpty() ? acc : acc.push(updatedFilterGroup);
    }, List());
  });
}
export function addUniqueFilters(contactSearchQuery, filtersToAdd) {
  // Add 'filtersToAdd' to all filterGroups in the contact search query
  return removeFilters(contactSearchQuery, filtersToAdd).update('filterGroups', function (filterGroups) {
    return filterGroups.isEmpty() ? filterGroups.push(ImmutableMap({
      filters: filtersToAdd
    })) : filterGroups.map(function (filterGroup) {
      return filterGroup.update('filters', function (queryFilters) {
        return queryFilters.concat(filtersToAdd);
      });
    });
  });
}
export function getPageLoadQuery(currentFolder) {
  var filtersToAdd = currentFolder ? getFolderIdFilter(currentFolder.folderId) : indexPageFilter;
  return addUniqueFilters(new ProductQuery(), filtersToAdd);
}