import React, { useEffect } from 'react';
import { SupportedFlagTypes } from '@atlassiansox/feature-flag-web-client';
import { featureFlagClient } from './feature-flag-client';

interface Overrides {
  [key: string]: SupportedFlagTypes;
}

const useFeatureFlagStoryOverrides = (overrides: Overrides) => {
  useEffect(() => {
    for (const [key, value] of Object.entries(overrides)) {
      featureFlagClient.setOverride(key, value);
    }

    return () => featureFlagClient.resetOverrides();
  }, [overrides]);
};

export const MockedFeatureFlags: React.FunctionComponent<{
  overrides: Overrides;
}> = ({ children, overrides }) => {
  useFeatureFlagStoryOverrides(overrides);

  return <>{children}</>;
};
