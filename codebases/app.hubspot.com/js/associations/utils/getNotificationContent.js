'use es6';

import I18n from 'I18n';
export var getNotificationContent = function getNotificationContent(_ref) {
  var count = _ref.count,
      _ref$isLimitMessage = _ref.isLimitMessage,
      isLimitMessage = _ref$isLimitMessage === void 0 ? false : _ref$isLimitMessage;
  var baseLangKey = "calling-associations.errors." + (isLimitMessage ? 'associationsLimit' : 'generic');
  return {
    message: I18n.text(baseLangKey + ".message", {
      count: count
    }),
    titleText: I18n.text(baseLangKey + ".title", {
      count: count
    }),
    notificationType: 'danger'
  };
};