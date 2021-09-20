import { useEffect, useState } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { useAtlassianAccountMigrationStageQuery } from './AtlassianAccountMigrationStageQuery.generated';

import { HYGIENE_MESSAGE_ID } from 'app/src/components/EmailHygieneWizard/emailHygieneOneTimeMessageIds';
import { NEWLY_MANAGED_MESSAGE_ID } from 'app/src/components/AtlassianAccountOnboardingBanner/NewlyManaged/newlyManagedMessageId';
import { INACTIVE_MIGRATION_MESSAGE_ID } from 'app/src/components/AtlassianAccountMigration/inactiveMigrationMessageId';
import { AtlassianAccountMigrationStage as Stage } from './types';

import { checkUserNeedsSyncUnblocked } from './checkUserNeedsSyncUnblocked';

interface Options {
  skip?: boolean;
}

export function useAtlassianAccountMigrationStage({
  skip = false,
}: Options = {}) {
  const [stage, setStage] = useState<Stage | null>(null);
  const { data, refetch } = useAtlassianAccountMigrationStageQuery({
    skip,
    variables: { memberId: 'me' },
  });
  const me = data?.member;

  useEffect(() => {
    if (me?.idEnterprise || me?.enterprises?.length) {
      Analytics.sendOperationalEvent({
        action: 'changed',
        actionSubject: 'migrationStage',
        source: 'atlassianAccountMigrationStage',
        attributes: {
          stage,
          idEnterprise: me?.idEnterprise,
          enterprises: me?.enterprises?.length,
        },
      });
    }
  }, [stage, me]);

  useEffect(() => {
    if (!me) {
      return;
    }

    const hasDismissedNewlyManaged = me.oneTimeMessagesDismissed?.includes(
      NEWLY_MANAGED_MESSAGE_ID,
    );
    const hasCompletedHygiene = me.oneTimeMessagesDismissed?.includes(
      HYGIENE_MESSAGE_ID,
    );
    const wasInactiveMigration = me.oneTimeMessagesDismissed?.includes(
      INACTIVE_MIGRATION_MESSAGE_ID,
    );

    const isManagedByAtlOrg = !!me.idEnterprise && !!me.domainClaimed;

    const needsSyncUnblocked = checkUserNeedsSyncUnblocked(me.aaBlockSyncUntil);
    const isProfileSyncUnblocked = me.aaBlockSyncUntil && !needsSyncUnblocked;

    if (me.isAaMastered) {
      if (isManagedByAtlOrg) {
        if (needsSyncUnblocked) {
          setStage(Stage.onboarding);
        } else if (isProfileSyncUnblocked) {
          setStage(Stage.onboardingSuccess);
        } else if (me.confirmed && !hasDismissedNewlyManaged) {
          setStage(Stage.newlyManaged);
        } else {
          setStage(Stage.done);
        }
      } else {
        if (wasInactiveMigration) {
          setStage(Stage.inactiveMigration);
        } else if (hasCompletedHygiene) {
          setStage(Stage.migrationSuccess);
        } else {
          setStage(Stage.done);
        }
      }
    } else if (me.idEnterprise) {
      setStage(Stage.ineligible);
    } else if (hasCompletedHygiene) {
      setStage(Stage.migration);
    } else if (me.confirmed) {
      setStage(Stage.emailHygiene);
    } else {
      setStage(Stage.confirmEmail);
    }
  }, [me]);

  return { stage, me, refetchStage: refetch };
}
