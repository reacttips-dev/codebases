'use es6';

import { OrderedMap } from 'immutable';
import { createAction } from 'redux-actions';
import getIn from 'transmute/getIn';
import { CalleesRecord, CallableObject, AssociatedObjectType } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import { fetchCalleesClient, searchForContactCallees, fetchSingleCalleeClient } from 'calling-lifecycle-internal/callees/clients/calleesClient';
import { createAsyncAction } from 'conversations-async-data/async-action/createAsyncAction';
import { SET_SEARCH_TEXT, FETCH_CALLEES, SEARCH_CALLEES, CLEAR_CALLEES_SEARCH, ADD_CALLEE, CLEAR_CALLEES, REMOVE_CALLEE } from '../constants/calleesActionTypes';
import { getObjectTypeIdFromState, getSubjectIdFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getCallableObject } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { getCalleesDataFromState } from '../selectors/calleesSelectors';
export var fetchCallees = createAsyncAction({
  actionTypes: FETCH_CALLEES,
  requestFn: fetchCalleesClient,
  toRecordFn: function toRecordFn(data) {
    return new CalleesRecord(data);
  }
});
var searchCalleesAsyncAction = createAsyncAction({
  actionTypes: SEARCH_CALLEES,
  requestFn: searchForContactCallees,
  toRecordFn: function toRecordFn(data) {
    var associatedObjectPage = getIn(['callableObjectAndAssociations', 'associatedObjectsPage'], data) || [];
    var associatedObjectTypes = associatedObjectPage.reduce(function (orderedMap, associatedObjectType) {
      return orderedMap.set(associatedObjectType.objectTypeId, new AssociatedObjectType(associatedObjectType));
    }, OrderedMap());
    return associatedObjectTypes;
  }
});
export var searchCallees = function searchCallees(_ref) {
  var query = _ref.query;
  return function (dispatch, getState) {
    var subjectId = getSubjectIdFromState(getState());
    var objectTypeId = getObjectTypeIdFromState(getState());
    return dispatch(searchCalleesAsyncAction({
      objectId: subjectId,
      objectTypeId: objectTypeId,
      query: query
    }));
  };
};
export var clearCalleesSearch = createAction(CLEAR_CALLEES_SEARCH);
export var clearCallees = createAction(CLEAR_CALLEES);
export var addCallee = createAction(ADD_CALLEE);
export var removeCallee = createAction(REMOVE_CALLEE);
export var setSearchText = createAction(SET_SEARCH_TEXT);
export var disassociateCallee = function disassociateCallee(_ref2) {
  var associationObjectId = _ref2.associationObjectId,
      associationObjectTypeId = _ref2.associationObjectTypeId;
  return function (dispatch) {
    dispatch(removeCallee({
      associationObjectId: associationObjectId,
      associationObjectTypeId: associationObjectTypeId
    }));
  };
};
export var fetchCalleeIfNeeded = function fetchCalleeIfNeeded(_ref3) {
  var objectTypeId = _ref3.objectTypeId,
      objectId = _ref3.objectId;
  return function (dispatch, getState) {
    var calleesData = getCalleesDataFromState(getState());
    var existingObject = getCallableObject({
      // Our data is a number but this could come from an external update
      objectId: Number(objectId),
      objectTypeId: objectTypeId
    }, calleesData);

    if (!existingObject) {
      fetchSingleCalleeClient({
        objectId: objectId,
        objectTypeId: objectTypeId
      }).then(function (data) {
        var callableObject = new CallableObject(data);
        dispatch(addCallee({
          callee: callableObject
        }));
      });
    }
  };
};