import React from 'react';

import { PlatformBadge } from '../../PlatformBadge';
import { ADJUST_URL } from 'helpers/constants';
import serverRenderingUtils from '../../../../helpers/serverRenderingUtils';

import { AppStoreDownloadButton } from '../../../screens/QuicksilverAppScreen/components/AppStoreDownloadButton';

const APP_STORE_URL = `${ADJUST_URL}/dyvodl2?redirect=https%3A%2F%2Fapps.apple.com%2Fapp%2Fapple-store%2Fid1056182234`;
const PLAY_STORE_URL = `${ADJUST_URL}/ju55aik?redirect=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dfm.anchor.android`;
const MOBILE_APP_STORE_URL = `${ADJUST_URL}/t1g5iu3?redirect=https%3A%2F%2Fanchor.fm%2Fapp`;
const MOBILE_PLAY_STORE_URL = `${ADJUST_URL}/qohxi8g?redirect=https%3A%2F%2Fanchor.fm%2Fapp`;

import styled from '@emotion/styled';

export const MarketingAppButtons = ({
  clickEventLocation,
  clickEventSection,
  isRenderForMobileOnly,
  className,
}: {
  clickEventLocation: string;
  clickEventSection?: string;
  isRenderForMobileOnly?: boolean;
  className?: string;
}) => {
  const mobileButtons = (
    <AppStoreDownloadButton
      white
      width={162}
      clickEventLocation={clickEventLocation}
      clickEventSection={clickEventSection}
      appStoreUrl={MOBILE_APP_STORE_URL || APP_STORE_URL}
      playStoreUrl={PLAY_STORE_URL || MOBILE_PLAY_STORE_URL}
    />
  );
  const desktopButtons = (
    <>
      <DesktopContainer>
        <PlatformBadge
          url={APP_STORE_URL}
          platformName="apple"
          clickEventLocation={clickEventLocation}
          clickEventSection={clickEventSection}
        />
        <PlatformBadge
          url={PLAY_STORE_URL}
          platformName="google"
          clickEventLocation={clickEventLocation}
          clickEventSection={clickEventSection}
        />
      </DesktopContainer>
    </>
  );
  const isMobile =
    serverRenderingUtils.isIOS() || serverRenderingUtils.isAndroidChrome();

  if (isRenderForMobileOnly && !isMobile) {
    return null;
  }

  return (
    <AppButtonContainer className={className}>
      {isMobile ? mobileButtons : desktopButtons}
    </AppButtonContainer>
  );
};

const AppButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const DesktopContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  grid-gap: 20px;

  @media (max-width: 400px) {
    grid-auto-flow: row;
  }
`;
