/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { getRouteIdFromPathname, isCardRoute } from '@trello/routes';
import { useLocation } from '@trello/router';
import { sendErrorEvent } from '@trello/error-reporting';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Feature } from 'app/scripts/debug/constants';
import { Button } from '@trello/nachos/button';
import { Banner } from 'app/src/components/Banner';
import { Dialog, useDialog } from 'app/src/components/Dialog';
import { forNamespace } from '@trello/i18n';
import { MigrationWizardContext } from './MigrationWizardContext';
import { MigrationWizardVeryHeavyUsageDialog } from './MigrationWizardVeryHeavyUsageDialog';
import { useVeryHeavyUsageQuery } from './VeryHeavyUsageQuery.generated';
import { DismissMessageKeys } from './constants';
import styles from './MigrationWizardVeryHeavyUsageBanner.less';

const format = forNamespace(['migration wizard']);

interface MigrationWizardBannerProps {}

export const MigrationWizardVeryHeavyUsageBanner: React.FC<MigrationWizardBannerProps> = () => {
  const { data, loading, error } = useVeryHeavyUsageQuery();
  const { teamify, dismissMessage } = useContext(MigrationWizardContext);
  const { dialogProps, show, hide } = useDialog({
    onHide: () => {
      setIsAutoShow(false);
      Analytics.sendClickedButtonEvent({
        buttonName: 'teamifyVeryHeavyUsageCloseButton',
        source: 'teamifyVeryHeavyUsageModal',
      });
    },
  });
  const { pathname } = useLocation();
  const [isAutoShow, setIsAutoShow] = useState(false);

  const [boardCount] = useState(
    (teamify?.soloTeamlessBoards || 0) +
      (teamify?.collaborativeTeamlessBoards || 0),
  );

  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          file: 'MigrationWizardVeryHeavyUsageBanner.tsx',
        },
      });
    }
  }, [error]);

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: 'teamifyVeryHeavyUsageBanner',
      source: getScreenFromUrl(),
      attributes: { boardCount },
    });
    // We don't want to send a track event every time the board count changes,
    // we only care about what the board count was the first time the user ever saw
    // this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasAlreadyAutoOpened = data?.member?.oneTimeMessagesDismissed?.includes(
    DismissMessageKeys.VeryHeavyUsage,
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
      dismissMessage(DismissMessageKeys.VeryHeavyUsage);
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
      buttonName: 'teamifyVeryHeavyUsageLaunchButton',
      source: 'teamifyVeryHeavyUsageBanner',
    });
  }, [show]);

  return (
    <div className={styles.bannerWrapper}>
      <Banner inlinePadding textClassName={styles.banner}>
        <span className={styles.text}>
          {format('very-heavy-usage-banner', { boardCount })}
        </span>

        <Button
          appearance="primary"
          className={styles.button}
          onClick={openDialog}
        >
          {format('very-heavy-usage-banner-learn-more')}
        </Button>
      </Banner>

      <Dialog
        {...dialogProps}
        className={styles.dialog}
        closeOnEscape={false}
        closeOnOutsideClick={false}
      >
        <MigrationWizardVeryHeavyUsageDialog
          close={hide}
          isAutoShow={isAutoShow}
        />
      </Dialog>
    </div>
  );
};
