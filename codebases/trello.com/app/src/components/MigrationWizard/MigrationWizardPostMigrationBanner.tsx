import React, { useContext, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from '@trello/nachos/button';
import { Banner } from 'app/src/components/Banner';
import { forNamespace } from '@trello/i18n';
import { Dialog } from 'app/src/components/Dialog';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardDialog } from './MigrationWizardDialog';
import { useMigratedBoards } from './useMigratedBoards';
import styles from './MigrationWizardPostMigrationBanner.less';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { DismissMessageKeys } from './constants';

const format = forNamespace(['migration wizard'], {
  shouldEscapeStrings: false,
});

interface MigrationWizardBannerProps {}

export const MigrationWizardPostMigrationBanner: React.FC<MigrationWizardBannerProps> = () => {
  const { dismissMessage, dialogProps, teamify } = useContext(
    MigrationWizardContext,
  );

  const { migrationOrg, loading: loadingMigratedBoards } = useMigratedBoards({
    idOrg: teamify?.idOrgCreated || teamify?.idOrgSelected || '',
  });

  const [isDismissed, setIsDismissed] = useState(false);

  const workspaceName = migrationOrg.displayName;
  const shouldRender = !isDismissed && !loadingMigratedBoards && workspaceName;

  useEffect(() => {
    if (shouldRender) {
      Analytics.sendViewedBannerEvent({
        bannerName: 'teamifyBanner',
        source: getScreenFromUrl(),
        attributes: {
          forcedMigration: 'post',
        },
      });
    }
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={styles.bannerWrapper}>
      <Banner inlinePadding textClassName={styles.banner}>
        <span className={styles.text}>
          {format('post-migration-banner-content', {
            workspaceName,
          })}

          <Button
            appearance="subtle-link"
            className={styles.selectionButton}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              window.open(
                'https://help.trello.com/article/1263-moving-to-workspaces',
                '_blank',
              );
            }}
          >
            {format('post-migration-banner-learn-more')}
          </Button>
        </span>

        <div className={styles.rightAligned}>
          <Button
            appearance="primary"
            className={styles.button}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => dialogProps.show()}
            testId={MigrationWizardTestIds.StartButton}
          >
            {format('post-migration-banner-make-changes')}
          </Button>

          <Button
            className={cx(styles.button, styles.dismissButton)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              setIsDismissed(true);
              dismissMessage(DismissMessageKeys.TidyUp);
            }}
            testId={MigrationWizardTestIds.DismissButton}
          >
            {format('post-migration-banner-dismiss')}
          </Button>
        </div>
      </Banner>

      <Dialog
        {...dialogProps}
        className={styles.dialog}
        closeOnEscape={false}
        closeOnOutsideClick={false}
      >
        <MigrationWizardDialog />
      </Dialog>
    </div>
  );
};
