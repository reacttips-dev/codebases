import React, {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import classNames from 'classnames';
import Alerts from 'app/scripts/views/lib/alerts';
import { Button } from '@trello/nachos/button';
import { HideReason } from '@trello/nachos/popover';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { useWorkspacesPreambleBoardHeaderButtonQuery } from './WorkspacesPreambleBoardHeaderButtonQuery.generated';
import { useWorkspacesPreambleDismissPromptMutation } from './WorkspacesPreambleDismissPromptMutation.generated';
import { WorkspacesPreamblePrompt } from './WorkspacesPreamblePrompt';
import { useIsEnterpriseOwnedMember } from './useIsEnterpriseOwnedMember';
import { forNamespace } from '@trello/i18n';
import { isBoardPath } from 'app/gamma/src/util/url';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './WorkspacesPreambleBoardHeaderButton.less';
import { featureFlagClient } from '@trello/feature-flag-client';
import { memberId } from '@trello/session-cookie';

const format = forNamespace();
const formatPreamble = forNamespace('workspaces preamble');

interface WorkspacesPreambleBoardHeaderButtonProps {
  boardId: string;
  canAutoShow?: boolean;
  onCreateTeamSuccess: (teamName?: string) => void;
  onSelectTeamSuccess?: (orgId?: string) => void;
  windowUrl?: string;
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const PersonalButton = forwardRef<
  HTMLAnchorElement,
  { onClick: () => void }
>(({ onClick }, ref) => {
  return (
    <a
      className="board-header-btn board-header-btn-without-icon"
      onClick={onClick}
      ref={ref}
      role="button"
    >
      <span className="board-header-btn-text">{format('personal')}</span>
    </a>
  );
});

export const AddToTeamButton = forwardRef<
  HTMLAnchorElement,
  { boardId: string; onClick: () => void }
>(({ boardId, onClick }, ref) => {
  const sendAnalyticEvents = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'workspacesPreambleAddToTeamButton',
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
      directObj: Noun.WORKSPACES_PREAMBLE_ADD_TO_TEAM_BUTTON,
      context: { boardId },
    });
  };

  return (
    <a
      className="board-header-btn board-header-btn-without-icon"
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        sendAnalyticEvents();
        onClick();
      }}
      ref={ref}
      role="button"
    >
      <span className="board-header-btn-text">
        {formatPreamble('board-header-button-add-to-workspace')}
      </span>
    </a>
  );
});

const PromptIntroScreen: React.FunctionComponent<{
  buttonCopy: string;
  onButtonClick: () => void;
}> = ({ buttonCopy, onButtonClick }) => {
  return (
    <div className={styles.workspacesPreambleBoardHeaderButtonIntro}>
      <img
        src={require('resources/images/workspaces-preamble/workspaces-preamble-prompt-board-image.png')}
        alt=""
        role="presentation"
      />
      <h2 className={styles.workspacesPreambleBoardHeaderButtonIntroTitle}>
        {formatPreamble('prompt-heading')}
      </h2>
      <p>{formatPreamble('prompt-paragraph-workspaces-make-it-easy')}</p>
      <Button
        appearance="primary"
        className={styles.workspacesPreambleBoardHeaderButtonContinueButton}
        onClick={onButtonClick}
        shouldFitContainer
      >
        {buttonCopy}
      </Button>
    </div>
  );
};

export const WorkspacesPreambleBoardHeaderButton: React.FunctionComponent<WorkspacesPreambleBoardHeaderButtonProps> = ({
  boardId,
  canAutoShow,
  onCreateTeamSuccess,
  onSelectTeamSuccess,
  windowUrl,
}) => {
  const [isAddToTeamPopoverVisible, setIsAddToTeamPopoverVisible] = useState(
    false,
  );
  const [hasSucceeded, setAddToSelectedTeamSucceeded] = useState(false);

  const { data, error, loading } = useWorkspacesPreambleBoardHeaderButtonQuery({
    variables: { boardId },
    skip: !memberId,
  });

  const [dismissPrompt] = useWorkspacesPreambleDismissPromptMutation();
  const DISMISS_MESSAGE = `WorkspacesPreamblePrompt-${boardId}`;

  const isEnterpriseOwnedMember = useIsEnterpriseOwnedMember();

  const meId = data?.member?.id;
  const meMembership = data?.board?.memberships?.find(
    (membership) => membership.idMember === meId,
  );
  const isBoardAdmin = meMembership?.memberType === 'admin';
  const boardIsTeamless = !data?.board?.idOrganization;
  const boardIsEnterpriseOwned = data?.board?.enterpriseOwned;

  const numberOfConfirmedCollaborators = data?.board?.members?.reduce(
    (count, member) => (member.confirmed ? count + 1 : count),
    0,
  );
  const isCollaborative = (numberOfConfirmedCollaborators || 0) >= 2;

  const meetsBasicButtonConditions = Boolean(
    !loading &&
      !error &&
      boardIsTeamless &&
      !boardIsEnterpriseOwned &&
      isBoardAdmin &&
      !isEnterpriseOwnedMember,
  );

  const canShowAddToTeamButton = Boolean(
    meetsBasicButtonConditions && isCollaborative && data?.member?.confirmed,
  );

  const canOpenPromptFromPersonalButton = Boolean(
    meetsBasicButtonConditions &&
      !canShowAddToTeamButton &&
      !isCollaborative &&
      featureFlagClient.get('btg.block-teamless-boards', false),
  );

  /**
   * Prompt should only show automatically if:
   * - The board and member meet the requirements for showing the Add To Team button
   * - The member's oneTimeMessagesDismissed does not include a dismiss message for this board
   * - The page is a board view page
   * - The board view gives permission (canAutoShow)
   */
  const isBoardView = isBoardPath(
    new URL(windowUrl || window.location.href).pathname,
  );
  const oneTimeMessagesDismissed = data?.member?.oneTimeMessagesDismissed || [
    DISMISS_MESSAGE,
  ];
  const shouldShowPromptAutomatically = !!(
    canShowAddToTeamButton &&
    canAutoShow &&
    isBoardView &&
    !oneTimeMessagesDismissed.includes(DISMISS_MESSAGE)
  );

  const onHideAddToTeam = (hideReason: HideReason) => {
    setIsAddToTeamPopoverVisible(false);

    // If the user closes the popover by explicitly clicking the X button, dismiss the prompt
    if (hideReason === HideReason.CLICK_CLOSE_BUTTON) {
      dismissPrompt({
        variables: { messageId: `WorkspacesPreamblePrompt-${boardId}` },
      });
    }
  };

  const onShowAddToTeam = () => {
    setIsAddToTeamPopoverVisible(true);

    Analytics.sendScreenEvent({
      name: 'workspacesPreambleAddToTeamInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
      },
    });
    trackUe({
      category: Noun.BOARD_VIEW,
      verb: Verb.VIEWS,
      directObj: Noun.WORKSPACES_PREAMBLE_ADD_TO_TEAM_PROMPT,
      context: { boardId },
    });
  };

  // Show an alert if we dismiss the popover due to another member adding it to a team
  const wasTeamless = usePrevious(boardIsTeamless);
  useEffect(() => {
    if (
      wasTeamless &&
      !boardIsTeamless &&
      isAddToTeamPopoverVisible &&
      !hasSucceeded
    ) {
      Alerts.show(
        'teamless-board-added-to-team',
        'info',
        'WorkspacesPreamble',
        5000,
      );
    }
  }, [boardIsTeamless, isAddToTeamPopoverVisible, wasTeamless, hasSucceeded]);

  // Do not remove the button if the popover is open
  const shouldShowAddToTeamButton =
    canShowAddToTeamButton || isAddToTeamPopoverVisible;

  const selectTeamSuccess = useCallback(
    (orgId) => {
      onSelectTeamSuccess?.(orgId);
      setAddToSelectedTeamSucceeded(true);
    },
    [onSelectTeamSuccess, setAddToSelectedTeamSucceeded],
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.WorkspacesPreamble,
      }}
    >
      {shouldShowAddToTeamButton && (
        <WorkspacesPreamblePrompt
          autoShow={shouldShowPromptAutomatically}
          boardId={boardId}
          IntroScreen={PromptIntroScreen}
          isBoardTeamless={boardIsTeamless}
          onCreateTeamSuccess={onCreateTeamSuccess}
          onSelectTeamSuccess={selectTeamSuccess}
          // eslint-disable-next-line react/jsx-no-bind
          onHide={onHideAddToTeam}
          // eslint-disable-next-line react/jsx-no-bind
          onShow={onShowAddToTeam}
          successAnalyticDirectObj={Noun.WORKSPACES_PREAMBLE_ADD_TO_TEAM_PROMPT}
          successAnalyticSource="workspacesPreambleAddToTeamInlineDialog"
          TriggerButton={AddToTeamButton}
        />
      )}
      {canOpenPromptFromPersonalButton && (
        <WorkspacesPreamblePrompt
          boardId={boardId}
          IntroScreen={PromptIntroScreen}
          isBoardTeamless={boardIsTeamless}
          onCreateTeamSuccess={onCreateTeamSuccess}
          TriggerButton={PersonalButton}
        />
      )}
      {!shouldShowAddToTeamButton && !canOpenPromptFromPersonalButton && (
        <a
          className={classNames(
            'board-header-btn board-header-btn-without-icon js-add-board-to-team',
            { 'no-edit': !isBoardAdmin },
          )}
        >
          <span className="board-header-btn-text">{format('personal')}</span>
        </a>
      )}
    </ErrorBoundary>
  );
};
