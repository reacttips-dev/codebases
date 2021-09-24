'use es6';

import { fromJS } from 'immutable';
import { INIT, TOGGLE_SKIP_FORM, SELECT_ITEM, RESET_MODAL } from '../actionTypes';
import { SEQUENCES } from 'sales-modal/constants/SalesModalTabs';
var initialState = fromJS({
  currentTab: SEQUENCES,
  isLoading: false,
  docSkipForm: false
});

var uiReducer = function uiReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case INIT:
      return state.merge({
        currentTab: action.payload.tab || SEQUENCES
      });

    case TOGGLE_SKIP_FORM:
      return state.update('docSkipForm', function (docSkipForm) {
        return !docSkipForm;
      });

    case SELECT_ITEM:
      return state.set('isLoading', true);

    case RESET_MODAL:
      return state.merge({
        currentTab: action.payload.currentTab,
        isLoading: false
      });

    default:
      return state;
  }
};

export default uiReducer;