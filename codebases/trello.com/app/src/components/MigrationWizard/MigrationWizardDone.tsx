import React, { useContext, useEffect } from 'react';
import styles from './MigrationWizardDone.less';
import { Button } from '@trello/nachos/button';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { MigrationWizardContext } from './MigrationWizardContext';
import { forNamespace } from '@trello/i18n';
import { navigate } from 'app/scripts/controller/navigate';
import { DismissMessageKeys } from './constants';

const format = forNamespace(['migration wizard']);

interface MigrationWizardDone {
  isComplexPath?: boolean;
}

export const MigrationWizardDone: React.FC<MigrationWizardDone> = ({
  isComplexPath,
}) => {
  const {
    hideWizard,
    orgId,
    checkEligibilityOnClose,
    dismissMessage,
    hasDismissedPostMigrationBanner,
  } = useContext(MigrationWizardContext);

  useEffect(() => {
    checkEligibilityOnClose();
    if (isComplexPath && !hasDismissedPostMigrationBanner) {
      dismissMessage(DismissMessageKeys.TidyUp);
    }
  }, [
    checkEligibilityOnClose,
    dismissMessage,
    isComplexPath,
    hasDismissedPostMigrationBanner,
  ]);

  return (
    <div className={styles.container}>
      <img
        src={require('resources/images/migration-wizard/simple-path-done.svg')}
        alt=""
        role="presentation"
      />
      <h1>{format('done-screen-title')}</h1>
      <p>{format('done-screen-body')}</p>
      <Button
        appearance="primary"
        size="wide"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          hideWizard();
          if (!isComplexPath) {
            navigate(`/${orgId}`, { trigger: true });
          }
        }}
        testId={MigrationWizardTestIds.DoneComponentDoneButton}
      >
        {format('done-screen-button')}
      </Button>
    </div>
  );
};
