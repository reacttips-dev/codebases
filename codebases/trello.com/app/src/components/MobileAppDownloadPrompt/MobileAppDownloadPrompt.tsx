import React, { useState, useCallback } from 'react';
import Cookie from 'js-cookie';
import moment from 'moment';
import { TrelloStorage } from '@trello/storage';
import { forTemplate } from '@trello/i18n';
import styles from './MobileAppDownloadPrompt.less';
import { ButtonLink, Button } from '@trello/nachos/button';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { isAndroid, isIPhone, isIPod } from '@trello/browser';
import { CloseButton } from 'app/src/components/CloseButton';
import { CloseIcon } from '@trello/nachos/icons/close';

const format = forTemplate('mobile_app_download_prompt');

const IOS_LINK =
  'https://apps.apple.com/us/app/trello-organize-anything/id461504587';
const ANDROID_LINK = 'https://play.google.com/store/apps/details?id=com.trello';

const getShouldInitialRender = () => {
  const mobilePromptOverride =
    Cookie.get('force_mobileAppDownloadPrompt') === 'true';
  // Check to see if the mobile prompt has been closed within the last 24 hours
  // If it has been closed recently, we won't prompt again
  // If it hasn't, we can prompt
  const closedTimestamp = TrelloStorage.get('mobilePromptClosed');
  let isClosedRecently = false;
  if (closedTimestamp) {
    const closedTime = moment(closedTimestamp);
    isClosedRecently = moment().diff(closedTime, 'hours') < 24;
  }
  return (
    !isClosedRecently &&
    (isAndroid() || isIPhone() || isIPod() || mobilePromptOverride)
  );
};
const getPlatform = () => {
  const forcePlatform = Cookie.get('force_mobileAppDownloadPlatform');
  if (isIPhone() || isIPod() || forcePlatform === 'ios') {
    return 'ios';
  } else if (isAndroid() || forcePlatform === 'android') {
    return 'android';
  }
  return '';
};

const getPlatformLink = () => {
  const platform = getPlatform();
  if (platform === 'ios') {
    return IOS_LINK;
  } else if (platform === 'android') {
    return ANDROID_LINK;
  }
  return '';
};

export const MobileAppDownloadPrompt: React.FC = () => {
  const [isRendering, setIsRendering] = useState(getShouldInitialRender());

  const handleDismiss = useCallback(() => {
    Analytics.sendDismissedComponentEvent({
      componentType: 'banner',
      componentName: 'mobileAppDownloadPromptBanner',
      source: getScreenFromUrl(),
      attributes: {
        platform: getPlatform(),
      },
    });
    TrelloStorage.set('mobilePromptClosed', moment().valueOf());
    setIsRendering(false);
  }, []);

  const handleLinkClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'goToAppLink',
      source: 'mobileAppDownloadPromptBanner',
      attributes: {
        platform: getPlatform(),
      },
    });
  }, []);

  if (isRendering) {
    Analytics.sendViewedBannerEvent({
      bannerName: 'mobileAppDownloadPromptBanner',
      source: getScreenFromUrl(),
      attributes: {
        platform: getPlatform(),
      },
    });
    return (
      <div className={styles.mobilePrompt}>
        <CloseButton
          closeIcon={<CloseIcon />}
          className={styles.closeButton}
          medium={true}
          onClick={handleDismiss}
          type="button"
        />
        <div className={styles.contentContainer}>
          <h2>{format('headline')}</h2>
          <p>{format('subtitle')}</p>
          <ButtonLink
            link={getPlatformLink()}
            className={styles.appLink}
            isPrimary
            openInNewTab
            onClick={handleLinkClick}
          >
            {format('go-to-app')}
          </ButtonLink>
          <Button
            onClick={handleDismiss}
            className={styles.dismissButton}
            shouldFitContainer
          >
            {format('not-now')}
          </Button>
        </div>
      </div>
    );
  }
  return null;
};
