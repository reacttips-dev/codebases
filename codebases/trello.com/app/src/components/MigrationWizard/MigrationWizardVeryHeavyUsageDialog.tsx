import React, { useEffect } from 'react';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import styles from './MigrationWizardVeryHeavyUsageDialog.less';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';

const format = forNamespace(['migration wizard']);

interface MigrationWizardVeryHeavyUsageDialog {
  close: () => void;
  isAutoShow: boolean;
}

export const MigrationWizardVeryHeavyUsageDialog: React.FC<MigrationWizardVeryHeavyUsageDialog> = ({
  close,
  isAutoShow,
}) => {
  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'overlay',
      componentName: 'teamifyVeryHeavyUsageModal',
      source: getScreenFromUrl(),
      attributes: { autoLaunch: isAutoShow },
    });
  }, [isAutoShow]);

  return (
    <div className={styles.container}>
      <img
        className={styles.headerImage}
        src={require('resources/images/migration-wizard/start-board-migration.png')}
        alt=""
        role="presentation"
      />
      <h1 className={styles.title}>
        {format('very-heavy-usage-dialog-add-your-boards-soon')}
      </h1>

      <p className={styles.body}>
        {format('very-heavy-usage-dialog-previously-known-as-teams')}
      </p>

      <div className={styles.explanation}>
        <img
          alt=""
          className={styles.featureIcon}
          src={require('resources/images/teamify/BCIcon.svg')}
        />
        <p>
          <b>{format('very-heavy-usage-dialog-start-with-a-free-trial')}</b>
          <br />
          {format('very-heavy-usage-dialog-free-workspaces-can')}
        </p>
      </div>

      <div className={styles.explanation}>
        <img
          alt=""
          className={styles.featureIcon}
          src={require('resources/images/teamify/lockIcon.svg')}
        />
        <p>
          <b>{format('very-heavy-usage-dialog-board-privacy')}</b>
          <br />
          {format('very-heavy-usage-dialog-current-board-members')}
        </p>
      </div>

      <Button
        appearance="primary"
        size="wide"
        onClick={close}
        className={styles.cta}
      >
        {format('very-heavy-usage-dialog-got-it')}
      </Button>
    </div>
  );
};
