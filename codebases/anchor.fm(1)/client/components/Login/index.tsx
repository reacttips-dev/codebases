import { isValidEmail } from 'client/user';
import { css } from 'emotion';
import queryString from 'query-string';
import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import serverRenderingUtils from 'helpers/serverRenderingUtils';
import { useScript } from 'hooks/useScript';
import { Button } from 'shared/Button/NewButton';
import { OptimizelyContext } from '@optimizely/react-sdk';
import { AccessibleErrorContainer } from '../AccessibleErrorContainer';
import { AppleIcon } from '../AppleIcon';
import { FacebookIcon } from '../FacebookIcon';
import { FieldInput } from '../FieldInput';
import { GoogleIcon } from '../GoogleIcon';
import OutboundLink from '../OutboundLink';
import { TwitterIcon } from '../TwitterIcon';
import events from './events';
import {
  ButtonWrapper,
  ErrorAlert,
  FieldWrapper,
  TextButton,
  LoginFormWrapper,
  SocialLoginContainer,
  SocialSignInBorderCSS,
} from './styles';

type FormData = {
  email: string;
  password: string;
};

type Props = {
  clickRequestResetPassword: () => void;
  error: string;
  onSubmit: (data: FormData) => Promise<void>;
  submitting: boolean;
  showHelpLinks?: boolean;
  showSocialLogin?: boolean;
  feedUrl: string;
  signupUrl: string;
  showSignUp?: boolean;
};

// Global var for the Sign In With Apple API
declare let AppleID: any;

function getAppleAuthError() {
  if (serverRenderingUtils.windowUndefined()) return null;
  const { authappleerror } = queryString.parse(window.location.search);
  return authappleerror;
}

function buildQueryString(params: { [key: string]: string }) {
  const queryParams = Object.entries(params).filter(([key, value]) => !!value);
  const searchParamsString = new URLSearchParams(queryParams).toString();
  return searchParamsString ? `?${searchParamsString}` : '';
}

export function Login({
  onSubmit,
  showHelpLinks = true,
  showSocialLogin = true,
  signupUrl,
  showSignUp = true,
  clickRequestResetPassword,
  feedUrl: feedUrlString,
}: Props) {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm();
  const [formError, setFormError] = useState<ReactNode>(null);

  const { optimizely } = useContext(OptimizelyContext);
  const isOptimizelyReady = optimizely?.isReady;
  const optimizelyUserId = optimizely?.user.id || '';
  const feedUrl = feedUrlString ? encodeURIComponent(feedUrlString) : '';
  const queryParams = {
    feedUrl,
    optimizelyUserId, // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
  };
  const [urlQuery, setUrlQuery] = useState(() => buildQueryString(queryParams));
  const [appleIdHasLoaded, setAppleIdHasLoaded] = useState(false);

  useEffect(() => {
    // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-429: Remove Optimizely Logic in Pub-Web after Age Gating Experiment
    // Ensure optimizelyUserId is added to the urlQuery when available
    if (optimizely && isOptimizelyReady && !optimizelyUserId) {
      const removeUserListener = optimizely.onUserUpdate(() => {
        const userId = optimizely.user.id;
        if (userId) {
          setUrlQuery(
            buildQueryString({
              feedUrl,
              optimizelyUserId: userId,
            })
          );
        }
      });

      // Remove listener on cleanup
      return () => {
        removeUserListener();
      };
    }
    return () => {};
  }, [feedUrl, isOptimizelyReady, optimizely, optimizelyUserId]);

  const authTwitterUrl = `/auth/twitter${urlQuery}`;
  const authFacebookUrl = `/login/facebook${urlQuery}`;
  const authGoogleUrl = `/login/google${urlQuery}`;
  const authAppleError = getAppleAuthError();

  useScript(
    'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
    () => {
      const redirectURI = new URL(
        '/auth/apple/callback',
        serverRenderingUtils.getBaseUrl()
      );
      AppleID.auth.init({
        clientId: 'com.anchorfminc.anchor.siwa',
        scope: 'name email',
        redirectURI: redirectURI.href,
        state: urlQuery ? JSON.stringify(queryParams) : '',
      });
      setAppleIdHasLoaded(true);
    }
  );

  useEffect(() => {
    if (authAppleError) {
      setFormError(
        'There was a problem logging you in. Please try again from this device.'
      );
    }
  }, [authAppleError]);

  const onValid = (data: FormData) => {
    setFormError(null);
    onSubmit(data).catch(({ message }) => {
      switch (message) {
        case '401':
          setFormError('Invalid username or password.');
          break;
        case '403':
          setFormError(
            <span>
              This account has been disabled.{' '}
              <a href="https://help.anchor.fm/hc/en-us">Contact us</a> if you’d
              like to enable it.
            </span>
          );
          break;
        case '429':
          setFormError('Please try again later.');
          break;
        default:
          setFormError(
            'There was a problem logging you in. Please try again from this device.'
          );
      }
    });
  };

  return (
    <LoginFormWrapper>
      <form
        onSubmit={handleSubmit(onValid)}
        id="LoginForm"
        method="POST"
        noValidate={true}
      >
        <FieldWrapper>
          <FieldInput
            {...register('email', {
              required: 'Email is required',
              validate: email => isValidEmail(email) || 'Email is invalid',
            })}
            error={errors.email}
            placeholder="Email"
            type="email"
            aria-label="email"
          />
        </FieldWrapper>
        <FieldWrapper>
          <FieldInput
            {...register('password', {
              required: 'Password is required',
            })}
            error={errors.password}
            placeholder="Password"
            type="password"
            aria-label="password"
          />
        </FieldWrapper>
        {formError && (
          <AccessibleErrorContainer>
            <ErrorAlert>{formError}</ErrorAlert>
          </AccessibleErrorContainer>
        )}
        <ButtonWrapper>
          <Button
            className={css`
              width: 100%;
            `}
            isDisabled={isSubmitting}
            type="submit"
            color="purple"
          >
            Log in
          </Button>
        </ButtonWrapper>
      </form>
      {showHelpLinks && (
        <TextButton onClick={clickRequestResetPassword}>
          Forgot password?
        </TextButton>
      )}
      {showSocialLogin && (
        <div aria-label="socialLoginOptions">
          <p
            id="socialLoginOptions"
            className={css`
              margin-bottom: 12px;
            `}
          >
            Or log in with:
          </p>
          <SocialLoginContainer>
            <li>
              <OutboundLink
                onClick={events.trackSocialClick}
                to={authFacebookUrl}
                className={css`
                  ${SocialSignInBorderCSS}
                  color: #39579b;
                `}
                aria-label="Sign in with Facebook"
              >
                <FacebookIcon width={18} height={18} />
              </OutboundLink>
            </li>
            <li>
              <OutboundLink
                onClick={events.trackSocialClick}
                to={authGoogleUrl}
                className={css`
                  ${SocialSignInBorderCSS}
                  color: #8c8c8c;
                `}
                aria-label="Sign in with Google"
              >
                <GoogleIcon width={18} height={18} />
              </OutboundLink>
            </li>
            <li>
              <OutboundLink
                onClick={events.trackSocialClick}
                to={authTwitterUrl}
                className={css`
                  ${SocialSignInBorderCSS}
                  color: #50abf1;
                `}
                aria-label="Sign in with Twitter"
              >
                <TwitterIcon width={22} height={18} />
              </OutboundLink>
            </li>
            {appleIdHasLoaded && (
              <li>
                <button
                  onClick={() => {
                    events.trackSocialClick();
                    AppleID.auth.signIn();
                  }}
                  className={SocialSignInBorderCSS}
                  aria-label="Sign in with Apple"
                >
                  <AppleIcon
                    style={{ marginTop: '-4px' }}
                    width={24}
                    height={24}
                  />
                </button>
              </li>
            )}
          </SocialLoginContainer>
        </div>
      )}
      {showHelpLinks && (
        <div
          className={css`
            text-align: center;
          `}
        >
          {showSignUp && (
            <p>
              Don’t have an account?{' '}
              <Link to={signupUrl || `/signup${urlQuery}`}>Sign up</Link>{' '}
              instead.
            </p>
          )}
        </div>
      )}
    </LoginFormWrapper>
  );
}
