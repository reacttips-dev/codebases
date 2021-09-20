import { useEffect, useState } from 'react';
import { featureFlagClient } from '@trello/feature-flag-client';

export enum ExperimentVariations {
  CONTROL = 'control',
  NOT_ENROLLED = 'not-enrolled',
  EXPERIMENT = 'experiment',
}

export const REQUEST_ACCESS_EXPERIMENT_FLAG =
  'apollo.web.growth-request-access-when-blocked';

export const useRequestAccessPage = ({
  isLoggedIn,
  errorType,
  reason,
}: {
  isLoggedIn: boolean;
  errorType: string;
  reason?: string;
}) => {
  const [adjustedErrorType, setAdjustedErrorType] = useState(errorType);

  useEffect(() => {
    if (
      isLoggedIn &&
      reason === 'Unauthorized' &&
      (errorType === 'boardNotFound' || errorType === 'cardNotFound')
    ) {
      const variant = featureFlagClient.getTrackedVariation<ExperimentVariations>(
        REQUEST_ACCESS_EXPERIMENT_FLAG,
        ExperimentVariations.NOT_ENROLLED,
      );
      if (variant === ExperimentVariations.EXPERIMENT) {
        setAdjustedErrorType('requestAccessExperiment');
      }
    }
  }, [errorType, reason, isLoggedIn]);

  return { adjustedErrorType };
};
