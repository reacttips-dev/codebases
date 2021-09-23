'use es6';

import { createSelector } from 'reselect';
import { getAvailabilityOfficeHoursWillReturnMessage } from '../../availability/selectors/getAvailabilityOfficeHoursWillReturnMessage';
var getShouldShowOfficeHoursEmailCaptureMessage = createSelector([getAvailabilityOfficeHoursWillReturnMessage], function (officeHoursMessage) {
  return !!officeHoursMessage;
});
export default getShouldShowOfficeHoursEmailCaptureMessage;