import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forTemplate } from '@trello/i18n';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { WorkspaceSwitcherTestIds } from '@trello/test-ids';
import { useAllBoardsAndWorkspacesQuery } from './AllBoardsAndWorkspacesQuery.generated';
import { useAllWorkspaces } from './useAllWorkspaces';
import { WorkspaceSwitcherPopover } from './WorkspaceSwitcherPopover';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import { useWorkspaceSwitcherState } from './useWorkspaceSwitcherState';
import { HeaderMenu } from 'app/src/components/HeaderMenu';

const format = forTemplate('workspace_switcher');

export const WorkspaceSwitcher: React.FunctionComponent = () => {
  const [shouldHidePopover, setShouldHidePopover] = useState(false);
  const { workspaces } = useAllWorkspaces();
  const [
    workspaceSwitcherState,
    setWorkspaceSwitcherState,
  ] = useWorkspaceSwitcherState();

  useEffect(() => {
    if (workspaces?.length !== undefined && workspaces?.length > 1) {
      setWorkspaceSwitcherState({ visible: true });
    } else {
      setWorkspaceSwitcherState({ visible: false });
    }
  }, [workspaces?.length, setWorkspaceSwitcherState]);

  const CreateWorkspaceOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "gamma-create-team-overlay" */ 'app/gamma/src/components/overlays/create-team-overlay'
      ),

    {
      preload: false,
    },
  );

  const [showCreateWorkspaceOverlay, setShowCreateWorkspaceOverlay] = useState(
    false,
  );

  const closeOverlay = useCallback(() => {
    setShowCreateWorkspaceOverlay(false);
  }, [setShowCreateWorkspaceOverlay]);

  const onClickCreateTeam = useCallback(() => {
    setShowCreateWorkspaceOverlay(true);
    setShouldHidePopover(true);
  }, [setShowCreateWorkspaceOverlay, setShouldHidePopover]);

  const onWorkspaceClick = useCallback(() => {
    setShouldHidePopover(true);
  }, [setShouldHidePopover]);

  const resetShouldHidePopover = useCallback(() => {
    setShouldHidePopover(false);
  }, [setShouldHidePopover]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-teamplates',
        feature: Feature.WorkspaceSwitcher,
      }}
    >
      {!workspaceSwitcherState.visible ? null : (
        <HeaderMenu
          buttonText={format('teams')}
          analyticsButtonName="workspaceSwitcherButton"
          analyticsComponentName="workspaceSwitcherMenuInlineDialog"
          popoverTitle={format('teams')}
          optimisticQuery={{ query: useAllBoardsAndWorkspacesQuery }}
          dataTestId={WorkspaceSwitcherTestIds.WorkspaceSwitcher}
          shouldHidePopover={shouldHidePopover}
          resetShouldHidePopover={resetShouldHidePopover}
        >
          <WorkspaceSwitcherPopover
            onCreateTeamOverlayOpen={onClickCreateTeam}
            onWorkspaceClick={onWorkspaceClick}
          />
        </HeaderMenu>
      )}
      {showCreateWorkspaceOverlay && (
        <Suspense fallback={null}>
          <CreateWorkspaceOverlay
            teamType={TeamType.Default}
            onClose={closeOverlay}
          />
        </Suspense>
      )}
    </ErrorBoundary>
  );
};
