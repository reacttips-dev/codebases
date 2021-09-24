'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import { SET_TABLE_CONTENT_STATE } from 'SequencesUI/constants/UIActionTypes';
var setTableContentStateAction = createAction(SET_TABLE_CONTENT_STATE, identity);
export var updateTableContentState = function updateTableContentState(tableContentState) {
  return function (dispatch) {
    dispatch(setTableContentStateAction(tableContentState));
  };
};