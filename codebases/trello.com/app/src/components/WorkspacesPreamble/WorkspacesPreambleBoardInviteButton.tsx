import React, { forwardRef, useCallback } from 'react';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Button } from '@trello/nachos/button';
import { useWorkspacesPreambleBoardInviteButtonQuery } from './WorkspacesPreambleBoardInviteButtonQuery.generated';
import { WorkspacesPreamblePrompt } from './WorkspacesPreamblePrompt';
import { forTemplate, forNamespace } from '@trello/i18n';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';
import { WorkSpacesPreambleTestIds } from '@trello/test-ids';
import styles from './WorkspacesPreambleBoardInviteButton.less';

const formatInviteButton = forTemplate('board_header');
const formatPreamble = forNamespace('workspaces preamble');

interface WorkspacesPreambleBoardInviteButtonProps {
  boardId: string;
  onSuccess: (orgId?: string) => void;
}

const InviteButton = forwardRef<
  HTMLAnchorElement,
  { boardId: string; onClick: () => void }
>(({ boardId, onClick }, ref) => {
  const sendAnalyticEvents = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'workspacesPreambleBoardInviteButton',
      source: 'boardScreen',
      containers: {
        board: {
          id: boardId,
        },
      },
    });
    trackUe({
      category: Noun.BOARD_VIEW,
      verb: Verb.CLICKS,
      directObj: Noun.WORKSPACES_PREAMBLE_BOARD_INVITE_BUTTON,
      context: { boardId },
    });
  };

  return (
    <a
      className="board-header-btn board-header-btn-invite board-header-btn-without-icon"
      title={formatInviteButton('invite-to-board')}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        sendAnalyticEvents();
        onClick();
      }}
      ref={ref}
      role="button"
    >
      <span className="board-header-btn-text">
        {formatInviteButton('invite')}
      </span>
    </a>
  );
});

const PromptIntroScreen: React.FunctionComponent<{
  buttonCopy: string;
  onButtonClick: () => void;
}> = ({ buttonCopy, onButtonClick }) => {
  return (
    <div className={styles.workspacesPreamblePromptInviteIntro}>
      <img
        src={require('resources/images/workspaces-preamble/workspaces-preamble-prompt-board-invite-image.png')}
        alt=""
        role="presentation"
      />
      <h2 className={styles.workspacesPreamblePromptInviteIntroTitle}>
        {formatPreamble('prompt-heading-invite-time-for-a-workspace')}
      </h2>
      <p>
        {formatPreamble(
          'prompt-paragraph-invite-workspaces-make-collaboration-easier',
        )}
      </p>
      <Button
        appearance="primary"
        className={styles.workspacesPreamblePromptInviteIntroContinueButton}
        data-test-id={
          WorkSpacesPreambleTestIds.WorkspacesPreambleCreateTeamButton
        }
        onClick={onButtonClick}
        shouldFitContainer
      >
        {buttonCopy}
      </Button>
    </div>
  );
};

export const WorkspacesPreambleBoardInviteButton: React.FunctionComponent<WorkspacesPreambleBoardInviteButtonProps> = ({
  boardId,
  onSuccess,
}) => {
  const { data } = useWorkspacesPreambleBoardInviteButtonQuery({
    variables: { boardId },
  });

  /**
   * For the invite button to open the prompt, the board and user must meet the following:
   * - The board does not belong to a team
   * - The board has no members other than the admin
   * - The board is not owned by an enterprise
   * - The user is the admin
   * - The user is not a member of an enterprise team
   * - The user must be confirmed
   * If the board and user do not meet the requirements for the WorkspacesPreamble feature, show the classic Invite button
   */
  const meId = data?.member?.id;
  const meMembership = data?.board?.memberships?.find(
    (membership) => membership.idMember === meId,
  );
  const isEnterpriseOwned = data?.board?.enterpriseOwned;
  const isBoardAdmin = meMembership?.memberType === 'admin';
  const isEnterpriseMember = !!data?.member?.enterprises?.length;
  const isTeamless = !data?.board?.idOrganization;
  const hasNoCollaborators = data?.board?.members?.length === 1;
  const boardAndMemberMeetRequirements = !!(
    isBoardAdmin &&
    isTeamless &&
    hasNoCollaborators &&
    !isEnterpriseOwned &&
    !isEnterpriseMember &&
    data?.member?.confirmed
  );

  const onShow = () => {
    Analytics.sendScreenEvent({
      name: 'workspacesPreambleBoardInviteInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
      },
    });
    trackUe({
      category: Noun.BOARD_VIEW,
      verb: Verb.VIEWS,
      directObj: Noun.WORKSPACES_PREAMBLE_BOARD_INVITE_PROMPT,
      context: { boardId },
    });
  };

  const onSelectTeamSuccess = useCallback(
    (orgId) => {
      onSuccess(orgId);
    },
    [onSuccess],
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.WorkspacesPreamble,
      }}
    >
      {boardAndMemberMeetRequirements ? (
        <WorkspacesPreamblePrompt
          boardId={boardId}
          IntroScreen={PromptIntroScreen}
          onCreateTeamSuccess={onSuccess}
          onSelectTeamSuccess={onSelectTeamSuccess}
          // eslint-disable-next-line react/jsx-no-bind
          onShow={onShow}
          successAnalyticDirectObj={
            Noun.WORKSPACES_PREAMBLE_BOARD_INVITE_PROMPT
          }
          successAnalyticSource="workspacesPreambleBoardInviteInlineDialog"
          TriggerButton={InviteButton}
        />
      ) : (
        <a
          className="board-header-btn board-header-btn-invite board-header-btn-without-icon js-open-manage-board-members"
          title={formatInviteButton('invite-to-board')}
        >
          <span className="board-header-btn-text">
            {formatInviteButton('invite')}
          </span>
        </a>
      )}
    </ErrorBoundary>
  );
};
