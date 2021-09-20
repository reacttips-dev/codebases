import { useFeatureFlag } from '@trello/feature-flag-client';
import { ProductFeatures } from '@trello/product-features';
import { useBoardViewsPopoverUpsellQuery } from './BoardViewsPopoverUpsellQuery.generated';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';

const FLAG_NAME = 'nusku.views-switcher-upsell';
const DEFAULT_OPEN_FLAG_NAME = 'nusku.views-switcher-upsell-default-open';

export const useBoardViewsPopoverUpsell = ({ orgId }: { orgId?: string }) => {
  const isFlagEnabled = useFeatureFlag(FLAG_NAME, false, {
    sendExposureEvent: true,
  });

  const { data } = useBoardViewsPopoverUpsellQuery({
    variables: {
      orgId: orgId!,
    },
    skip: !orgId,
  });
  const organization = data?.organization;
  const isFreeTeam = Boolean(organization && !organization.products[0]);

  const isStandardTeam = Boolean(
    organization && ProductFeatures.isStandardProduct(organization.products[0]),
  );

  const {
    isEligible: isFreeTrialEligible,
    startFreeTrial,
    isAdmin,
  } = useFreeTrialEligibilityRules(orgId);

  // Free or Standard team, eligible for Free Trial
  const shouldDisplayFreeTrialStep =
    !isStandardTeam && isFreeTeam && isFreeTrialEligible;

  // Free or Standard team, not eligible for Free Trial
  const shouldDisplayUpgradeStep =
    isStandardTeam || (isFreeTeam && !isFreeTrialEligible);

  const step = shouldDisplayFreeTrialStep
    ? 'freetrial'
    : shouldDisplayUpgradeStep
    ? 'upgrade'
    : null;

  const isUpsellEnabled = Boolean(organization && isFlagEnabled && step);

  const isDefaultOpenFlagEnabled = useFeatureFlag(
    DEFAULT_OPEN_FLAG_NAME,
    false,
    {
      sendExposureEvent: true,
    },
  );

  const isUpsellDefaultOpenEnabled = Boolean(
    isDefaultOpenFlagEnabled && isUpsellEnabled,
  );

  return {
    activateFreeTrial: () =>
      startFreeTrial(
        {
          redirect: false,
        },
        'boardViewsInlineDialog',
      ),
    isUpsellEnabled,
    step,
    isAdmin,
    isUpsellDefaultOpenEnabled,
  };
};
