import { featureFlagClient } from './feature-flag-client';
import { useFeatureFlag } from './useFeatureFlag';

type VersionedVariation = 'alpha' | 'beta' | 'stable';

function canVariationSee(
  actualVariation: string,
  desiredVariation: VersionedVariation,
) {
  switch (desiredVariation) {
    case 'alpha':
      return ['alpha'].includes(actualVariation);
    case 'beta':
      return ['alpha', 'beta'].includes(actualVariation);
    case 'stable':
      return ['alpha', 'beta', 'stable'].includes(actualVariation);
    default:
      throw new Error(`Invalid variation desired: ${desiredVariation}`);
  }
}

/**
 * This function checks whether or not the logged in user
 * should have access to the desired variation of the passed
 * in flag.
 *
 * @param flag - The key of the flag whose variation is being checked.
 * The flag used should use a _string_ variation type, with special variation
 * values used for different versions of the flag. The special variation values are
 *
 * - alpha
 * - beta
 * - stable
 *
 * As listed above, each variation denotes access to both itself, and all of the
 * variations listed below it. For example, a user who is seeing the `beta` variation
 * will return `true` for a `desiredVariation` of `beta` or `stable`, but not for a
 * `desiredVariation` of `alpha`.
 *
 * @param desiredVariation - The "minimum" variation the user must be seeing for this
 * function to return true.
 *
 */
export function seesVersionedVariation(
  flag: string,
  desiredVariation: VersionedVariation,
) {
  const actualVariation = featureFlagClient.get(flag, 'stable');
  return canVariationSee(actualVariation, desiredVariation);
}

export function useSeesVersionedVariation(
  flag: string,
  desiredVariation: VersionedVariation,
) {
  const actualVariation = useFeatureFlag(flag, 'stable');
  return canVariationSee(actualVariation, desiredVariation);
}
