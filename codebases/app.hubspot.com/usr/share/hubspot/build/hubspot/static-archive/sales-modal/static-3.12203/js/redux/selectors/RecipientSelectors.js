'use es6';

import { List } from 'immutable';
import { createSelector } from 'reselect';

var getSalesModalInterface = function getSalesModalInterface(state) {
  return state.salesModalInterface;
};

export var getRecipientContactIds = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.contacts || List([salesModalInterface.recipient]);
});