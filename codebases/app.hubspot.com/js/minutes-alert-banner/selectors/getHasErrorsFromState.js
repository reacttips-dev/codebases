'use es6';

import { createSelector } from 'reselect';
import { CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { getDeviceErrors } from '../../device-errors/selectors/getDeviceErrors';
import { getRecordError } from '../../record/selectors/getRecordState';
import { getInvalidPhoneNumberMessageFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getIsMicrophoneAccessDeniedFromState } from '../../microphone-access/selectors/getMicrophonePermissions';
import { getSelectedCallMethodFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
export var getHasErrorsFromState = createSelector([getDeviceErrors, getRecordError, getInvalidPhoneNumberMessageFromState, getIsMicrophoneAccessDeniedFromState, getSelectedCallMethodFromState], function (deviceErrors, recordErrors, invalidPhoneNumberMessage, isMicrophoneAccessDenied, selectedCallMethod) {
  var isMicrophoneError = selectedCallMethod === CALL_FROM_BROWSER && isMicrophoneAccessDenied;
  return !!(deviceErrors || recordErrors || invalidPhoneNumberMessage || isMicrophoneError);
});