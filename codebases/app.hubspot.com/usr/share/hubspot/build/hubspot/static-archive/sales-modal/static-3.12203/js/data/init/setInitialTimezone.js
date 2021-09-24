'use es6';

import * as localSettings from 'sales-modal/lib/localSettings';
import * as LocalStorageKeys from 'sales-modal/constants/LocalStorageKeys';
import getTimezoneName from 'sales-modal/utils/enrollModal/getTimezoneName';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      portalTimezone = _ref.portalTimezone;

  if (sequenceEnrollment.timezone) {
    return sequenceEnrollment.setIn(['sequenceSettings', 'timeZone'], sequenceEnrollment.timezone);
  }

  var timezone = localSettings.get(LocalStorageKeys.TIMEZONE_SELECTION) || getTimezoneName(portalTimezone);
  return sequenceEnrollment.withMutations(function (_sequenceEnrollment) {
    return _sequenceEnrollment.set('timezone', timezone).setIn(['sequenceSettings', 'timeZone'], timezone);
  });
}