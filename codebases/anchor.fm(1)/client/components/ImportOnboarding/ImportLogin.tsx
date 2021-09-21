/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { css as cssClassName } from 'emotion';
import React, { useState } from 'react';
import { trackEvent } from '../../modules/analytics';

import { CarrotIcon } from '../../shared/Icon/components/CarrotIcon';
import Text from '../../shared/Text';
import { MENU_MODE } from '../../user';
import { LoginContainer } from '../LoginContainer';
import RequestResetPasswordConfirmationContainer from '../RequestResetPasswordConfirmationContainer';
import RequestResetPasswordContainer from '../RequestResetPasswordContainer';
import { ImportAgreement } from './ImportAgreement';
import {
  Overlay,
  OverlayContent,
  OverlayHeader,
  OverlayHeaderSection,
  OverlayWrapper,
  Wrapper,
} from './styles';
import { SwitchToAnchorHero } from './SwitchToAnchorHero';
import { Step } from './types';

type Props = {
  onboarding: {
    rssFeed: string;
    rssFeedMetadata: {
      image: string;
      authorName: string;
    };
  };
  stationId: string;
  userId: number;
  menuMode: string;
  history: {
    push: (url: string) => void;
  };
  actions: {
    redirectToSwitchPage: () => void;
    resetPersistedState: () => void;
  };
};

export const ImportLogin = ({
  onboarding,
  stationId,
  userId,
  menuMode,
  history,
  actions,
}: Props) => {
  const {
    rssFeed,
    rssFeedMetadata: { image, authorName },
  } = onboarding;

  const [loginSuccess, setLoginSuccess] = useState(false);

  // redirect away when the user refreshes the page or logs out
  if (!rssFeed || (loginSuccess && !userId)) {
    actions.redirectToSwitchPage();
    return null;
  }

  return (
    <Wrapper>
      <SwitchToAnchorHero imageSrc={image} authorName={authorName} />
      <OverlayWrapper>
        <Overlay>
          <OverlayHeaderSection>
            <OverlayHeader>Log in to Anchor</OverlayHeader>
            <div
              css={css`
                text-align: center;
              `}
            >
              <Text
                size="md"
                isInline={true}
                isBold={true}
                color={loginSuccess ? '#a0a0a0' : '#15171a'}
              >
                Log in
              </Text>
              <CarrotIcon
                className={cssClassName`width: 5px; margin: 0 5px;`}
              />
              <Text
                size="md"
                isInline={true}
                isBold={true}
                color={loginSuccess ? '#15171a' : '#a0a0a0'}
              >
                Import podcast
              </Text>
            </div>
          </OverlayHeaderSection>
          <OverlayContent>
            {loginSuccess ? (
              <ImportAgreement
                stationId={stationId}
                userId={userId}
                feedUrl={rssFeed}
                previousStep={Step.LOGIN}
                history={history}
                resetPersistedState={actions.resetPersistedState}
              />
            ) : (
              <div
                css={css`
                  text-align: center;
                  p {
                    margin-top: 16px;
                  }
                `}
              >
                {menuMode === MENU_MODE.LOGIN && (
                  <LoginContainer
                    feedUrl={rssFeed}
                    signupUrl="/switch/signup"
                    loginCallback={() => {
                      setLoginSuccess(true);
                      trackEvent(
                        'importing_ux_log_in_success',
                        { type: 'email' },
                        // @ts-ignore
                        { providers: [mParticle] }
                      );
                    }}
                    shouldRedirectToDashboard={false}
                  />
                )}
                {menuMode === MENU_MODE.REQUEST_RESET_PASSWORD && (
                  <RequestResetPasswordContainer />
                )}
                {menuMode === MENU_MODE.REQUEST_RESET_PASSWORD_CONFIRMATION && (
                  <RequestResetPasswordConfirmationContainer />
                )}
              </div>
            )}
          </OverlayContent>
        </Overlay>
      </OverlayWrapper>
    </Wrapper>
  );
};
