'use es6';

import dispatcher from 'dispatcher/dispatcher';
import { DispatcherInstance } from 'general-store';

var GeneralStoreSetup = function GeneralStoreSetup() {
  // DIRTY ROTTEN HACK
  // the payload dispatched by handleViewAction v1 doesn't validate
  // in GeneralStore because it doesn't have an actionType
  // until the format gets sorted out, this should protect us
  // TODO colby: remove this
  dispatcher.handleViewAction = function (action) {
    return this.dispatch({
      source: 'VIEW_ACTION',
      action: action,
      actionType: action.actionType || ''
    });
  }; // set the global dispatcher instance so we don't pass a
  // dispatcher to every register


  DispatcherInstance.set(dispatcher);
};

export default GeneralStoreSetup;