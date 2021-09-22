import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';

import epic from 'bundles/epic/client';
import { ENROLL } from 'bundles/enroll/utils/enrollActionParams';
// @ts-ignore TS7016 TODO: onboardingUtils should be typed
import { setProfileCompleterCookieForExistingUsers } from 'bundles/onboarding-2018/utils/onboardingUtils';

/**
 * String that contains 6 digits.
 */
type MFA = string;

type LoginParams = {
  email: string;
  mfa?: MFA;
  password: string;
  redirectTo?: string;
  token: string;
};

// TODO(adrian): tmp solution
type LoginResponse = Record<string, unknown>;

type SignupParams = {
  email: string;
  name?: string;
  password: string;
  redirectTo?: string;
  token: string;
};

// TODO(adrian): tmp solution
type SignupResponse = Record<string, unknown>;

const api = API('', { type: 'rest' });

function redirect(url?: string): void;
function redirect(params?: Record<string, string>): void;
function redirect(input: string | Record<string, string> = {}): void {
  if (typeof input === 'string') {
    return window.location.replace(input);
  }

  const currentURI = window.location.href;

  const deconstructedURI = currentURI.split('/');

  const uriWithoutIndiaRegion = [
    ...deconstructedURI.slice(0, 3),
    deconstructedURI[3].replace('in?', '?'),
    ...deconstructedURI.slice(4),
  ].join('/');

  const URL = new URI(uriWithoutIndiaRegion);

  URL.deleteQueryParam('authMode');
  URL.deleteQueryParam('redirectTo');

  Object.entries(input).forEach(([key, value]) => URL.addQueryParam(key, value));

  if (window.location.href === URL.toString()) {
    return window.location.reload();
  }

  return window.location.replace(URL.toString());
}

export async function login({ email, mfa, password, redirectTo, token }: LoginParams): Promise<LoginResponse> {
  // Making this function async to avoid return Q.Promise
  return Q(
    api.post('api/login/v3', {
      data: {
        email,
        password,
        recaptchaToken: token,
        webrequest: true,
        ...(mfa && { code: mfa }),
        ...(redirectTo && { redirectTo }),
      },
    })
  );
}

export function onLogin(redirectTo?: string): void;
export function onLogin(redirectTo?: Record<string, string>): void;
export function onLogin(redirectTo?: any): void {
  const appDenylist = epic.get('GrowthDiscovery', 'onboardingModalAppNameDenylist');

  // So long as you're an applicable recipient of the rollout (not logging in from a place donated by the
  // denylist), add a cookie with short expiration date for use with onboarding modal.
  // This is to work in conjunction with the "Profile Completion Modal for Existing Users" experiment.
  // @ts-ignore FIXME does not recognize global window
  if (appDenylist && !appDenylist.includes(window.appName)) setProfileCompleterCookieForExistingUsers();

  redirect(redirectTo);
}

export async function signup(
  { email, name, password, redirectTo, token }: SignupParams,
  others: Record<string, unknown> = {}
): Promise<SignupResponse> {
  return Q(
    api.post('api/register/v1', {
      data: {
        email,
        name,
        password,
        recaptchaToken: token,
        verifyEmail: email,
        ...(redirectTo && { redirectTo }),
        ...others,
      },
    })
  );
}

export function onSignup(redirectTo?: string): void;
export function onSignup(redirectTo?: Record<string, string>): void;
export function onSignup(redirectTo?: any): void {
  const URL = new URI(window.location.href);

  // Specifically disallowing modal use on signup when enrollment or financial aid
  // is also included in the params. This prevents the traditional Onboarding flow from
  // complicating the usecase enabled by the enrollment flow for onboarding.
  // When the enrollment param is appended to the URL, we know that a user was attempting
  // to enroll before being prompted to signup. As such, we make sure that this param
  // isn't present before starting with any of the redirection strategies for Onboarding.
  const isEnrollmentFlow = URL.getQueryParamValue('action') === ENROLL;
  const isStudentUpswell = URL.getQueryParamValue('canContinue');
  const isFinaid = URL.getQueryParamValue('aid') === 'true';

  let shouldSeeNewOnboardingExperiment = false;
  const redirectOnboarding2021Url = new URI('/onboarding-2021/page-controls');

  let params = {};

  if (!(isEnrollmentFlow || isFinaid || isStudentUpswell)) {
    shouldSeeNewOnboardingExperiment = epic.get('GrowthDiscovery', 'useOnboarding2021Flow');
    params = { isNewUser: 'true', showOnboardingModal: '1' };
  }

  if (shouldSeeNewOnboardingExperiment) {
    redirect(redirectOnboarding2021Url.toString());
  } else {
    redirect(redirectTo || params);
  }
}
