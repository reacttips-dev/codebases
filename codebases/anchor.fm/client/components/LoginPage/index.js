import React from 'react';
import { Link } from 'react-router-dom';
import { MENU_MODE } from '../../user';
import { LoginContainer } from '../LoginContainer';
import RequestResetPasswordContainer from '../RequestResetPasswordContainer';
import RequestResetPasswordConfirmationContainer from '../RequestResetPasswordConfirmationContainer';
import {
  Wrapper,
  OverlayWrapper,
  Overlay,
  OverlayHeaderSection,
  OverlayContent,
  SwitchToAnchor,
} from '../ImportOnboarding/styles';
import {
  SwitchToAnchorOverrideCSS,
  Header1,
  Header2,
  Header3,
  Paragraph,
  OverlayOverrideCSS,
} from './styles';
import { useCsrfToken } from '../../hooks/useCsrfToken';
import { useCurrentUserCtx } from '../../contexts/CurrentUser';

export function LoginPage({ menuMode, feedUrl }) {
  const { fetchCurrentUser } = useCurrentUserCtx();
  const { csrfToken } = useCsrfToken();
  return (
    <Wrapper>
      <SwitchToAnchor className={SwitchToAnchorOverrideCSS}>
        <Header2>Welcome back to Anchor</Header2>
        <Header3>
          Free hosting, automatic distribution, easy monetization.{' '}
        </Header3>
      </SwitchToAnchor>
      <OverlayWrapper>
        <Overlay className={OverlayOverrideCSS}>
          <OverlayHeaderSection>
            <Header1>Log in</Header1>
            <Paragraph>
              Don{`'`}t have an account?{' '}
              <Link data-cy="signUpLink" to="/signup">
                Sign up
              </Link>{' '}
              instead.
            </Paragraph>
          </OverlayHeaderSection>
          <OverlayContent>
            {menuMode === MENU_MODE.LOGIN && (
              <LoginContainer
                feedUrl={feedUrl}
                showSignUp={false}
                csrfToken={csrfToken}
                loginCallback={() => {
                  fetchCurrentUser();
                }}
              />
            )}
            {menuMode === MENU_MODE.REQUEST_RESET_PASSWORD && (
              <RequestResetPasswordContainer />
            )}
            {menuMode === MENU_MODE.REQUEST_RESET_PASSWORD_CONFIRMATION && (
              <RequestResetPasswordConfirmationContainer />
            )}
          </OverlayContent>
        </Overlay>
      </OverlayWrapper>
    </Wrapper>
  );
}
