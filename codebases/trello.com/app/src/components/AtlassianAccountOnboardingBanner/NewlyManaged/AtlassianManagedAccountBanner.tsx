import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import classNames from 'classnames';
import _ from 'underscore';
import { forNamespace } from '@trello/i18n';

import { Banner } from 'app/src/components/Banner';
import { Button } from '@trello/nachos/button';
import styles from './AtlassianManagedAccountBanner.less';
import { N0 } from '@trello/colors';
import {
  Overlay,
  OverlayAlignment,
  OverlayBackground,
} from 'app/src/components/Overlay';

import { useAtlassianManagedAccountBanner } from './useAtlassianManagedAccountBanner';
import { AtlassianManagedAccountOverlay } from './AtlassianManagedAccountOverlay';
import { Analytics } from '@trello/atlassian-analytics';

const format = forNamespace(['aa onboarding', 'banner'], {
  shouldEscapeStrings: false,
});

const RightWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-right.svg');
const LeftWaveImageUrl = require('resources/images/onboarding-banner/banner-wave-left.svg');

let analyticsContext = {};
let analyticsContainers = {};

export const AtlassianManagedAccountBanner: FunctionComponent = () => {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const { me, shouldRender } = useAtlassianManagedAccountBanner();

  const ent = me && !_.isEmpty(me.enterprises) ? me.enterprises[0] : undefined;

  const closeOverlayImplicitly = useCallback(() => {
    setOverlayOpen(false);
    Analytics.sendClosedComponentEvent({
      attributes: analyticsContext,
      containers: analyticsContainers,
      source: 'atlassianManagedAccountBanner',
      componentType: 'overlay',
      componentName: 'atlassianManagedAccountOverlay',
    });
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayOpen(false);
  }, []);

  const onDisplayBanner = useCallback(() => {
    Analytics.sendViewedBannerEvent({
      attributes: analyticsContext,
      containers: analyticsContainers,
      source: 'atlassianManagedAccountBanner',
      bannerName: 'atlassianManagedAccountBanner',
    });
  }, []);

  const onShowManagedAccount = useCallback(() => {
    setOverlayOpen(true);
  }, []);

  const onClickLearnMoreFromBanner = useCallback(() => {
    onShowManagedAccount();
    Analytics.sendClickedButtonEvent({
      attributes: analyticsContext,
      containers: analyticsContainers,
      buttonName: 'atlassianManagedAccountLearnMoreButton',
      source: 'atlassianManagedAccountBanner',
    });
  }, [onShowManagedAccount]);

  useEffect(() => {
    new Image().src = LeftWaveImageUrl;
    new Image().src = RightWaveImageUrl;

    onDisplayBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure we have all the data necessary to render (none of our fields are null)
  if (!shouldRender) {
    return null;
  }

  analyticsContext = {
    enterpriseId: ent?.id,
  };

  analyticsContainers = {
    enterpriseId: ent?.id,
  };

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
            <div className={styles.managedAccountMsg}>
              <div>
                <span>
                  <b>{format('heads up')}</b>
                  <> </>
                  {format('managed by', { orgName: ent?.displayName })}
                </span>
              </div>
              <div className={styles.controls}>
                <Button
                  appearance="primary"
                  size="wide"
                  onClick={onClickLearnMoreFromBanner}
                >
                  {format('learn more')}
                </Button>
              </div>
            </div>
            {isOverlayOpen && (
              <Overlay
                background={OverlayBackground.LIGHT}
                onClose={closeOverlayImplicitly}
                alignment={OverlayAlignment.TOP}
              >
                <AtlassianManagedAccountOverlay
                  id={me?.id || ''}
                  name={me?.fullName || ''}
                  orgName={ent?.displayName}
                  isOverlayOpen={isOverlayOpen}
                  dismiss={closeOverlay}
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
