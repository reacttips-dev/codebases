import React, { useEffect } from 'react';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { navigate } from 'app/scripts/controller/navigate';
import { GoldPromoFreeTrial } from './GoldPromoFreeTrial';
import { dontUpsell } from '@trello/browser';
import { useMyGoldPromoFreeTrial } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';

export const GoldPromoFreeTrialOrRedirect: React.FC = () => {
  const goldSunsetEnabled = useFeatureFlag(
    'nusku.repackaging-gtm.gold-sunset',
    false,
  );
  const {
    addingTrial,
    eligibleWorkspaces,
    activatedGoldPromo,
    activatedGoldPromoTeamName,
    isEligibleMember,
    startGoldFreeTrial,
    loading,
  } = useMyGoldPromoFreeTrial();

  const redirect =
    dontUpsell() || (!loading && (!goldSunsetEnabled || !isEligibleMember));

  useEffect(() => {
    if (redirect) {
      navigate(
        activatedGoldPromo ? `/${activatedGoldPromoTeamName}/billing` : '/',
        {
          replace: true,
          trigger: true,
        },
      );
    }
  }, [redirect, activatedGoldPromo, activatedGoldPromoTeamName]);

  return !loading && !redirect ? (
    <GoldPromoFreeTrial
      workspaces={eligibleWorkspaces.map(
        ({ id, displayName, logoHash, memberships, name, boards }) => ({
          id,
          displayName,
          logoHash,
          memberCount: memberships.length,
          name,
          boardCount: boards.length,
        }),
      )}
      startGoldFreeTrial={startGoldFreeTrial}
      addingTrial={addingTrial}
    />
  ) : null;
};
