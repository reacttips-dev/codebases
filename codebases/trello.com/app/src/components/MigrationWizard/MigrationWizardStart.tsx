import React, { useContext } from 'react';
import styles from './MigrationWizardStart.less';
import { Button } from '@trello/nachos/button';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardSteps } from './types';
import moment from 'moment';
import { forNamespace } from '@trello/i18n';

const format = forNamespace(['migration wizard']);

export const MigrationWizardStart: React.FC = () => {
  const { onNext, teamify } = useContext(MigrationWizardContext);

  let migrationDate;
  if (teamify?.autoMigration) {
    migrationDate = moment(teamify?.autoMigration).format('MMMM Do');
  }

  return (
    <div className={styles.container}>
      <img
        src={require('resources/images/migration-wizard/start-board-migration.png')}
        alt=""
        role="presentation"
        width="233"
        height="178"
      />
      <h1 className={styles.startMigrationTitle}>
        {format('simple-start-migration-title')}
      </h1>
      <p className={styles.startMigrationBody}>
        {format('simple-start-teams-are-workspaces')}
      </p>
      <Button
        appearance="primary"
        size="wide"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => onNext?.(MigrationWizardSteps.MOVE_YOUR_BOARDS)}
        testId={MigrationWizardTestIds.IntroStartButton}
      >
        {format('simple-start-migration-button')}
      </Button>
      <hr className={styles.line} />
      {migrationDate ? (
        <p className={styles.footerText}>
          {format('simple-start-migration-footer-with-date', { migrationDate })}
        </p>
      ) : (
        <p className={styles.footerText}>
          {format('simple-start-migration-footer-without-date')}
        </p>
      )}
    </div>
  );
};
