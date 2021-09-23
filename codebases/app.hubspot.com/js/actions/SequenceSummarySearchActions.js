'use es6';

import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import { SEQUENCE_SUMMARY_SEARCH_UPDATE_QUERY } from '../constants/SequenceSummarySearchActionTypes';
var searchUpdateQuery = createAction(SEQUENCE_SUMMARY_SEARCH_UPDATE_QUERY, identity);
export var updateQuery = function updateQuery(query) {
  return function (dispatch) {
    dispatch(searchUpdateQuery(query));
  };
};