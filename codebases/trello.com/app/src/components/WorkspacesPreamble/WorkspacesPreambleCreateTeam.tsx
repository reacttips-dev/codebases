import React, { useState } from 'react';
import { forNamespace, localizeErrorCode } from '@trello/i18n';
import { memberId } from '@trello/session-cookie';
import styles from './WorkspacesPreambleCreateTeam.less';
import { useWorkspacesPreambleCreateTeamQuery } from './WorkspacesPreambleCreateTeamQuery.generated';
import { useWorkspacesPreambleAddTeamMembersMutation } from './WorkspacesPreambleAddTeamMembersMutation.generated';
import { useWorkspacesPreambleCreateTeamSubmitMutation } from './WorkspacesPreambleCreateTeamSubmitMutation.generated';
import { useWorkspacesPreambleAddBoardToTeamMutation } from './WorkspacesPreambleAddBoardToTeamMutation.generated';
import { Button } from '@trello/nachos/button';
import Alerts from 'app/scripts/views/lib/alerts';
import { Feature } from 'app/scripts/debug/constants';
import { Spinner } from '@trello/nachos/spinner';
import { TeamTypeSelect } from 'app/src/components/TeamTypeSelect';
import { WorkspacesPreambleBoardMemberList } from './WorkspacesPreambleBoardMemberList';
import { sendErrorEvent } from '@trello/error-reporting';
import { trackUe, Noun, Verb } from '@trello/analytics';
import { Analytics } from '@trello/atlassian-analytics';
import { SourceType } from '@trello/atlassian-analytics/src/constants/Source';
import { WorkSpacesPreambleTestIds } from '@trello/test-ids';
import { getNetworkError } from '@trello/graphql-error-handling';

const format = forNamespace('workspaces preamble');

const noop = () => {};

interface WorkspacesPreambleCreateTeamProps {
  analyticsDirectObj?: Noun;
  analyticsSource?: SourceType;
  boardId: string;
  onSuccess: (orgName?: string) => void;
}

export const WorkspacesPreambleCreateTeam: React.FunctionComponent<WorkspacesPreambleCreateTeamProps> = ({
  analyticsDirectObj,
  analyticsSource,
  boardId,
  onSuccess,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamType, setTeamType] = useState<string>();
  const [isTeamNameValid, setIsTeamNameValid] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const { data } = useWorkspacesPreambleCreateTeamQuery({
    variables: { boardId },
  });

  const [createOrganization] = useWorkspacesPreambleCreateTeamSubmitMutation();

  const [addBoardMembersToTeam] = useWorkspacesPreambleAddTeamMembersMutation();

  const [addBoardToTeam] = useWorkspacesPreambleAddBoardToTeamMutation();

  const onChangeTeamName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newTeamName = e?.target?.value;
    if (typeof newTeamName !== 'undefined') {
      setTeamName(newTeamName);
      setIsTeamNameValid(newTeamName.trim().length > 0);
    }
  };

  const onCreateTeamSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      // 1. Create Team
      const createResponse = await createOrganization({
        variables: {
          type: 'default',
          displayName: teamName.trim(),
          teamType,
        },
      });

      const orgName = createResponse.data?.createOrganization?.name;
      const orgId = createResponse.data?.createOrganization?.id;

      if (orgId && orgName) {
        // 2. Add the current board to the new team.
        await addBoardToTeam({
          variables: { boardId, orgId },
        });

        // 3. Add the chosen members to the team
        const usersToAddToTeam = selectedMembers.map((idMember) => ({
          id: idMember,
        }));
        const membersAddedCount = usersToAddToTeam.length;

        if (membersAddedCount) {
          await addBoardMembersToTeam({
            variables: {
              orgId,
              users: usersToAddToTeam,
            },
          });
        }

        const availableMembersCount = (data?.board?.members || []).filter(
          (member) => memberId !== member.id && member.confirmed,
        ).length;

        if (analyticsSource) {
          Analytics.sendTrackEvent({
            action: 'updated',
            actionSubject: 'workspace',
            source: analyticsSource,
            containers: {
              board: {
                id: boardId,
              },
              organization: {
                id: orgId,
              },
            },
            attributes: {
              availableMembersCount,
              membersAddedCount,
              newOrg: true,
              updatedOn: 'board',
            },
          });
        }

        if (analyticsDirectObj) {
          trackUe({
            category: Noun.BOARD_VIEW,
            verb: Verb.SUBMITS,
            directObj: analyticsDirectObj,
            context: {
              availableMembersCount,
              boardId,
              membersAddedCount,
              newOrg: true,
              orgId: orgId,
            },
          });
        }

        onSuccess(orgName);
      }
    } catch (err) {
      setIsSubmitted(false);
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
              component: 'WorkspacesPreambleCreateTeam',
            },
            networkError,
          });
          return;
      }
    }
  };

  const isButtonEnabled = isTeamNameValid && !!teamType && !isSubmitted;

  return (
    <div className={styles.createTeam}>
      <label
        className={styles.createTeamInputLabel}
        htmlFor="workspacesPreambleCreateTeamInput"
      >
        {format(['new-workspace-input-label'])}
      </label>
      <input
        id="workspacesPreambleCreateTeamInput"
        className={styles.createTeamInput}
        type="text"
        autoComplete="off"
        spellCheck={false}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChangeTeamName}
        autoFocus={true}
        placeholder={format(['new-team-input-placeholder'])}
        value={teamName}
        maxLength={100}
        disabled={isSubmitted}
      />
      <TeamTypeSelect
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(teamTypeValue) => setTeamType(teamTypeValue)}
        isDisabled={isSubmitted}
        testId={WorkSpacesPreambleTestIds.WorkspacesPreambleSelectTeamType}
      />
      <WorkspacesPreambleBoardMemberList
        boardId={boardId}
        // eslint-disable-next-line react/jsx-no-bind
        onSelectMember={(currentSelectedMembers) =>
          setSelectedMembers(currentSelectedMembers)
        }
      />
      <Button
        isDisabled={!isButtonEnabled}
        appearance="primary"
        className={styles.createTeamButton}
        onClick={isButtonEnabled ? onCreateTeamSubmit : noop}
        size="fullwidth"
        testId={WorkSpacesPreambleTestIds.WorkspacesPreambleCreateTeamSubmit}
      >
        {isSubmitted ? (
          <Spinner
            centered
            testId={WorkSpacesPreambleTestIds.WorkspacesPreambleSpinner}
          />
        ) : (
          format(['submit-button-create-workspace'])
        )}
      </Button>
    </div>
  );
};
