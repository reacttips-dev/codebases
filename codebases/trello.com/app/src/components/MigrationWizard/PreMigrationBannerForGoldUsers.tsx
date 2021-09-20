import React, { useContext, useEffect, useState, useCallback } from 'react';
import { getRouteIdFromPathname, isCardRoute } from '@trello/routes';
import { useLocation } from '@trello/router';
import { sendErrorEvent } from '@trello/error-reporting';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Feature } from 'app/scripts/debug/constants';
import { Button } from '@trello/nachos/button';
import { Banner } from 'app/src/components/Banner';
import { Dialog, useDialog } from 'app/src/components/Dialog';
import { forTemplate, localizeCount } from '@trello/i18n';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardGoldSunsetDialog } from './MigrationWizardGoldSunsetDialog';
import { useVeryHeavyUsageQuery } from './VeryHeavyUsageQuery.generated';
import { DismissMessageKeys } from './constants';
import styles from './PreMigrationBannerForGoldUsers.less';
import moment from 'moment';

const format = forTemplate('gold_sunset');

interface MigrationWizardBannerProps {}

export const PreMigrationBannerForGoldUsers: React.FC<MigrationWizardBannerProps> = () => {
  const { data, loading, error } = useVeryHeavyUsageQuery();
  const { teamify, dismissMessage } = useContext(MigrationWizardContext);
  const { dialogProps, show, hide } = useDialog({
    onHide: () => {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      setIsAutoShow(false);
      Analytics.sendClickedButtonEvent({
        buttonName: 'teamifyGoldUserCloseButton',
        source: 'teamifyGoldUserModal',
      });
    },
  });
  const { pathname } = useLocation();
  const [isAutoShow, setIsAutoShow] = useState(false);

  const [boardCount] = useState(
    (teamify?.soloTeamlessBoards || 0) +
      (teamify?.collaborativeTeamlessBoards || 0),
  );

  const autoMigration = teamify?.autoMigration;

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          file: 'PreMigrationBannerForGoldUsers.tsx',
        },
      });
    }
  }, [error]);

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: 'teamifyGoldUserBanner',
      source: getScreenFromUrl(),
      attributes: { boardCount },
    });
    // We don't want to send a track event every time the board count changes,
    // we only care about what the board count was the first time the user ever saw
    // this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasAlreadyAutoOpened = data?.member?.oneTimeMessagesDismissed?.includes(
    DismissMessageKeys.GoldUserWithTeamlessBoards,
  );

  useEffect(() => {
    // Auto-open the dialog if:
    if (
      // 1. We're not waiting for server requests
      !loading &&
      // 2. There were no errors loading data
      !error &&
      // 3. It's not already visible
      !dialogProps.isOpen &&
      // 4. We haven't already auto-opened once.
      !hasAlreadyAutoOpened &&
      // 5. The user is not on card back.
      !isCardRoute(getRouteIdFromPathname(pathname))
    ) {
      setIsAutoShow(true);
      show();
      dismissMessage(DismissMessageKeys.GoldUserWithTeamlessBoards);
    }
  }, [
    loading,
    error,
    dialogProps.isOpen,
    hasAlreadyAutoOpened,
    pathname,
    show,
    dismissMessage,
  ]);

  const openDialog = useCallback(() => {
    show();
    Analytics.sendClickedButtonEvent({
      buttonName: 'teamifyGoldUserLaunchButton',
      source: 'teamifyGoldUserBanner',
    });
  }, [show]);

  return (
    <div className={styles.bannerWrapper}>
      <Banner inlinePadding textClassName={styles.banner}>
        <span className={styles.text}>
          {autoMigration
            ? localizeCount('pre-migration banner with date', boardCount, {
                migrationDate: moment(autoMigration).format('LL'),
                boardCount,
              })
            : localizeCount('pre-migration banner without date', boardCount, {
                boardCount,
              })}{' '}
        </span>

        <Button
          appearance="primary"
          className={styles.button}
          onClick={openDialog}
        >
          {format('learn-more')}
        </Button>
      </Banner>
      <Dialog
        {...dialogProps}
        className={styles.dialog}
        closeOnEscape={false}
        closeOnOutsideClick={false}
      >
        <MigrationWizardGoldSunsetDialog close={hide} isAutoShow={isAutoShow} />
      </Dialog>
    </div>
  );
};
