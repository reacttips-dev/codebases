'use es6';

import I18n from 'I18n';
var defaultTimezone = 'US/Eastern';
export default (function (portalTimezone) {
  var timezoneName = portalTimezone || I18n.moment.tz.guess() || defaultTimezone;
  return timezoneName;
});