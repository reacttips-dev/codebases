'use es6';

import InitialLoadSettings from 'calling-internal-common/initial-load-settings/record/InitialLoadSettings';
import { logCallingError } from 'calling-error-reporting/report/error';

var buildInitialLoadSettings = function buildInitialLoadSettings(rawInitialLoadSettings) {
  try {
    return InitialLoadSettings.fromJS(rawInitialLoadSettings);
  } catch (e) {
    logCallingError({
      errorMessage: 'Error Parsing data from initialLoadSettings',
      extraData: {
        error: e,
        api: '/twilio/v1/settings/initialLoadSettings'
      }
    });
    return null;
  }
};

export default buildInitialLoadSettings;