'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import { fetchCurrentOwner } from 'SequencesUI/api/TaskQueuesApi';
import * as SequenceEditorActionTypes from 'SequencesUI/constants/SequenceEditorActionTypes';
export var fetchOwnerIdStarted = createAction(SequenceEditorActionTypes.OWNER_ID_FETCH_STARTED, identity);
export var fetchOwnerIdSucceeded = createAction(SequenceEditorActionTypes.OWNER_ID_FETCH_SUCCEEDED, identity);
export var fetchOwnerIdFailed = createAction(SequenceEditorActionTypes.OWNER_ID_FETCH_FAILED, identity);
export var fetchTaskQueuesOwnerId = function fetchTaskQueuesOwnerId() {
  return function (dispatch) {
    dispatch(fetchOwnerIdStarted());
    return fetchCurrentOwner().then(function (ownerId) {
      dispatch(fetchOwnerIdSucceeded(ownerId));
      return ownerId;
    }, function () {
      dispatch(fetchOwnerIdFailed());
      return null;
    });
  };
};