'use es6';

import { Dispatcher } from 'flux';
var VIEW_ACTION = 'VIEW_ACTION';
var dispatcher = new Dispatcher();

dispatcher.handleViewAction = function handleViewAction(action) {
  this.dispatch({
    source: VIEW_ACTION,
    action: action,
    // ensures that `handleViewAction` actions are compatible with GeneralStore
    actionType: action.actionType || ''
  });
};

export default dispatcher;