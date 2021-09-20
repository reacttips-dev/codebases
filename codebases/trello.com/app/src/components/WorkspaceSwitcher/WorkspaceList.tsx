import React from 'react';

import { WorkspaceSwitcherTestIds } from '@trello/test-ids';
import { WorkspaceListItem } from './WorkspaceListItem';
import { CreateTeamButton } from 'app/src/components/WorkspaceNavigation/CreateTeamButton';
import styles from './WorkspaceList.less';
import { forTemplate } from '@trello/i18n';
import { featureFlagClient } from '@trello/feature-flag-client';
import {
  GuestWorkspace,
  PersonalWorkspace,
  MemberWorkspace,
  Workspace,
} from './useAllWorkspaces';

const format = forTemplate('workspace_switcher');

interface WorkspaceListViewProps {
  workspaces: Workspace[];
  onClickWorkspace: (orgId?: string) => void;
  idWorkspace?: string | null;
  isGlobal?: boolean;
  onCreateTeamOverlayOpen: () => void;
}

export const WorkspaceList = ({
  workspaces,
  idWorkspace,
  isGlobal,
  onCreateTeamOverlayOpen,
  onClickWorkspace,
}: WorkspaceListViewProps) => {
  let personalWorkspace: PersonalWorkspace | undefined = undefined;
  const memberWorkspaces: MemberWorkspace[] = [];
  const guestWorkspaces: GuestWorkspace[] = [];

  for (const workspace of workspaces) {
    switch (workspace.userRelationshipToWorkspace) {
      case 'PERSONAL':
        personalWorkspace = workspace;
        break;
      case 'MEMBER':
        memberWorkspaces.push(workspace);
        break;
      case 'GUEST':
        guestWorkspaces.push(workspace);
        break;
      default:
        break;
    }
  }

  const currentWorkspace = workspaces.find((workspace): workspace is
    | MemberWorkspace
    | GuestWorkspace => {
    return (
      (workspace.userRelationshipToWorkspace === 'GUEST' ||
        workspace.userRelationshipToWorkspace === 'MEMBER') &&
      workspace.id === idWorkspace
    );
  });
  const showCurrentWorkspace = !isGlobal && idWorkspace && currentWorkspace;

  const isWorkspaceHomeRedesignEnabled = featureFlagClient.get(
    'teamplates.web.workspace-page-redesign',
    false,
  );

  return (
    <div data-test-id={WorkspaceSwitcherTestIds.WorkspaceList}>
      {memberWorkspaces.length > 0 ? (
        <>
          {showCurrentWorkspace && (
            <>
              <div className={styles.teamsHeaderRow}>
                <p
                  className={styles.workspacesListSectionHeader}
                  data-test-id={
                    WorkspaceSwitcherTestIds.CurrentWorkspaceListSectionHeader
                  }
                >
                  {format('current-team')}
                </p>
              </div>
              <WorkspaceListItem
                key={currentWorkspace!.id}
                logoHash={currentWorkspace!.logoHash}
                displayName={currentWorkspace!.displayName}
              />
            </>
          )}
          <div className={styles.teamsHeaderRow}>
            <p
              className={styles.workspacesListSectionHeader}
              data-test-id={
                WorkspaceSwitcherTestIds.MemberWorkspacesListSectionHeader
              }
            >
              {format('your-teams')}
            </p>
            <span className={styles.createTeamButton} role="button">
              <CreateTeamButton
                data-test-id={WorkspaceSwitcherTestIds.CreateTeamPlusButton}
                analyticsSource="listWorkspaceNavigationDrawer"
                currentWorkspaceId={idWorkspace}
                onCreateTeamButtonClick={onCreateTeamOverlayOpen}
              />
            </span>
          </div>
          {memberWorkspaces.map((org) => {
            const href = isWorkspaceHomeRedesignEnabled
              ? `/${org.name}`
              : org.urlMostRecentlyViewedBoard || `/${org.name}`;

            return (
              <WorkspaceListItem
                href={href}
                key={href}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onClickWorkspace(org.id)}
                logoHash={org.logoHash}
                displayName={org.displayName}
              />
            );
          })}
        </>
      ) : null}
      {guestWorkspaces.length > 0 ? (
        <>
          <p
            className={styles.workspacesListSectionHeader}
            data-test-id={
              WorkspaceSwitcherTestIds.GuestWorkspacesListSectionHeader
            }
          >
            {format('guest-teams')}
          </p>
          {guestWorkspaces.map((org, index) => (
            <WorkspaceListItem
              href={org.urlMostRecentlyViewedBoard}
              key={org.urlMostRecentlyViewedBoard}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => onClickWorkspace(org.id)}
              logoHash={org.logoHash}
              displayName={org.displayName}
            />
          ))}
        </>
      ) : null}
      {personalWorkspace ? (
        <div className={styles.personalWorkspaceItem}>
          <WorkspaceListItem
            data-test-id={WorkspaceSwitcherTestIds.PersonalWorkspaceListItem}
            href={
              personalWorkspace.urlMostRecentlyViewedBoard ||
              `/${personalWorkspace.name}/boards`
            }
            onClick={onClickWorkspace}
            displayName={personalWorkspace.displayName}
          />
        </div>
      ) : null}
    </div>
  );
};
