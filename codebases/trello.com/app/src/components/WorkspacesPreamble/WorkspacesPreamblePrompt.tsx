import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import { memberId } from '@trello/session-cookie';
import {
  usePopover,
  Popover,
  PopoverScreen,
  HideReason,
} from '@trello/nachos/popover';
import Alerts from 'app/scripts/views/lib/alerts';
import { Feature } from 'app/scripts/debug/constants';
import { useWorkspacesPreamblePromptQuery } from './WorkspacesPreamblePromptQuery.generated';
import { useWorkspacesPreambleAddBoardToTeamMutation } from './WorkspacesPreambleAddBoardToTeamMutation.generated';
import { useWorkspacesPreambleBoardVisibilityMutation } from './WorkspacesPreambleBoardVisibilityMutation.generated';
import { useWorkspacesPreambleNewBillableGuestsQuery } from './WorkspacesPreambleNewBillableGuestsQuery.generated';
// eslint-disable-next-line no-restricted-imports
import { Board_Prefs_PermissionLevel } from '@trello/graphql/generated';
import { useRestrictedBoardVisibility } from './useRestrictedBoardVisibility';
import { useRestrictedGuests } from './useRestrictedGuests';
import { BoardMemberRestrictionAlert } from './BoardMemberRestrictionAlert';
import { BoardVisibilityRestrictionAlert } from './BoardVisibilityRestrictionAlert';
import { NewBillableGuestsAlert } from './NewBillableGuestsAlert';
import { WorkspacesPreambleCreateTeam } from './WorkspacesPreambleCreateTeam';
import { WorkspacesPreambleSelectTeam } from './WorkspacesPreambleSelectTeam';
import { forNamespace, localizeErrorCode } from '@trello/i18n';
import { sendErrorEvent } from '@trello/error-reporting';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import { getNetworkError } from '@trello/graphql-error-handling';

const format = forNamespace('workspaces preamble');

const noop = () => {};

interface WorkspacesPreamblePromptProps {
  autoShow?: boolean;
  boardId: string;
  IntroScreen: React.FunctionComponent<{
    buttonCopy: string;
    onButtonClick: () => void;
  }>;
  isBoardTeamless?: boolean;
  onCreateTeamSuccess: (teamName?: string) => void;
  onHide?: (hideReason: HideReason) => void;
  onSelectTeamSuccess?: (orgId?: string) => void;
  onShow?: () => void;
  successAnalyticDirectObj?: Noun;
  successAnalyticSource?: SourceType;
  TriggerButton: ForwardRefExoticComponent<
    { boardId: string; onClick: () => void } & RefAttributes<HTMLAnchorElement>
  >;
}

enum Screens {
  Intro,
  SelectTeam,
  CreateTeam,
  BoardMemberRestriction,
  BoardVisibilityRestriction,
  NewBillableGuests,
}

export const WorkspacesPreamblePrompt: React.FunctionComponent<WorkspacesPreamblePromptProps> = ({
  boardId,
  IntroScreen,
  isBoardTeamless,
  onCreateTeamSuccess,
  onHide = noop,
  onSelectTeamSuccess = noop,
  onShow = noop,
  autoShow,
  successAnalyticDirectObj,
  successAnalyticSource,
  TriggerButton,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [
    isBoardMemberRestrictionResolved,
    setIsBoardMemberRestrictionResolved,
  ] = useState(false);
  const [
    boardVisibilityRestrictionResolution,
    setBoardVisibilityRestrictionResolution,
  ] = useState('' as Board_Prefs_PermissionLevel);
  const [
    isNewBillableGuestsResolved,
    setIsNewBillableGuestsResolved,
  ] = useState(false);

  const { data } = useWorkspacesPreamblePromptQuery({
    variables: { boardId },
  });

  const {
    data: newBillableGuestsData,
  } = useWorkspacesPreambleNewBillableGuestsQuery({
    variables: { boardId, orgId: selectedTeamId },
    skip: selectedTeamId === '',
  });

  const {
    hasBoardMemberRestrictions,
    boardMembersNotInTeam,
    loading: restrictedGuestsLoading,
  } = useRestrictedGuests({
    orgId: selectedTeamId,
    boardId,
    skip: data?.board?.members.length === 1,
  });

  const {
    loading: boardVisibilityRestrictionsLoading,
    teamRestrictsCurrentBoardVisibility,
  } = useRestrictedBoardVisibility({
    orgId: selectedTeamId,
    boardId,
  });

  const [addBoardToTeam] = useWorkspacesPreambleAddBoardToTeamMutation();
  const [
    updateBoardVisibility,
  ] = useWorkspacesPreambleBoardVisibilityMutation();

  const {
    popoverProps,
    push,
    show,
    toggle,
    triggerRef,
    hide,
  } = usePopover<HTMLAnchorElement>({
    initialScreen: Screens.Intro,
    onHide,
    onShow,
  });

  useEffect(() => {
    // Reset resolutions when the team is changed or the popover is closed
    setIsBoardMemberRestrictionResolved(false);
    setBoardVisibilityRestrictionResolution('' as Board_Prefs_PermissionLevel);
  }, [
    popoverProps.isVisible,
    selectedTeamId,
    setIsBoardMemberRestrictionResolved,
    setBoardVisibilityRestrictionResolution,
  ]);

  const onSelectTeamSubmit = async (options?: {
    boardMemberRestrictionResolved?: boolean;
    boardVisibilityRestrictionResolution?: Board_Prefs_PermissionLevel;
    newBillableGuestsResolved?: boolean;
  }) => {
    /**
     * If adding the board to the team will result in removing board members, stop
     * and notify the user. If not, continue add the board to the team. The
     * BoardMemberRestriction popover screen will notify the user and allow them to
     * continue or return to the team selection step.
     */
    if (
      hasBoardMemberRestrictions &&
      boardMembersNotInTeam.length &&
      !options?.boardMemberRestrictionResolved &&
      !isBoardMemberRestrictionResolved
    ) {
      push(Screens.BoardMemberRestriction);
      return;
    }

    /**
     * If adding the board to the team will result in new billable guests, stop
     * and notify the user. If not, continue to add the board to the team. The
     * NewBillableGuests popover screen will notify the user and allow them to
     * continue or return to the team selection step.
     */
    if (
      newBillableGuestsData?.organization?.newBillableGuests?.length &&
      !options?.newBillableGuestsResolved &&
      !isNewBillableGuestsResolved
    ) {
      push(Screens.NewBillableGuests);
      return;
    }

    /**
     * If the board's visibility is restricted by the team, stop and notify the user.
     * The BoardVisibilityRestriction popover screen will notify the user and allow
     * them to choose another visibility for the board or return to the team selection
     * step.
     */
    if (
      teamRestrictsCurrentBoardVisibility &&
      !options?.boardVisibilityRestrictionResolution &&
      !boardVisibilityRestrictionResolution
    ) {
      push(Screens.BoardVisibilityRestriction);
      return;
    }

    try {
      /**
       * If the user is a team admin, they can keep new billable guests. The
       * user will already have been notified of any new billable guests in the
       * NewBillableGuests popover screen.
       */
      const keepBillableGuests = !!newBillableGuestsData?.organization?.memberships?.find(
        (membership) =>
          membership.idMember === memberId && membership.memberType === 'admin',
      );

      /**
       * If we need to set a new visibility, we'll need to do that while moving
       * to the team. This is the only way Team Visible can be chosen as an option.
       * Otherwise, we can simply move the board to the team.
       */
      if (
        options?.boardVisibilityRestrictionResolution ||
        boardVisibilityRestrictionResolution
      ) {
        const newVisibility =
          options?.boardVisibilityRestrictionResolution ||
          boardVisibilityRestrictionResolution;
        await updateBoardVisibility({
          variables: {
            boardId,
            visibility: newVisibility,
            orgId: selectedTeamId,
            keepBillableGuests,
          },
        });
      } else {
        await addBoardToTeam({
          variables: { boardId, orgId: selectedTeamId, keepBillableGuests },
        });
      }

      if (successAnalyticSource) {
        Analytics.sendTrackEvent({
          action: 'updated',
          actionSubject: 'workspace',
          source: successAnalyticSource,
          containers: {
            board: {
              id: boardId,
            },
            organization: {
              id: selectedTeamId,
            },
          },
          attributes: {
            newOrg: false,
            updatedOn: 'board',
          },
        });
      }

      if (successAnalyticDirectObj) {
        trackUe({
          category: Noun.BOARD_VIEW,
          verb: Verb.SUBMITS,
          directObj: successAnalyticDirectObj,
          context: {
            boardId,
            newOrg: false,
            orgId: selectedTeamId,
          },
        });
      }

      onSelectTeamSuccess(selectedTeamId);
    } catch (err) {
      const networkError = getNetworkError(err);
      switch (networkError?.code) {
        // not sure which errors to handle yet
        default:
          Alerts.showLiteralText(
            localizeErrorCode('organization', 'UNKNOWN_ERROR'),
            'error',
            'WorkspacesPreamble',
            5000,
          );
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-bizteam',
              feature: Feature.WorkspacesPreamble,
            },
            extraData: {
              component: 'WorkspacesPreamblePrompt',
            },
            networkError,
          });
          return;
      }
    }
  };

  useEffect(() => {
    if (autoShow) {
      show();
    }
  }, [autoShow, show]);

  useEffect(() => {
    // Explicit boolean equality here since isBoardTeamless may be undefined
    if (isBoardTeamless === false) {
      hide();
    }
  }, [isBoardTeamless, hide]);

  const isMemberOfTeam = !!data?.member?.idOrganizations?.length || false;
  const secondScreen = isMemberOfTeam ? Screens.SelectTeam : Screens.CreateTeam;

  // If the board and user do not meet the requirements for the WorkspacesPreamble feature, show the classic Personal button
  return (
    <>
      <TriggerButton boardId={boardId} onClick={toggle} ref={triggerRef} />
      <Popover
        {...popoverProps}
        title={
          isMemberOfTeam
            ? format('popover-title-add-to-workspace')
            : format('popover-title-create-workspace')
        }
      >
        <PopoverScreen id={Screens.Intro}>
          <IntroScreen
            // eslint-disable-next-line react/jsx-no-bind
            onButtonClick={() => push(secondScreen)}
            buttonCopy={
              isMemberOfTeam
                ? format('prompt-continue-button-add-to-workspace')
                : format('prompt-continue-button-create-workspace')
            }
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.SelectTeam}>
          <WorkspacesPreambleSelectTeam
            boardId={boardId}
            isLoadingSelectedTeam={
              restrictedGuestsLoading || boardVisibilityRestrictionsLoading
            }
            onSelectTeam={setSelectedTeamId}
            // eslint-disable-next-line react/jsx-no-bind
            onSelectCreateTeam={() => push(Screens.CreateTeam)}
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={onSelectTeamSubmit}
            selectedTeamId={selectedTeamId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.CreateTeam}>
          <WorkspacesPreambleCreateTeam
            analyticsDirectObj={successAnalyticDirectObj}
            analyticsSource={successAnalyticSource}
            boardId={boardId}
            onSuccess={onCreateTeamSuccess}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.BoardMemberRestriction}>
          <BoardMemberRestrictionAlert
            boardId={boardId}
            // eslint-disable-next-line react/jsx-no-bind
            onCancel={() => push(Screens.SelectTeam)}
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={() => {
              setIsBoardMemberRestrictionResolved(true);
              onSelectTeamSubmit({ boardMemberRestrictionResolved: true });
            }}
            orgId={selectedTeamId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.BoardVisibilityRestriction}>
          <BoardVisibilityRestrictionAlert
            boardId={boardId}
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={(visibility: Board_Prefs_PermissionLevel) => {
              setBoardVisibilityRestrictionResolution(visibility);
              onSelectTeamSubmit({
                boardVisibilityRestrictionResolution: visibility,
              });
            }}
            orgId={selectedTeamId}
          />
        </PopoverScreen>
        <PopoverScreen id={Screens.NewBillableGuests}>
          <NewBillableGuestsAlert
            // eslint-disable-next-line react/jsx-no-bind
            onSubmit={() => {
              setIsNewBillableGuestsResolved(true);
              onSelectTeamSubmit({ newBillableGuestsResolved: true });
            }}
          />
        </PopoverScreen>
      </Popover>
    </>
  );
};
