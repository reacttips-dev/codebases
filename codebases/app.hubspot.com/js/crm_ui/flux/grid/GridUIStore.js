'use es6';

import * as ActionTypes from 'crm_data/actions/ActionTypes';
import * as ElasticSearchAPI from 'crm_data/elasticSearch/api/ElasticSearchAPI';
import { dispatch } from 'crm_data/flux/dispatch';
import ScopesContainer from '../../../containers/ScopesContainer';
import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { INDEX } from 'customer-data-objects/view/PageTypes';
import { define } from 'general-store';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { GRID_ALL_SELECTED, GRID_CHECKED, GRID_CLEANUP_SELECTED, GRID_NUMBER_EDITABLE_UPDATED, GRID_RESET, GRID_SAVED_FILTER_CHANGED, GRID_SEARCH_QUERY_UPDATED, GRID_SEARCH_UPDATED, GRID_SELECTED_CLEARED, GRID_SHOWING_CHANGED, GRID_TEMPORARY_EXCLUDE_IDS, GRID_TEMPORARY_INCLUDE_ID, GRID_TEMPORARY_RESET, GRID_TEMPORARY_SET, UPDATE_GRID_SEARCH_QUERIES } from './GridUIActionTypes';
import { updateUIState } from '../../grid/utils/gridStateLocalStorage';
var nullView = ImmutableMap({
  viewId: null,
  pageType: INDEX,
  query: ''
});

var _getInitialState = function _getInitialState() {
  return ImmutableMap({
    query: '',
    displayQuery: '',
    checked: ImmutableSet(),
    allSelected: false,
    numberEditable: 0,
    temporaryIds: ImmutableMap({
      include: ImmutableSet(),
      exclude: ImmutableSet()
    }),
    views: ImmutableMap({
      CONTACT: nullView,
      COMPANY: nullView,
      DEAL: nullView,
      TICKET: nullView
    })
  });
};

var _state = _getInitialState();

var _checkEditable = function _checkEditable(userAppliedFilters) {
  if (userAppliedFilters == null) {
    userAppliedFilters = [];
  }

  var objectType = _state.get('objectType');

  if (![CONTACT, COMPANY, DEAL, TICKET].includes(objectType)) {
    return;
  }

  var scopes = ScopesContainer.get();

  if (scopes['crm-view-all'] && scopes['crm-edit-all'] || scopes['crm-view-unassigned'] && scopes['crm-edit-unassigned']) {
    return;
  }

  if (_state.get('allSelected')) {
    var searchQuery = ImmutableMap({
      count: 0,
      offset: 0,
      filterGroups: [{
        filters: userAppliedFilters
      }],
      objectTypeId: objectType
    });
    ElasticSearchAPI.searchEditable(objectType, searchQuery).then(function (res) {
      return dispatch(GRID_NUMBER_EDITABLE_UPDATED, {
        numberEditable: res.get('total')
      });
    }).done();
  }
};

export default define().defineGet(function (key, id) {
  if (key === 'checked') {
    if (id) {
      return _state.get('allSelected') || _state.get('checked').has(id);
    } else {
      return _state.get('checked');
    }
  } else {
    return _state.get(key);
  }
}).defineResponseTo(GRID_NUMBER_EDITABLE_UPDATED, function (_ref) {
  var numberEditable = _ref.numberEditable;
  return _state = _state.set('numberEditable', numberEditable);
}).defineResponseTo(GRID_CHECKED, function (_ref2) {
  var ids = _ref2.ids,
      isChecked = _ref2.isChecked;

  var checked = _state.get('checked');

  if (isChecked) {
    checked = checked.union(ids);
  } else {
    checked = checked.subtract(ids);
  }

  return _state = _state.merge({
    checked: checked,
    allSelected: false
  });
}).defineResponseTo(GRID_ALL_SELECTED, function (_ref3) {
  var ids = _ref3.ids,
      filters = _ref3.filters;
  var newState = {
    allSelected: true
  };

  if (ids) {
    newState.checked = ids;
  }

  _state = _state.merge(newState);
  return _checkEditable(filters);
}).defineResponseTo( // This action merges the responses to GRID_SEARCH_UPDATED, GRID_SEARCH_QUERY_UPDATED, and GRID_RESET
// into one response that clears the store and sets both query and displayQuery. The three actions are
// only ever fired at the same time in the index route loader helpers, so this is logically identical.
UPDATE_GRID_SEARCH_QUERIES, function (_ref4) {
  var query = _ref4.query,
      objectTypeId = _ref4.objectTypeId;
  _state = _getInitialState().merge({
    query: query,
    displayQuery: query,
    objectType: objectTypeId,
    checked: ImmutableSet(),
    allSelected: false,
    numberEditable: 0
  });

  if (objectTypeId != null) {
    updateUIState({
      objectType: objectTypeId,
      key: 'query',
      value: query
    });
    return _state = _state.setIn(['views', objectTypeId, 'query'], query).setIn(['views', objectTypeId, 'displayQuery'], query);
  }

  return undefined;
}).defineResponseTo(GRID_SEARCH_UPDATED, function (_ref5) {
  var query = _ref5.query,
      objectType = _ref5.objectType;
  _state = _state.merge({
    query: query,
    checked: ImmutableSet(),
    allSelected: false,
    numberEditable: 0
  });

  if (objectType != null) {
    updateUIState({
      objectType: objectType,
      key: 'query',
      value: query
    });
    return _state = _state.setIn(['views', objectType, 'query'], query);
  }

  return undefined;
}).defineResponseTo(GRID_SEARCH_QUERY_UPDATED, function (_ref6) {
  var displayQuery = _ref6.displayQuery,
      objectType = _ref6.objectType;
  _state = _state.merge({
    displayQuery: displayQuery,
    checked: ImmutableSet(),
    allSelected: false,
    numberEditable: 0
  });

  if (objectType != null) {
    updateUIState({
      objectType: objectType,
      key: 'query',
      value: displayQuery
    });
    return _state = _state.setIn(['views', objectType, 'query'], displayQuery);
  }

  return undefined;
}).defineResponseTo(GRID_SELECTED_CLEARED, function () {
  return _state = _state.merge({
    checked: ImmutableSet(),
    allSelected: false,
    numberEditable: 0
  });
}).defineResponseTo(GRID_CLEANUP_SELECTED, function (ids) {
  _state = _state.update('checked', function (checked) {
    return checked.filter(function (id) {
      return ids.includes(id);
    });
  });
  return _state;
}).defineResponseTo(GRID_SHOWING_CHANGED, function (_ref7) {
  var ids = _ref7.ids;

  var currentChecked = _state.get('checked');

  _state = _state.set('checked', currentChecked.intersect(ids));
  return _checkEditable();
}).defineResponseTo(GRID_RESET, function (options) {
  if (options == null) {
    options = {};
  }

  options.query = _state.get('query');
  return _state = _getInitialState().merge(options);
}).defineResponseTo(GRID_TEMPORARY_INCLUDE_ID, function (id) {
  var currentIds = _state.getIn(['temporaryIds', 'include']);

  var updatedIds = ImmutableSet.of(id).concat(currentIds);
  return _state = _state.setIn(['temporaryIds', 'include'], updatedIds);
}).defineResponseTo([ActionTypes.CONTACT_CREATED], function (contact) {
  var vid = contact.get('vid');

  var currentIds = _state.getIn(['temporaryIds', 'include']);

  var updatedIds = ImmutableSet.of(vid).concat(currentIds);
  return _state = _state.setIn(['temporaryIds', 'include'], updatedIds);
}).defineResponseTo([ActionTypes.COMPANY_CREATED], function (company) {
  var companyId = company.get('companyId');

  var currentIds = _state.getIn(['temporaryIds', 'include']);

  var updatedIds = ImmutableSet.of(companyId).concat(currentIds);
  return _state = _state.setIn(['temporaryIds', 'include'], updatedIds);
}).defineResponseTo(GRID_TEMPORARY_EXCLUDE_IDS, function (ids) {
  var currentIds = _state.getIn(['temporaryIds', 'exclude']);

  _state = _state.setIn(['temporaryIds', 'exclude'], currentIds.union(ids));
  return _state;
}).defineResponseTo(GRID_TEMPORARY_RESET, function () {
  return _state = _state.setIn(['temporaryIds', 'include'], ImmutableSet());
}).defineResponseTo(GRID_TEMPORARY_SET, function (ids) {
  return _state = _state.set('temporaryIds', ids);
}).defineResponseTo(GRID_SAVED_FILTER_CHANGED, function (_ref8) {
  var viewId = _ref8.viewId,
      objectType = _ref8.objectType,
      pageType = _ref8.pageType;
  _state = _state.setIn(['views', objectType, 'viewId'], viewId);
  return _state = _state.setIn(['views', objectType, 'pageType'], pageType || INDEX);
}).register();