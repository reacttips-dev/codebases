import React, { useEffect, useCallback } from 'react';
import styles from './WorkspaceSwitcherPopover.less';
import { WorkspaceSwitcherTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/spinner';
import { useAllWorkspaces } from './useAllWorkspaces';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { Analytics } from '@trello/atlassian-analytics';
import { RetryScreen } from 'app/src/components/RetryScreen';
import { WorkspaceList } from './WorkspaceList';
import { forTemplate } from '@trello/i18n';
import { CreateTeamButton } from 'app/src/components/WorkspaceNavigation/CreateTeamButton';
import { useWorkspaceNavigation } from 'app/src/components/WorkspaceNavigation/useWorkspaceNavigation';
import { useWorkspace } from '@trello/workspaces';

const format = forTemplate('workspace_switcher');

const SpinnerScreen = () => (
  <div className={styles.spinnerContainer}>
    <Spinner />
  </div>
);

interface WorkspaceSwitcherPopoverProps {
  onCreateTeamOverlayOpen: () => void;
  onWorkspaceClick: () => void;
}

export const WorkspaceSwitcherPopover = ({
  onCreateTeamOverlayOpen,
  onWorkspaceClick,
}: WorkspaceSwitcherPopoverProps) => {
  const workspace = useWorkspace();
  const { workspaces, loading, error, refetch } = useAllWorkspaces();
  const [, setWorkspaceNavigationState] = useWorkspaceNavigation();

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'workspaceSwitcherInlineDialog',
    });
  }, []);

  const handleWorkspaceClick = useCallback(
    (orgId?: string) => {
      setWorkspaceNavigationState({ expanded: true });
      onWorkspaceClick();
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'menuItem',
        actionSubjectId: 'workspaceSwitcherMenuItem',
        source: 'workspaceSwitcherInlineDialog',
        ...(orgId
          ? {
              containers: {
                organization: {
                  id: orgId,
                },
              },
            }
          : {}),
      });
    },
    [setWorkspaceNavigationState, onWorkspaceClick],
  );

  if (loading || workspace.isLoading) {
    return <SpinnerScreen />;
  }

  if (error) {
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceNavigation,
      },
    });
    return (
      <RetryScreen onRetryClick={refetch} buttonText={format('try-again')}>
        <p>{format('error-loading-teams')}</p>
      </RetryScreen>
    );
  }

  if (!workspaces) {
    // if no data is returned we want to throw an error
    sendErrorEvent(new Error('Failed to load data from useAllWorkspaces'), {
      tags: {
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceNavigation,
      },
    });
    return (
      <RetryScreen onRetryClick={refetch} buttonText={format('try-again')}>
        <p>{format('error-loading-teams')}</p>
      </RetryScreen>
    );
  }

  return (
    <div data-test-id={WorkspaceSwitcherTestIds.WorkspaceSwitcherPopover}>
      {workspaces.length > 0 ? (
        <WorkspaceList
          idWorkspace={workspace.idWorkspace}
          isGlobal={workspace.isGlobal}
          onCreateTeamOverlayOpen={onCreateTeamOverlayOpen}
          onClickWorkspace={handleWorkspaceClick}
          workspaces={workspaces}
        />
      ) : (
        <CreateTeamButton
          fullTab={true}
          data-test-id={WorkspaceSwitcherTestIds.CreateTeamFullButton}
          analyticsSource="workspaceSwitcherInlineDialog"
          currentWorkspaceId={workspace.idWorkspace}
          onCreateTeamButtonClick={onCreateTeamOverlayOpen}
        />
      )}
    </div>
  );
};
