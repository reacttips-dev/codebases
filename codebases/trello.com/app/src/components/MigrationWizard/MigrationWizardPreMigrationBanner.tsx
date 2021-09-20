import moment from 'moment';
import { Button } from '@trello/nachos/button';
import { Banner } from 'app/src/components/Banner';
import { forNamespace } from '@trello/i18n';
import { Dialog } from 'app/src/components/Dialog';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardDialog } from './MigrationWizardDialog';
import React, { useContext, useEffect } from 'react';
import styles from './MigrationWizardPreMigrationBanner.less';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';

const format = forNamespace(['migration wizard']);

interface MigrationWizardBannerProps {}

export const MigrationWizardPreMigrationBanner: React.FC<MigrationWizardBannerProps> = () => {
  const { dialogProps, teamify } = useContext(MigrationWizardContext);

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: 'teamifyBanner',
      source: getScreenFromUrl(),
      attributes: {
        forcedMigration: 'pre',
      },
    });
  }, []);

  const migrationDate =
    !!teamify?.autoMigration &&
    moment(teamify?.autoMigration).format('MMMM Do');

  return (
    <div
      data-test-id={MigrationWizardTestIds.PreMigrationBanner}
      className={styles.bannerWrapper}
    >
      <Banner inlinePadding textClassName={styles.banner}>
        <span className={styles.text}>
          {migrationDate
            ? format('pre-migration-banner-with-date', { migrationDate })
            : format('pre-migration-banner-without-date')}
        </span>

        <Button
          appearance="primary"
          className={styles.button}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            dialogProps.show();
          }}
          testId={MigrationWizardTestIds.StartButton}
        >
          {format('pre-migration-banner-button')}
        </Button>
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
