'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap } from 'immutable';
import { defineLazyValueStore } from 'crm_data/store/LazyValueStore';
import { get as _fetch } from 'crm_data/api/ImmutableAPI';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import { COMPANY, CONTACT, DEAL, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
var collectionTypesByObjectType = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, COMPANY, 'companies'), _defineProperty(_ImmutableMap, CONTACT, 'contacts'), _defineProperty(_ImmutableMap, DEAL, 'deals'), _defineProperty(_ImmutableMap, TICKET, 'tickets'), _defineProperty(_ImmutableMap, VISIT, 'visits'), _ImmutableMap));
export default defineLazyValueStore({
  fetch: function fetch() {
    return _fetch('sales/v2/settings/views/counts');
  },
  namespace: 'VIEWS_LIMITS',
  idIsValid: function idIsValid(key) {
    return key && collectionTypesByObjectType.has(key);
  },
  responseTransform: function responseTransform(response) {
    return collectionTypesByObjectType.map(function (collectionType) {
      return ImmutableMap({
        count: getIn(['viewCountPerCollectionType', collectionType], response) || 0,
        limit: get('perCollectionViewLimit', response)
      });
    });
  }
}).defineName('ViewsLimitsStore').register(dispatcher);