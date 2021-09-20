import { sendErrorEvent } from '@trello/error-reporting';
import { getNetworkError } from '@trello/graphql-error-handling';
import { Button } from '@trello/nachos/button';
import { Textfield } from '@trello/nachos/textfield';
import { TeamTypes, isMemberAdmin } from '@trello/organizations';
import { memberId } from '@trello/session-cookie';
import { forNamespace, localizeErrorCode } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';
import { TeamTypeSelect } from 'app/src/components/TeamTypeSelect';
import React, { useState, useContext } from 'react';
import { MigrationWizardContext } from './MigrationWizardContext';
import styles from './MigrationWizardComplexCreateWorkspace.less';
import { useMigrationWizardComplexCreateWorkspaceMutation } from './MigrationWizardComplexCreateWorkspaceMutation.generated';
import { SelectedWorkspaceType } from './MigrationWizardComplexMoveBoardsWorkspaceChooser';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { Analytics } from '@trello/atlassian-analytics';
import { screenToSource } from './constants';
import { MigrationWizardExperience, MigrationWizardSteps } from './types';

const format = forNamespace(['migration wizard']);
const formatError = forNamespace(['error handling', 'organization']);

interface MigrationWizardComplexMoveBoardsCreateWorkspaceProps {
  onCreateWorkspace: (workspace: SelectedWorkspaceType) => void;
}

export const MigrationWizardComplexCreateWorkspace: React.FC<MigrationWizardComplexMoveBoardsCreateWorkspaceProps> = ({
  onCreateWorkspace,
}) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<TeamTypes>();
  const [
    createWorkspaceMutation,
  ] = useMigrationWizardComplexCreateWorkspaceMutation();
  const { experience } = useContext(MigrationWizardContext);
  const createWorkspace = async () => {
    const trimmedName = workspaceName.trim();

    if (trimmedName.length > 100) {
      setError(formatError('ORG_DISPLAY_NAME_LONG'));
      return;
    }

    const taskName = 'create-organization/migrationWizard';
    const source =
      screenToSource[
        experience === MigrationWizardExperience.Post
          ? MigrationWizardSteps.POST_MIGRATION
          : MigrationWizardSteps.COMPLEX_MOVE_BOARDS
      ];

    const traceId = Analytics.startTask({ taskName, source });

    try {
      setIsLoading(true);

      const { data } = await createWorkspaceMutation({
        variables: {
          name: trimmedName,
          teamType: workspaceType ?? TeamTypes.Other,
          traceId,
        },
      });

      if (data?.createOrganization) {
        const workspace: SelectedWorkspaceType = {
          ...data?.createOrganization,
          numberOfFreeBoardsAvailable:
            data?.createOrganization?.limits?.orgs?.freeBoardsPerOrg
              ?.disableAt ?? 10,
          isPremiumWorkspace: false,
          isAdmin:
            !!memberId &&
            isMemberAdmin(
              { id: memberId, memberType: 'normal' },
              data?.createOrganization,
            ),
        };

        Analytics.taskSucceeded({ taskName, traceId, source });

        onCreateWorkspace(workspace);
      }
    } catch (err) {
      Analytics.taskFailed({
        taskName,
        traceId,
        source,
        error: err,
      });

      const networkError = getNetworkError(err);
      switch (networkError?.code) {
        case 'ORG_DISPLAY_NAME_SHORT':
          setError(localizeErrorCode('organization', 'ORG_DISPLAY_NAME_SHORT'));
          break;
        default:
          setError(localizeErrorCode('organization', 'UNKNOWN_ERROR'));
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-bizteam',
              feature: Feature.MigrationWizard,
            },
            extraData: {
              file: 'useCreateTeamAndMoveBoards',
            },
            networkError,
          });
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.createWorkspace}>
      <div className={styles.workspaceName}>
        <Textfield
          label={format('popover-workspace-name')}
          className={styles.control}
          autoFocus
          value={workspaceName}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => {
            setWorkspaceName(e.target.value);
          }}
        />
      </div>
      <div className={styles.workspaceType}>
        <TeamTypeSelect
          label={format('popover-workspace-type')}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(teamTypeValue: TeamTypes) => {
            setWorkspaceType(teamTypeValue);
          }}
        />
      </div>
      <Button
        shouldFitContainer
        appearance="primary"
        isDisabled={!workspaceName || !workspaceType}
        isLoading={isLoading}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={createWorkspace}
      >
        {format('popover-button-and-title')}
      </Button>
      {error && (
        <MigrationWizardMessagePill type="error">
          {error}
        </MigrationWizardMessagePill>
      )}
    </div>
  );
};
