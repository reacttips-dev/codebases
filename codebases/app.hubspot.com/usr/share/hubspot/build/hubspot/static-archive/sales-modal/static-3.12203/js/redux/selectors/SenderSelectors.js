'use es6';

import { createSelector } from 'reselect';

var getSalesModalInterface = function getSalesModalInterface(state) {
  return state.salesModalInterface;
};

var getSender = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.sender;
});
var getUser = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.user;
});
export var getFromAddress = createSelector([getSender, getUser], function (sender, user) {
  return sender && sender.fromAddress || user.get('email');
});
export var getInboxAddress = createSelector([getSender, getUser], function (sender, user) {
  return (sender && sender.inboxAddress || user.get('email')).toLowerCase();
});
export var getPlatform = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.platform;
});