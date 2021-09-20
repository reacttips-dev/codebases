import { useDismissMigrationMessageMutation } from './DismissMigrationMessageMutation.generated';
import { showFlag } from '@trello/nachos/experimental-flags';
import React, { useEffect } from 'react';
import { MigrationWizardExperience } from './types';
import { WorkspaceMigrationSuccessMessage } from './WorkspaceMigrationSuccessMessage';
import {
  WORKSPACE_MIGRATION_SUCCESS_MESSAGE,
  WORKSPACE_MIGRATION_SUCCESS_FLAG_TIMEOUT,
} from './constants';

// Show WorkspaceMigrationSuccessMessage in a flag once
export const useWorkspaceMigrationSuccessFlag = (
  experience: MigrationWizardExperience,
  migrationOrg: {
    id?: string;
    displayName?: string;
  },
  oneTimeMessagesDismissed: string[],
) => {
  const [dismissOneTimeMessage] = useDismissMigrationMessageMutation();

  useEffect(() => {
    if (
      experience === MigrationWizardExperience.SuccessVeryHeavyUsage &&
      !oneTimeMessagesDismissed.includes(
        `${WORKSPACE_MIGRATION_SUCCESS_MESSAGE}-${migrationOrg.id}`,
      )
    ) {
      showFlag({
        id: 'WorkspaceMigrationSuccess',
        appearance: 'success',
        title: <WorkspaceMigrationSuccessMessage migrationOrg={migrationOrg} />,
        isAutoDismiss: true,
        msTimeout: WORKSPACE_MIGRATION_SUCCESS_FLAG_TIMEOUT,
        isUndismissable: true,
      });
      dismissOneTimeMessage({
        variables: {
          messageId: `${WORKSPACE_MIGRATION_SUCCESS_MESSAGE}-${migrationOrg.id}`,
        },
      });
    }
  }, [
    experience,
    migrationOrg,
    oneTimeMessagesDismissed,
    dismissOneTimeMessage,
  ]);
};
