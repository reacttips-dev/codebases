'use es6';

import { CLEAR_FILTER, SET_FILTER } from './ActionTypes';
export var setFilter = function setFilter(filter) {
  return {
    type: SET_FILTER,
    filter: filter
  };
};
export var clearFilter = function clearFilter() {
  return {
    type: CLEAR_FILTER
  };
};