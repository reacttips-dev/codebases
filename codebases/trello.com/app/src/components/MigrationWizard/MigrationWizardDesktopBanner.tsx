import React, { useContext } from 'react';
import moment from 'moment';
import { Button } from '@trello/nachos/button';
import { Banner } from 'app/src/components/Banner';
import { forNamespace } from '@trello/i18n';
import { MigrationWizardTestIds } from '@trello/test-ids';
import { MigrationWizardContext } from './MigrationWizardContext';
import styles from './MigrationWizardDesktopBanner.less';

const format = forNamespace(['migration wizard']);

interface MigrationWizardBannerProps {}

export const MigrationWizardDesktopBanner: React.FC<MigrationWizardBannerProps> = () => {
  const { teamify } = useContext(MigrationWizardContext);

  return (
    <>
      <Banner inlinePadding textClassName={styles.banner}>
        <span className={styles.text}>
          {!!teamify?.autoMigration &&
            format('desktop-banner', {
              migrationDate: moment(teamify?.autoMigration).format('MMMM Do'),
            })}
        </span>

        <Button
          appearance="primary"
          className={styles.button}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            window.open(`/`, '_blank');
          }}
          testId={MigrationWizardTestIds.StartButton}
        >
          {format('desktop-banner-button')}
        </Button>
      </Banner>
    </>
  );
};
