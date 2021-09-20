import { useFreeTrialDismissBannerAndConfettiMutation } from './FreeTrialDismissBannerAndConfettiMutation.generated';
import { FreeTrialBannerActive } from './FreeTrialBannerActive';
import { FreeTrialBannerExpired } from './FreeTrialBannerExpired';
import React from 'react';
import { dontUpsell } from '@trello/browser';
import Cookies from 'js-cookie';
import { useFreeTrialBannerQuery } from './FreeTrialBannerQuery.generated';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { useFreeTrialEligibilityRules } from './useFreeTrialEligibilityRules';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { TrialSource } from '@trello/organizations';
import { ProductFeatures } from '@trello/product-features';
import { isCompletelyFreeTrial } from 'app/src/components/Moonshot/experimentVariation';

interface Props {
  orgId: string;
}

export const FreeTrialBanner: React.FC<Props> = ({ orgId }) => {
  const [
    freeTrialDismissBannerAndConfetti,
  ] = useFreeTrialDismissBannerAndConfettiMutation();

  const freeTrialRules = useFreeTrialEligibilityRules(orgId);
  const {
    hasCredit,
    isTrialActive,
    trialSource,
    isAdmin,
    totalFreeTrialCredits,
  } = freeTrialRules;

  const { data, loading } = useFreeTrialBannerQuery({
    variables: { orgId },
  });

  const DISMISS_MESSAGE =
    totalFreeTrialCredits > 1
      ? `free-trial-banner-${totalFreeTrialCredits}-${orgId}`
      : `free-trial-banner-${orgId}`;

  const oneTimeMessagesDismissed = data?.member?.oneTimeMessagesDismissed
    ? data?.member?.oneTimeMessagesDismissed
    : [];

  if (
    !isAdmin ||
    !hasCredit ||
    oneTimeMessagesDismissed.includes(DISMISS_MESSAGE) ||
    loading ||
    !data ||
    data?.organization?.idEnterprise ||
    ProductFeatures.isStandardProduct(data?.organization?.products[0]) ||
    dontUpsell()
  ) {
    return null;
  }

  const simulateExpiredTrial = Cookies.get('simulateExpiredTrial');
  const trialActive = isTrialActive && !simulateExpiredTrial;
  const isMoonshotFreeTrial = trialSource === TrialSource.Moonshot;

  const renderBannerTracking = async () => {
    const bannerType =
      isAdmin && trialActive ? 'admin' : trialActive ? 'normal' : 'expired';

    Analytics.sendViewedBannerEvent({
      bannerName: 'freeTrialBanner',
      source: getScreenFromUrl(),
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        type: bannerType,
      },
    });
  };

  const dismissBanner = async () => {
    Analytics.sendDismissedComponentEvent({
      componentType: 'banner',
      componentName: 'freeTrialBanner',
      source: getScreenFromUrl(),
      containers: {
        organization: {
          id: orgId,
        },
      },
    });

    freeTrialDismissBannerAndConfetti({
      variables: { memberId: 'me', messageId: DISMISS_MESSAGE },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
            DISMISS_MESSAGE,
          ]),
          __typename: 'Member',
        },
      },
    });
  };

  if (
    (!isAdmin && !trialActive) ||
    (!isCompletelyFreeTrial() && isAdmin && isMoonshotFreeTrial)
  ) {
    return null;
  }
  renderBannerTracking();

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.FreeTrialExistingTeam,
      }}
    >
      {trialActive ? (
        <FreeTrialBannerActive
          orgId={orgId}
          // eslint-disable-next-line react/jsx-no-bind
          dismissBanner={dismissBanner}
          data={data}
          freeTrialRules={freeTrialRules}
        />
      ) : (
        <FreeTrialBannerExpired
          orgId={orgId}
          // eslint-disable-next-line react/jsx-no-bind
          dismissBanner={dismissBanner}
          data={data}
        />
      )}
    </ErrorBoundary>
  );
};
