import React, { useEffect, useState } from 'react';
import { MoonshotPage } from './MoonshotPage';
import { navigate } from 'app/scripts/controller/navigate';
import { Campaigns, MoonshotSteps } from './campaigns';
import { memberId } from '@trello/session-cookie';
import { useMoonshotQuery } from './MoonshotQuery.generated';
import { useMoonshotUpdateCampaignMutation } from './MoonshotUpdateCampaignMutation.generated';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useHeaderHider } from './useHeaderHider';

export const MoonshotOrRedirect: React.FunctionComponent = () => {
  const [canRender, setCanRender] = useState<boolean>(false);
  const { data, loading } = useMoonshotQuery();
  const [
    updateCampaign,
    { loading: savingCampaign },
  ] = useMoonshotUpdateCampaignMutation();

  useHeaderHider({ hide: canRender });

  const member = data?.member;
  const idMember = member?.id || '';
  const campaigns = member?.campaigns ?? [];
  const moonshotCampaign = campaigns?.find(
    (c) => c.name === Campaigns.MOONSHOT,
  );
  const organizations = member?.organizations ?? [];
  const adminedTeam = organizations.find((organization) =>
    organization.memberships.find(
      (membership) =>
        membership.idMember === idMember && membership?.memberType === 'admin',
    ),
  );
  const isEnterprise = !!member?.enterprises?.find(
    (ent) => ent.id === member?.idEnterprise,
  )?.isRealEnterprise;
  const urlParams = new URLSearchParams(window.location.search);
  const slackPromoCode = urlParams.get('promocode');
  const isNDSActive = useFeatureFlag(
    'btg.workspaces.new-direct-signups',
    false,
  );
  const isNDSEnterpriseActive = useFeatureFlag(
    'btg.workspaces.new-direct-signups.enterprise',
    false,
  );

  useEffect(() => {
    const initialize = async () => {
      if (loading) {
        return;
      }

      // if we already ran this, lets let other components
      // do the work for redirects
      if (canRender) {
        return;
      }

      if (!memberId) {
        window.location.assign('/login');
        return;
      }

      if (isEnterprise && !isNDSEnterpriseActive) {
        return navigate('/', { replace: true, trigger: true });
      }

      if (moonshotCampaign && moonshotCampaign.dateDismissed === null) {
        if (
          adminedTeam &&
          moonshotCampaign.currentStep === MoonshotSteps.WELCOME
        ) {
          return navigate(`/${adminedTeam.name}`, {
            replace: true,
            trigger: true,
          });
        }
      } else {
        if (adminedTeam) {
          return navigate('/', {
            replace: true,
            trigger: true,
          });
        } else if (!slackPromoCode && !isNDSActive) {
          return navigate('/', {
            replace: true,
            trigger: true,
          });
        }

        // in the case that you go through moonshot, then
        // delete your team or are removed, then there is a chance you attempt
        // to enter moonshot via slack codes. So here we are
        // resetting the dateDismissed to null for that case
        if (
          moonshotCampaign &&
          moonshotCampaign?.dateDismissed !== null &&
          !savingCampaign
        ) {
          await updateCampaign({
            variables: {
              id: moonshotCampaign.id,
              isDismissed: false,
            },
          });
        }
      }

      setCanRender(true);
    };

    initialize();
  }, [
    loading,
    adminedTeam,
    moonshotCampaign,
    slackPromoCode,
    isNDSActive,
    canRender,
    updateCampaign,
    savingCampaign,
    isEnterprise,
    isNDSEnterpriseActive,
  ]);

  if (!canRender) {
    return null;
  }

  return <MoonshotPage />;
};
