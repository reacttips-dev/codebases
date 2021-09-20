import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { forNamespace } from '@trello/i18n';
import React, { useContext, useState, useEffect } from 'react';
import { BoardIcon } from '@trello/nachos/icons/board';
import { AdminChevronIcon } from '@trello/nachos/icons/admin-chevron';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { ChecklistIcon } from '@trello/nachos/icons/checklist';
import { PowerUpIcon } from '@trello/nachos/icons/power-up';
import { SparkleIcon } from '@trello/nachos/icons/sparkle';
import styles from './MigrationWizardBusinessClass.less';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardSteps } from './types';
import { useCreateTeamAndMoveBoards } from './useCreateTeamAndMoveBoards';
import { MigrationWizardMessagePill } from './MigrationWizardMessagePill';
import { Analytics } from '@trello/atlassian-analytics';
import { screenToSource } from './constants';

const format = forNamespace(['migration wizard']);
const formatError = forNamespace(['alerts']);

interface MigrationWizardBusinessClassProps {}

export const MigrationWizardBusinessClass: React.FC<MigrationWizardBusinessClassProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { onNext, selectedBoards, teamName, orgId } = useContext(
    MigrationWizardContext,
  );
  const [boardSelectionError, setBoardSelectionError] = useState();
  const {
    createTeamAndMoveBoards,
    teamNameError,
    teamError,
  } = useCreateTeamAndMoveBoards();

  useEffect(() => {
    if (orgId !== '') {
      onNext?.(MigrationWizardSteps.MEMBERSHIPS);
    }
  }, [orgId, onNext]);

  let error;
  if (teamNameError) {
    error = teamNameError;
  } else if (boardSelectionError) {
    error = boardSelectionError;
  } else if (teamError) {
    error = teamError;
  } else {
    error = '';
  }

  return (
    <div className={styles.container}>
      <img
        className={styles.sparkle}
        src={require('resources/images/bc-sparkle-flat.svg')}
        alt=""
        role="presentation"
      />
      <h2>{format('business-class-title')}</h2>
      <h3>
        {format('business-class-paragraph', {
          numberOfBoards: selectedBoards.length,
        })}
      </h3>
      <p>{format('business-class-list-header')}</p>
      <ul className={styles.featureList}>
        <li>
          <span className={styles.featureIcon}>
            <BoardIcon />
          </span>
          {format('business-class-list-1-unlimited-boards-corrected')}
        </li>
        <li>
          <span className={styles.featureIcon}>
            <PowerUpIcon />
          </span>
          {format('business-class-list-2-unlimited-pups-corrected')}
        </li>
        <li>
          <span className={styles.featureIcon}>
            <ChecklistIcon />
          </span>
          {format('business-class-list-3-assign')}
        </li>
        <li>
          <span className={styles.featureIcon}>
            <AdminChevronIcon />
          </span>
          {format('business-class-list-4-admin-corrected-2')}
        </li>
        <li>
          <span className={styles.featureIcon}>
            <ButlerBotIcon />
          </span>
          {format('business-class-list-5-butler')}
        </li>
        <li>
          <span className={styles.featureIcon}>
            <SparkleIcon />
          </span>
          {format('business-class-list-6-more')}
        </li>
      </ul>
      <hr />

      {error && (
        <MigrationWizardMessagePill type="error">
          {error}
        </MigrationWizardMessagePill>
      )}

      <Button
        appearance="primary"
        className={styles.button}
        isDisabled={isLoading}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={async () => {
          const taskName = 'create-organization/migrationWizard';
          const source = screenToSource[MigrationWizardSteps.BC_FOR_FREE];

          const traceId = Analytics.startTask({ taskName, source });
          try {
            setIsLoading(true);
            await createTeamAndMoveBoards(teamName, selectedBoards);
            Analytics.taskSucceeded({ taskName, traceId, source });
          } catch (err) {
            Analytics.taskFailed({
              taskName,
              traceId,
              source,
              error: err,
            });
            setBoardSelectionError(
              err?.message ?? formatError('something-went-wrong'),
            );
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? (
          <Spinner small />
        ) : (
          format('create-team-move-boards-next-button')
        )}
      </Button>
      <p className={styles.disclaimer}>{format('business-class-footer')}</p>
    </div>
  );
};
