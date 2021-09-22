import { errorCodes } from 'bundles/compound-assessments/constants';
import { StepState as StepStateType } from 'bundles/compound-assessments/components/local-state/step-state/types';

// this file is well tested in bundles/compound-assessments/components/api/__tests__/TaskActions.js
const handleNetworkError = (error: $TSFixMe, setStepState: $TSFixMe) => {
  const errorState: StepStateType = {
    isSubmitting: false,
    isSaving: false,
    isAutoSaving: false,
    errorCode: errorCodes.OFFLINE,
  };

  if (error && error.networkError) {
    if (error.networkError.statusCode === 403) {
      errorState.errorCode = errorCodes.AUTH;
    } else if (error.networkError.statusCode === 400) {
      errorState.errorCode = errorCodes.BAD_REQUEST;
    } else if (Math.floor(parseInt(error.networkError.statusCode, 10) / 100) === 5) {
      errorState.errorCode = errorCodes.SERVER_ERROR;
    }
  }

  setStepState(errorState);
  throw error;
};

export default handleNetworkError;
