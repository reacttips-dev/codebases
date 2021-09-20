import { useEffect, useState } from 'react';
import { featureFlagClient } from './feature-flag-client';
import { SupportedFlagTypes } from '@atlassiansox/feature-flag-web-client';

export const useFeatureFlag = <T extends SupportedFlagTypes>(
  flagName: string,
  defaultValue: T,
  options?: {
    sendExposureEvent?: boolean;
    attributes?: object;
  },
): T => {
  // Get the initial value from LaunchDarkly (it may fall back to the defaultValue)
  // if the LaunchDarkly client isn't ready yet
  // By providing the option "sendExposureEvent" it will call getTrackedVariation
  // and triggerExposureEvent for analytics
  const [flag, setFlag] = useState(() =>
    options?.sendExposureEvent
      ? featureFlagClient.getTrackedVariation(
          flagName,
          defaultValue,
          options.attributes,
        )
      : featureFlagClient.get(flagName, defaultValue),
  );

  // Subscribe to updates from LaunchDarkly, and update our flag state with the
  // new value
  useEffect(() => {
    const onFlagChanged = (newValue: T) => setFlag(newValue);
    // @ts-ignore
    featureFlagClient.on(flagName, defaultValue, onFlagChanged);

    // Ensure the subscription is cleaned up when the component is unmounted, or
    // the flagName changes for some reason
    // @ts-ignore
    return () => featureFlagClient.off(flagName, onFlagChanged);
  }, [defaultValue, flagName]);

  return flag;
};
