import Cookie from 'js-cookie';
import { useFeatureFlag, featureFlagClient } from '@trello/feature-flag-client';
import { useStandardVariationQuery } from './StandardVariationQuery.generated';

const REPACKAGING_GTM_FEATURES = 'nusku.repackaging-gtm.features';
const REPACKAGING_GTM_STANDARD_BILLING =
  'nusku.repackaging-gtm.standard-billing';

type StandardVariation = 'standard-a' | 'standard-b' | 'control';

export const getStandardVariation = (standardVariation?: string | null) => {
  // Override for all kinds of testing
  const standardVariationOverride = Cookie.get('force_standardVariation');

  return (standardVariationOverride ||
    standardVariation ||
    'control') as StandardVariation;
};

export const getStandardVariationEnabled = (
  standardVariation?: string | null,
) =>
  featureFlagClient.get(REPACKAGING_GTM_FEATURES, false) ||
  getStandardVariation(standardVariation) !== 'control';

interface UseStandard {
  (args: {
    standardVariation?: StandardVariation | string | null;
    orgId?: string;
  }): {
    isRepackagingGTMBillingEnabled: boolean;
    isStandardVariationEnabled: boolean;
    standardVariation: StandardVariation;
  };
}

export const useStandard: UseStandard = ({
  standardVariation: staVariation,
  orgId = '',
}) => {
  const { data } = useStandardVariationQuery({
    variables: { orgId },
    skip: !orgId,
  });

  const standardVariation = getStandardVariation(
    staVariation || data?.organization?.standardVariation,
  );
  const isRepackagedGtmFeatures = useFeatureFlag(
    REPACKAGING_GTM_FEATURES,
    false,
  );
  const isStandardVariationEnabled =
    isRepackagedGtmFeatures || standardVariation !== 'control';

  const isRepackagingGTMBillingEnabled = useFeatureFlag(
    REPACKAGING_GTM_STANDARD_BILLING,
    false,
  );

  return {
    isRepackagingGTMBillingEnabled,
    isStandardVariationEnabled,
    standardVariation,
  };
};

export const getRepackagingGTM = (standardVariation?: string | null) => {
  const isRepackagingGTMBillingEnabled = featureFlagClient.get(
    REPACKAGING_GTM_STANDARD_BILLING,
    false,
  );

  const staVariation = getStandardVariation(standardVariation);

  return {
    isRepackagingGTMBillingEnabled,
    standardVariation: staVariation,
  };
};
