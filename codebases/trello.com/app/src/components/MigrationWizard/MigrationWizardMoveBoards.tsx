import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { screenToSource } from './constants';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardExperience, MigrationWizardSteps } from './types';
import { sendErrorEvent } from '@trello/error-reporting';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { getNetworkError } from '@trello/graphql-error-handling';
import { Button } from '@trello/nachos/button';
import { ApolloError } from '@apollo/client';
import { Spinner } from '@trello/nachos/spinner';
import { Feature } from 'app/scripts/debug/constants';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { useMigrationWizardMoveBoardMutation } from './MigrationWizardMoveBoardMutation.generated';
import { MigrationWizardComplexMoveBoardsWorkspaceChooser } from './MigrationWizardComplexMoveBoardsWorkspaceChooser';
import { forNamespace, localizeErrorCode } from '@trello/i18n';
import { useMigrationWizardUpdateVoluntaryDoneMutation } from './MigrationWizardUpdateVoluntaryDoneMutation.generated';
import { useAvailableWorkspaces } from './useAvailableWorkspaces';
import { useTeamlessBoards } from './useTeamlessBoards';
import { useMigratedBoards } from './useMigratedBoards';
import styles from './MigrationWizardMoveBoards.less';
import { MigrationWizardBoardsList } from './MigrationWizardBoardsList';
import { MigrationWizardDone } from './MigrationWizardDone';

const format = forNamespace(['migration wizard'], {
  shouldEscapeStrings: false,
});

interface MigrationWizardMoveBoards {}

export const MigrationWizardMoveBoards: React.FC<MigrationWizardMoveBoards> = () => {
  const [isMovingBoards, setIsMovingBoards] = useState(false);
  const [error, setError] = useState('');
  const [updateBoardOrg] = useMigrationWizardMoveBoardMutation();
  const [
    updateTeamifyVoluntaryDone,
  ] = useMigrationWizardUpdateVoluntaryDoneMutation();
  const {
    workspaces,
    loading: loadingWorkspaces,
    refetch: refetchAvailableWorkspaces,
  } = useAvailableWorkspaces();
  const { loading: loadingTeamlessBoards } = useTeamlessBoards();
  const {
    selectedBoards,
    updateBoards,
    experience,
    teamify,
    setOrgId,
    orgId,
    refetchMigrationWizardQuery,
    teamlessBoards,
  } = useContext(MigrationWizardContext);

  const {
    migratedBoards,
    migrationOrg,
    loading: loadingMigratedBoards,
    refetch: refetchMigratedBoards,
  } = useMigratedBoards({
    skip: experience === MigrationWizardExperience.Advanced,
    idOrg: teamify?.idOrgCreated || teamify?.idOrgSelected || '',
  });

  const loadingBoards = loadingMigratedBoards || loadingTeamlessBoards;

  const selectableBoards =
    experience === MigrationWizardExperience.Post
      ? migratedBoards
      : teamlessBoards;

  const selectedWorkspace = useMemo(
    () => workspaces.find((w) => w.id === orgId),
    [workspaces, orgId],
  );

  const isDisabled =
    !selectedWorkspace || selectedBoards.length === 0 || isMovingBoards;

  const processError = (errorToProcess: ApolloError) => {
    const networkError = getNetworkError(errorToProcess);
    switch (networkError?.code) {
      case 'FREE_BOARD_LIMIT_REACHED':
        setError(localizeErrorCode('board', 'FREE_BOARD_LIMIT_REACHED'));
        break;
      default:
        setError(localizeErrorCode('organization', 'UNKNOWN_ERROR'));
        sendErrorEvent(errorToProcess, {
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
  };

  const onBoardsMigratedComplete = useCallback(() => {
    setIsMovingBoards(false);
    updateBoards({ type: 'clear' });
    refetchMigrationWizardQuery();
    refetchAvailableWorkspaces();

    if (experience === MigrationWizardExperience.Post) {
      refetchMigratedBoards();
    }
  }, [
    setIsMovingBoards,
    updateBoards,
    refetchMigrationWizardQuery,
    refetchMigratedBoards,
    experience,
    refetchAvailableWorkspaces,
  ]);

  const moveBoards = useCallback(async () => {
    if (isDisabled) {
      return;
    }

    setError('');
    setIsMovingBoards(true);

    const taskName = 'edit-board/idOrganization/migrationWizard';
    const source =
      screenToSource[
        experience === MigrationWizardExperience.Post
          ? MigrationWizardSteps.POST_MIGRATION
          : MigrationWizardSteps.COMPLEX_MOVE_BOARDS
      ];

    /**
     * Instead of running the mutation to change boardIds all at once (with Promise.all) we need to change the boardIds
     * one by one to allow the server time to update the count for available spaces for boards within a free organization.
     * Changing boardIds one by one also fixes a issue with Multi-Board Guests. If you
     * invoke this mutation and fire all requests at the same time, then the server does not get change to see if
     * any of the queries would introduce MBG or update the count of boards in an organizatinbecause they happen in parallel.
     * By staggering them we give the server chance to 'catch up' in between those requests so that it can update and information
     * regarding MBG and organization board counts and then will remove the members and correctly limit the number of boards
     * to a free team using this mutation.
     */
    for (const boardId of selectedBoards) {
      const traceId = Analytics.startTask({ taskName, source });

      try {
        await updateBoardOrg({
          variables: {
            boardId,
            orgId: selectedWorkspace!.id,
            traceId,
          },
        });

        updateBoards({ type: 'remove', idBoard: boardId });

        Analytics.sendUpdatedBoardFieldEvent({
          field: 'organization',
          value: selectedWorkspace!.id,
          source,
          containers: {
            board: {
              id: boardId,
            },
            organization: {
              id: selectedWorkspace!.id,
            },
          },
          attributes:
            experience === MigrationWizardExperience.Post
              ? { previous: migrationOrg.id }
              : undefined,
        });

        Analytics.taskSucceeded({ taskName, traceId, source });
      } catch (err) {
        Analytics.taskFailed({
          taskName,
          traceId,
          source,
          error: err,
        });
        processError(err);
      }
    }

    onBoardsMigratedComplete();
  }, [
    experience,
    migrationOrg.id,
    onBoardsMigratedComplete,
    selectedBoards,
    selectedWorkspace,
    updateBoardOrg,
    updateBoards,
    isDisabled,
  ]);

  useEffect(() => {
    const setVoluntaryDone = async () => {
      try {
        if (
          experience === MigrationWizardExperience.Pre &&
          !teamify?.voluntaryDone
        ) {
          await updateTeamifyVoluntaryDone({
            variables: {
              memberId: 'me',
            },
          });
        }
      } catch (err) {
        const networkError = getNetworkError(err);
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-bizteam',
            feature: Feature.MigrationWizard,
          },
          extraData: {
            file: 'MigrationWizardComplexMoveBoards',
          },
          networkError,
        });
      }
    };

    setVoluntaryDone();
  }, [updateTeamifyVoluntaryDone, teamify, experience]);

  if (!isMovingBoards && selectableBoards.length === 0) {
    return <MigrationWizardDone isComplexPath />;
  }

  return (
    <div className={styles.container}>
      <div>
        <h2>{format('post-migration-modal-title')}</h2>
        <p>{format('post-migration-modal-body')}</p>
        <hr />
        <div className={styles.movePrompt}>
          {experience === MigrationWizardExperience.Post
            ? format('post-migration-workspace-old-workspace', {
                workspaceName: migrationOrg.displayName,
              })
            : format('create-team-move-boards-add-boards-prompt')}
        </div>
      </div>
      <MigrationWizardComplexMoveBoardsWorkspaceChooser
        // eslint-disable-next-line react/jsx-no-bind
        onSelectWorkspace={(idWorkspace) => {
          setOrgId(idWorkspace);
          setError('');
        }}
        loading={loadingWorkspaces}
        workspaces={workspaces}
      />
      <MigrationWizardBoardsList
        boards={selectableBoards}
        loadingBoards={loadingBoards}
        workspace={selectedWorkspace}
        selectedBoards={selectedBoards}
        updateBoards={updateBoards}
        isMovingBoards={isMovingBoards}
      />

      <hr className={styles.separator} />

      {selectedWorkspace && (
        <p className={styles.note}>{format('start-migration-footer')}</p>
      )}
      {error && (
        <MigrationWizardMessagePill type="error">
          {error}
        </MigrationWizardMessagePill>
      )}
      <Button
        appearance="primary"
        className={styles.doneButton}
        isDisabled={isDisabled}
        onClick={moveBoards}
        testId={MigrationWizardTestIds.MoveBoardsButton}
      >
        {isMovingBoards ? (
          <Spinner small />
        ) : (
          format('start-migration-add-button')
        )}
      </Button>
    </div>
  );
};
