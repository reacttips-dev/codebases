import React from 'react';
import { getKey, Key } from '@trello/keybindings';
import { forNamespace, forTemplate } from '@trello/i18n';
import { CreateBoardTestIds } from '@trello/test-ids';
import { TeamSelector } from './TeamSelector';
import { VisibilitySelector } from './VisibilitySelector';
import { Button } from '@trello/nachos/button';
import {
  isAtOrOverFreeBoardLimit,
  freeBoardsUsed,
} from 'app/gamma/src/util/model-helpers/team';
import { dontUpsell } from '@trello/browser';
import { EnterpriseWithPermissions } from 'app/gamma/src/selectors/enterprises';
import { OrgWithPermissions } from 'app/gamma/src/selectors/teams';
import {
  BoardPermissionLevel,
  EnterpriseModel,
} from 'app/gamma/src/types/models';

import styles from './BoardInfo.less';
import PaidManagedMemberMessage from 'app/src/components/CreateBoard/PaidManagedMemberMessage';
import { UpgradeSmartComponentConnected } from 'app/src/components/UpgradePrompts';
import { Analytics } from '@trello/atlassian-analytics';
import { Checkbox } from '@trello/nachos/checkbox';

const formatTemplates = forTemplate('templates');
const formatRootString = forNamespace();
const formatUpgradePrompt = forNamespace([
  'upgrade prompt',
  'create board popover',
]);

export interface StateProps {
  backgroundStyle: {
    backgroundColor: string;
    backgroundImage: string | undefined;
  };
  boardName: string;
  isCreateBoardDisallowed: boolean;
  isCreateBoardSubmitEnabled: boolean;
  isCreatingBoard: boolean;
  isEnterpriseMemberOnNonEnterpriseTeam: boolean;
  enterprise?: EnterpriseModel;
  enterpriseWithPermissions?: EnterpriseWithPermissions;
  isLoadingVisPermissions: boolean;
  isTeamAdmin: boolean;
  keepFromSource: string[];
  selectedTeam: OrgWithPermissions | null;
  selectedVisibility: BoardPermissionLevel | null;
  teams: OrgWithPermissions[];
}

export interface DispatchProps {
  onChangeBoardName: React.FormEventHandler<HTMLInputElement>;
  onSelectTeam: (idTeam: string | null) => void;
  onSelectVisibility: (visibility: BoardPermissionLevel) => void;
  onChangeKeepCards: (keepCards: string[]) => void;
  preSelectOrg: () => void;
  setName: (name: string) => void;
  resetState: () => void;
  submitCreateBoard: (
    templateId: string,
    templateCategory: string | null,
    selectedVisibility: BoardPermissionLevel | null,
    selectedTeamId?: string,
  ) => void;
}

export interface AllProps extends StateProps, DispatchProps {
  boardId: string;
  templateCategory: string | null;
  sourceBoardName: string | null;
}

const submitIfEnterKeyPressed = (
  submitFn: AllProps['submitCreateBoard'],
  isEnabled: boolean,
  boardId: string,
  templateCategory: string | null,
  selectedVisibility: BoardPermissionLevel | null,
  selectedTeamId?: string,
): React.KeyboardEventHandler => (e: React.KeyboardEvent<HTMLElement>) => {
  if (isEnabled && getKey(e) === Key.Enter) {
    Analytics.sendClickedButtonEvent({
      source: 'useTemplateInlineDialog',
      buttonName: 'useTemplateButton',
      attributes: {
        inputMethod: 'enterKey',
      },
    });

    submitFn(boardId, templateCategory, selectedVisibility, selectedTeamId);
  }
};

const idPrefix = `${Date.now()}-`; // for id specificity
export const BoardInfo: React.FunctionComponent<AllProps> = ({
  boardId,
  templateCategory,
  boardName,
  enterpriseWithPermissions,
  isCreateBoardDisallowed,
  isCreateBoardSubmitEnabled,
  isCreatingBoard,
  isEnterpriseMemberOnNonEnterpriseTeam,
  isLoadingVisPermissions,
  keepFromSource,
  onChangeBoardName,
  onChangeKeepCards,
  onSelectTeam,
  onSelectVisibility,
  selectedTeam,
  selectedVisibility,
  submitCreateBoard,
  teams,
}) => {
  let checked = true;
  if (keepFromSource.includes('cards')) {
    checked = true;
  } else {
    checked = false;
  }

  return (
    <form>
      <label htmlFor={`${idPrefix}create-board-name`}>
        {formatTemplates('board-title')}
      </label>
      <input
        id={`${idPrefix}create-board-name`}
        autoComplete="off"
        autoCorrect="off"
        data-lpignore={true}
        spellCheck={false}
        type="text"
        autoFocus
        className={styles.boardNameInput}
        onChange={onChangeBoardName}
        onKeyDown={submitIfEnterKeyPressed(
          submitCreateBoard,
          isCreateBoardSubmitEnabled,
          boardId,
          templateCategory,
          selectedVisibility,
          selectedTeam?.model.id,
        )}
        value={boardName}
        data-test-id={CreateBoardTestIds.CreateBoardTitleInput}
      />
      {isLoadingVisPermissions && (
        <p>{formatRootString('checking visibility permissions')}</p>
      )}
      {!isLoadingVisPermissions && (
        <>
          <TeamSelector
            onSelectTeam={onSelectTeam}
            selectedTeam={selectedTeam}
            teams={teams}
          />
          {isEnterpriseMemberOnNonEnterpriseTeam && (
            <PaidManagedMemberMessage
              containerClass={styles.quietPaidManagedMemberMessage}
              text={formatTemplates('only-within-enterprise')}
            />
          )}
          {isCreateBoardDisallowed && (
            <p className={styles.teamBoardLimitReachedMessage}>
              {formatTemplates(
                selectedTeam
                  ? 'dont-have-permission'
                  : 'dont-have-permission-teamless',
              )}
            </p>
          )}
          {!!selectedVisibility && (
            <VisibilitySelector
              enterpriseWithPermissions={enterpriseWithPermissions}
              onSelectVisibility={onSelectVisibility}
              selectedTeam={selectedTeam}
              selectedVisibility={selectedVisibility}
            />
          )}
          {!isCreateBoardDisallowed && (
            <>
              <div className={styles.keepCardsContainer}>
                <Checkbox
                  defaultChecked={true}
                  isChecked={checked}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={() => onChangeKeepCards(checked ? [] : ['cards'])}
                  name="keepCardsCheckbox"
                ></Checkbox>
                <p className={styles.keepCardsText}>
                  {formatTemplates('keep-cards')}
                </p>
              </div>
              <p className={styles.activityMembersText}>
                {formatTemplates('activity-and-members-will-not-be-copied')}
              </p>
            </>
          )}
        </>
      )}

      {!dontUpsell() &&
        selectedTeam &&
        freeBoardsUsed(selectedTeam.model) !== undefined &&
        !isAtOrOverFreeBoardLimit(selectedTeam.model) && (
          <>
            <p className={styles.approachingFreeLimitMessage}>
              {formatUpgradePrompt('headline', {
                boardCount: freeBoardsUsed(selectedTeam.model),
              })}{' '}
              {formatUpgradePrompt('content-2')}
            </p>
            <div className={styles.upgradePromptButtonContainer}>
              <UpgradeSmartComponentConnected
                orgId={selectedTeam.model.id}
                promptId="approachingBoardLimitTemplateUpgradePromptPill"
              />
            </div>
          </>
        )}
      {!dontUpsell() &&
      selectedTeam &&
      isAtOrOverFreeBoardLimit(selectedTeam.model) ? (
        <>
          <p className={styles.teamBoardLimitReachedMessage}>
            {formatTemplates('team-maximum-boards')}
          </p>
          <div className={styles.upgradePromptButtonContainer}>
            <UpgradeSmartComponentConnected
              orgId={selectedTeam.model.id}
              promptId="atBoardLimitTemplateUpgradePromptPill"
            />
          </div>
        </>
      ) : (
        <Button
          isLoading={isCreatingBoard}
          appearance="primary"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendClickedButtonEvent({
              source: 'useTemplateInlineDialog',
              buttonName: 'useTemplateButton',
              attributes: {
                inputMethod: 'clickingCreate',
              },
            });

            submitCreateBoard(
              boardId,
              templateCategory,
              selectedVisibility,
              selectedTeam?.model.id,
            );
          }}
          isDisabled={!isCreateBoardSubmitEnabled}
          className={styles.primaryButtons}
        >
          {formatTemplates('create')}
        </Button>
      )}
    </form>
  );
};
