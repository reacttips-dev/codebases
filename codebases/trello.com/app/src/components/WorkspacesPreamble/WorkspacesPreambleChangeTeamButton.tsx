import React, { forwardRef } from 'react';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Button } from '@trello/nachos/button';
import { useWorkspacesPreambleChangeTeamButtonQuery } from './WorkspacesPreambleChangeTeamButtonQuery.generated';
import { WorkspacesPreamblePrompt } from './WorkspacesPreamblePrompt';
import { useIsEnterpriseOwnedMember } from './useIsEnterpriseOwnedMember';
import { forTemplate, forNamespace } from '@trello/i18n';
import styles from './WorkspacesPreambleChangeTeamButton.less';
import { memberId } from '@trello/session-cookie';
import classNames from 'classnames';

const formatChangeTeamButton = forTemplate('board_menu_settings');
const formatPreamble = forNamespace('workspaces preamble');
const noop = () => {};

interface WorkspacesPreambleChangeTeamButtonProps {
  boardId: string;
}

const ChangeTeamButton = forwardRef<HTMLAnchorElement, { onClick: () => void }>(
  ({ onClick }, ref) => {
    return (
      <a
        className={styles.workspacesPreambleChangeTeamButton}
        onClick={onClick}
        ref={ref}
        role="button"
      >
        {formatPreamble('board-settings-change-team-button')}
      </a>
    );
  },
);

const PromptIntroScreen: React.FunctionComponent<{
  buttonCopy: string;
  onButtonClick: () => void;
}> = ({ buttonCopy, onButtonClick }) => {
  return (
    <div className={styles.workspacesPreambleChangeTeamButtonIntro}>
      <img
        src={require('resources/images/workspaces-preamble/workspaces-preamble-prompt-board-image.png')}
        alt=""
        role="presentation"
      />
      <h2 className={styles.workspacesPreambleChangeTeamButtonIntroTitle}>
        {formatPreamble('prompt-heading')}
      </h2>
      <p>{formatPreamble('prompt-paragraph-workspaces-make-it-easy')}</p>
      <Button
        appearance="primary"
        className={styles.workspacesPreambleChangeTeamButtonContinueButton}
        onClick={onButtonClick}
        shouldFitContainer
      >
        {buttonCopy}
      </Button>
    </div>
  );
};

export const WorkspacesPreambleChangeTeamButton: React.FunctionComponent<WorkspacesPreambleChangeTeamButtonProps> = ({
  boardId,
}) => {
  const { data } = useWorkspacesPreambleChangeTeamButtonQuery({
    variables: { boardId },
    skip: !memberId,
  });

  const isEnterpriseOwnedMember = useIsEnterpriseOwnedMember();

  const meMembership = data?.board?.memberships?.find(
    (membership) => membership.idMember === memberId,
  );
  const isBoardAdmin = meMembership?.memberType === 'admin';
  const isTeamless = !data?.board?.idOrganization;
  const orgDisplayName = data?.board?.organization?.displayName;

  /**
   * For the board settings change team button to open the prompt, the board and user must meet the following:
   * - The board does not belong to a team
   * - The user is the admin
   * - The member does not belong to an enterprise
   *
   * If the board and user do not meet the requirements for the Workspaces
   * Preamble feature, show the classic change team button. Note that the
   * classic change team button requires the "disabled" class for the
   * consumer backbone view to recognize it as disabled.
   */
  const boardAndMemberMeetRequirements = Boolean(
    isBoardAdmin && isTeamless && !isEnterpriseOwnedMember,
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
          TriggerButton={ChangeTeamButton}
          onCreateTeamSuccess={noop}
        />
      ) : (
        <a
          className={classNames(
            'js-change-org',
            {
              disabled: !isBoardAdmin,
              [styles.workspacesPreambleChangeTeamButtonDisabled]: !isBoardAdmin,
            },
            styles.workspacesPreambleChangeTeamButton,
          )}
        >
          {formatChangeTeamButton('change-organization-ellipsis')}
          {orgDisplayName && (
            <span className={styles.workspacesPreambleChangeTeamButtonTeamName}>
              {orgDisplayName}
            </span>
          )}
        </a>
      )}
    </ErrorBoundary>
  );
};
