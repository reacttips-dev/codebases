'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { CLEAR_FILTER, SET_FILTER } from '../actions/ActionTypes';
import FileExtensionFilters from '../enums/FileExtensionFilters';
var EMPTY_STATE = ImmutableMap({
  extensions: ImmutableSet(),
  reasons: ImmutableMap(),
  filterType: FileExtensionFilters.NONE
});
export default function Filter() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EMPTY_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      filter = action.filter;

  switch (type) {
    case SET_FILTER:
      return filter;

    case CLEAR_FILTER:
      return EMPTY_STATE;

    default:
      return state;
  }
}