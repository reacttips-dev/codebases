import { featureFlagClient } from '@trello/feature-flag-client';
/**
 * Function that wraps the feature flag client for use with
 * views upsells. Ensures that the `views.upsell` flag is
 * evaluated whenever an individual views' upsell flag is evaluated
 *
 * @param flagName - An upsell flag to evaluate
 * @param defaultValue - the default value to return if the flag does not exist
 * @param attributes - Additional attributes to incluede in the Analytics exposure event
 *
 * @returns The flag value
 */
export const getViewsUpsellFlag = (
  flagName: string,
  defaultValue: boolean,
  attributes?: object,
): boolean => {
  featureFlagClient.getTrackedVariation('views.upsells', false, attributes);
  return !!featureFlagClient.getTrackedVariation(
    flagName,
    defaultValue,
    attributes,
  );
};
