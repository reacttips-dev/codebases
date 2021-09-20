import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { isEmpty } from 'underscore';

import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { N0 } from '@trello/colors';

import { Banner } from 'app/src/components/Banner';
import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';

import { useAtlassianAutomaticMigrationBanner } from './useAtlassianAutomaticMigrationBanner';
import {
  AutoOnboardingOverlayManager,
  ScreenType,
} from './Overlays/AutoOnboardingOverlayManager';

import styles from './AtlassianAutomaticMigrationBanner.less';

const format = forNamespace(['aa onboarding', 'banner'], {
  shouldEscapeStrings: false,
});

const RightWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-right.svg');
const LeftWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-left.svg');

let analyticsContext = {};
let analyticsContainers = {};
const analyticsSource = 'atlassianAccountAutomaticOnboardingBanner';

export const forceOnboardingQuery = /[?&]forceOnboarding=true/i;

export interface AtlassianAccountMigrationBannerProps {
  forceShow: boolean;
}

export const AtlassianAutomaticMigrationBanner: FunctionComponent<AtlassianAccountMigrationBannerProps> = ({
  forceShow,
}) => {
  const [sentInitialAnalytics, setSentInitalAnalytics] = useState(false);
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const {
    me,
    screen,
    shouldRender,
    shouldRenderBanner,
    shouldRenderOverlay,
    shouldRenderConfirmation,
    setScreen,
    dismissOverlay,
  } = useAtlassianAutomaticMigrationBanner({ isOverlayOpen, forceShow });

  const ent = me && !isEmpty(me.enterprises) ? me.enterprises[0] : undefined;

  const closeOverlayImplicitly = useCallback(() => {
    setOverlayOpen(false);
    Analytics.sendClosedComponentEvent({
      attributes: analyticsContext,
      containers: analyticsContainers,
      source: analyticsSource,
      componentType: 'overlay',
      componentName: 'atlassianAccountOnboardingOverlay',
    });
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
    dismissOverlay();
  }, [dismissOverlay]);

  const onClickUpdateAccountFromBanner = useCallback(() => {
    setOverlayOpen(true);
    setScreen(ScreenType.UPDATE_ACCOUNT);
    Analytics.sendClickedButtonEvent({
      attributes: analyticsContext,
      containers: analyticsContainers,
      buttonName: 'atlassianAutomaticOnboardingUpdateAccountButton',
      source: analyticsSource,
    });
  }, [setScreen]);

  useEffect(() => {
    if (shouldRenderBanner || shouldRenderConfirmation) {
      setOverlayOpen(true);
    }
    if (shouldRenderBanner || !sentInitialAnalytics) {
      Analytics.sendViewedBannerEvent({
        attributes: analyticsContext,
        containers: analyticsContainers,
        source: 'atlassianAccountAutomaticOnboarding',
        bannerName: analyticsSource,
      });
      setSentInitalAnalytics(true);
    }
  }, [shouldRenderBanner, shouldRenderConfirmation, sentInitialAnalytics]);

  useEffect(() => {
    new Image().src = LeftWaveImageUrl;
    new Image().src = RightWaveImageUrl;
  }, []);

  // Ensure we have all the data necessary to render (none of our fields are null)
  if (!me || !shouldRender) {
    return null;
  }

  analyticsContext = {
    enterpriseId: ent?.id,
    emailCount: me?.logins.length,
    V2: true,
  };

  analyticsContainers = {
    enterpriseId: ent?.id,
  };

  // The success overlay should be returned without the banner
  if (
    !shouldRenderBanner &&
    (shouldRenderOverlay || shouldRenderConfirmation)
  ) {
    return isOverlayOpen ? (
      <Overlay
        background={OverlayBackground.LIGHT}
        onClose={closeOverlayImplicitly}
        alignment={OverlayAlignment.TOP}
      >
        <AutoOnboardingOverlayManager
          id={me?.id || ''}
          name={me?.fullName || ''}
          aaEmail={me?.email || ''}
          logins={me?.logins || []}
          oneTimeMessagesDismissed={me?.oneTimeMessagesDismissed || []}
          credentialsRemovedCount={me?.credentialsRemovedCount}
          orgName={ent?.displayName}
          dismiss={closeOverlay}
          screen={screen}
          setScreen={setScreen}
          analyticsContext={analyticsContext}
          analyticsContainers={analyticsContainers}
        />
      </Overlay>
    ) : null;
  }

  if (!shouldRenderBanner) {
    return null;
  }

  return (
    <div>
      <Banner
        bannerColor={N0}
        className={styles.banner}
        shadow
        roundedCorners
        alignCloseTop
      >
        <div className={styles.container}>
          <div className={styles.body}>
            <div className={styles.automaticOnboardingMsg}>
              <div>
                <span>
                  <b>{format('heads up')}</b> {format('update your account')}
                  {'.'}
                </span>
              </div>
              <div className={styles.controls}>
                <Button
                  appearance="primary"
                  size="wide"
                  onClick={onClickUpdateAccountFromBanner}
                >
                  {format('update')}
                </Button>
              </div>
            </div>
            {isOverlayOpen &&
              (shouldRenderOverlay || shouldRenderConfirmation) && (
                <Overlay
                  background={OverlayBackground.LIGHT}
                  onClose={closeOverlayImplicitly}
                  alignment={OverlayAlignment.TOP}
                >
                  <AutoOnboardingOverlayManager
                    id={me?.id || ''}
                    name={me?.fullName || ''}
                    aaEmail={me?.email || ''}
                    logins={me?.logins || []}
                    oneTimeMessagesDismissed={
                      me?.oneTimeMessagesDismissed || []
                    }
                    credentialsRemovedCount={me?.credentialsRemovedCount}
                    orgName={ent?.displayName}
                    dismiss={closeOverlay}
                    screen={screen}
                    setScreen={setScreen}
                    analyticsContext={analyticsContext}
                    analyticsContainers={analyticsContainers}
                  />
                </Overlay>
              )}
          </div>
        </div>
        <img
          alt=""
          src={LeftWaveImageUrl}
          className={classNames(styles.waveImg, styles.leftWaveImg)}
        />
        <img
          alt=""
          src={RightWaveImageUrl}
          className={classNames(styles.waveImg, styles.rightWaveImg)}
        />
      </Banner>
    </div>
  );
};
