'use es6';

import { GRID_VIEW_SELECTION_EDITABLE_COUNT } from 'crm_data/actions/ActionNamespaces';
import { Map as ImmutableMap, fromJS } from 'immutable';
import { defineLazyKeyStore, registerLazyKeyService } from 'crm_data/store/LazyKeyStore';
import { searchEditable } from 'crm_data/elasticSearch/api/ElasticSearchAPI';
import dispatcher from 'dispatcher/dispatcher';
import makeBatch from 'crm_data/api/makeBatch';
import get from 'transmute/get';
import has from 'transmute/has';

var fetch = function fetch(key) {
  var objectType = get('objectType', key);
  var searchQuery = fromJS({
    count: 0,
    filterGroups: [{
      filters: get('filters', key)
    }],
    offset: 0,
    objectTypeId: objectType
  });
  return searchEditable(objectType, searchQuery).then(get('total'));
};

registerLazyKeyService({
  fetch: makeBatch(fetch),
  namespace: GRID_VIEW_SELECTION_EDITABLE_COUNT
});
export default defineLazyKeyStore({
  idIsValid: function idIsValid(key) {
    return ImmutableMap.isMap(key) && has('objectType', key) && has('filters', key);
  },
  namespace: GRID_VIEW_SELECTION_EDITABLE_COUNT
}).defineName('GridViewSelectionEditableCountStore').register(dispatcher);