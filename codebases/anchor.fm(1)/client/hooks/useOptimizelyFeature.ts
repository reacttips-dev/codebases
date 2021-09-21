import { useCallback, useContext, useEffect, useState } from 'react';
import { OptimizelyContext, enums } from '@optimizely/react-sdk';
import { UserAttributes } from '@optimizely/optimizely-sdk';

type FeatureVariables = {
  [key: string]: boolean | number | string | null;
};

type FeautureState = {
  isEnabled: boolean;
  variables: FeatureVariables;
};

const defaultFeatureState: FeautureState = {
  isEnabled: false,
  variables: {},
};

/**
 * SSR-friendly hook to retrieve Optimizely feature state and variables
 * Usage: const [isFeatureEnabled, featureVariables] = useOptimizelyFeature('feature_name');
 */
export const useOptimizelyFeature = (
  featureKey: string,
  overrideUserId?: string,
  overrideAttributes?: UserAttributes
): [boolean, FeatureVariables] => {
  const { optimizely } = useContext(OptimizelyContext);
  const isOptimizelyReady = optimizely?.isReady;

  const getFeatureState = useCallback((): FeautureState => {
    const isEnabled = optimizely!.isFeatureEnabled(
      featureKey,
      overrideUserId,
      overrideAttributes
    );
    const variables = optimizely!.getFeatureVariables(
      featureKey,
      overrideUserId,
      overrideAttributes
    );
    return { isEnabled, variables };
  }, [featureKey, optimizely, overrideAttributes, overrideUserId]);

  const [featureState, setFeatureState] = useState<FeautureState>(() =>
    isOptimizelyReady ? getFeatureState() : defaultFeatureState
  );

  useEffect(() => {
    if (optimizely && isOptimizelyReady) {
      // Add listeners to auto update state when config or user is changed
      const notificationId = optimizely.notificationCenter.addNotificationListener(
        enums.NOTIFICATION_TYPES.OPTIMIZELY_CONFIG_UPDATE,
        () => setFeatureState(getFeatureState())
      );
      const removeConfigListener = () =>
        optimizely.notificationCenter.removeNotificationListener(
          notificationId
        );
      const removeUserListener = optimizely.onUserUpdate(() =>
        setFeatureState(getFeatureState())
      );
      // Update state when Optimizely is ready, or when key/attributes change
      setFeatureState(getFeatureState());

      // Remove listeners on cleanup
      return () => {
        removeConfigListener();
        removeUserListener();
      };
    }
  }, [getFeatureState, isOptimizelyReady, optimizely]);

  return [featureState.isEnabled, featureState.variables];
};
