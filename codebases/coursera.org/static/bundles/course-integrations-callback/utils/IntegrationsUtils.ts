// TODO: This really should be in a more generic integrations bundle, not the auth callback page.
import epicClient from 'bundles/epic/client';
import URI from 'jsuri';
import cookie from 'js/lib/cookie';
import type { IntegrationsStateValue, AuthorizationFlow } from 'bundles/course-integrations-callback/types';
import type { AuthorizationErrorPayload } from 'bundles/course-integrations-callback/actions/CourseIntegrationsActions';
import { AuthorizationFlows } from 'bundles/course-integrations-callback/constants';
import _t from 'i18n!nls/course-integrations-callback';

export const STATE_VALUE_LOCAL_STORAGE_KEY = 'stateValue';

export const sha256 = async (text?: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // This pattern, ('00' + x).slice(-2), ensures that should x be an empty string or only
  // one character long, the result will always be two characters with leading 0s.
  return hashArray.map((b) => ('00' + b.toString(16)).slice(-2)).join('');
};

export const loadSessionCookie = async (): Promise<string> => {
  const sessionCookie = cookie.get('__204u') ?? undefined;
  return sha256(sessionCookie);
};

// https://tools.coursera.org/epic/experiment/Gua8kEIfEeqGr-cZzTH5jQ
export const isIntegrationsPageEnabledForUser = (): boolean => {
  return epicClient.get('Authoring', 'isIntegrationsPageEnabledForUser');
};

// https://tools.coursera.org/epic/experiment/IhJ2UBs2EemMCB_e9rhSsg
export const isIntegrationsPageEnabledForCourse = (courseId: string) => {
  const integrationsPageCourseIds = epicClient.get('Authoring', 'integrationsPageCourseIds') || [];
  return integrationsPageCourseIds.includes(courseId);
};

export const isIntegrationsPageEnabled = (courseId: string): boolean => {
  return isIntegrationsPageEnabledForUser() || isIntegrationsPageEnabledForCourse(courseId);
};

export const openNewTab = async (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const newWindow = window.open(url, '_blank');

    if (newWindow) {
      let intervalId = 0;

      // I know this is a bit strange, but it was the only way I could reliably detect
      // the closure of new windows regardless of target domain. I tried
      // - newWindow.onclose
      // - newWindow.onbeforeunload
      // - newWindow.onunload
      // None of them worked.
      const checkWindowClosed = () => {
        if (newWindow.closed) {
          clearInterval(intervalId);
          intervalId = 0;
          resolve();
        }
      };
      intervalId = window.setInterval(checkWindowClosed, 50);
    }
  });
};

/**
 * Encodes the given state value and stores it in local storage. Returns the encoded state value string.
 */
export const saveStateValue = async (stateValue: IntegrationsStateValue): Promise<string> => {
  const encodedStateJson = btoa(JSON.stringify(stateValue));
  window.localStorage.setItem(STATE_VALUE_LOCAL_STORAGE_KEY, encodedStateJson);
  return encodedStateJson;
};

/**
 * Loads and returns the encoded state value from local storage. This must return
 * the encoded state value, because that value is compared against the encoded
 * state value from the oauth provider.
 */
export const loadStateValue = (): string | null => {
  // Code that starts an authorization flow must first save a `IntegrationsStateValue` object
  // to localStorage[STATE_VALUE_LOCAL_STORAGE_KEY] so we can identify what flow to execute
  // and any contextual information that's necessary to execute that flow.
  //
  // Each auth flow is responsible for removing this value from localStorage after it is used,
  // using `deleteStoredStateValue`.
  return window.localStorage.getItem(STATE_VALUE_LOCAL_STORAGE_KEY);
};

/**
 * The logic of deleting the stored stateValue is abstracted from callers so we can
 * easily change how this feature works in the future.
 */
export const deleteStoredStateValue = async (): Promise<boolean> => {
  window.localStorage.removeItem(STATE_VALUE_LOCAL_STORAGE_KEY);
  // This function should return false if it was unable to delete the stateValue.
  // For now, it is guaranteed to succeed.
  return true;
};

/**
 * Returns the encoded state value string.
 */
export const openNewTabWithSavedState = async (url: string, stateValue: IntegrationsStateValue): Promise<void> => {
  const encodedStateValue = await saveStateValue(stateValue);
  // Add our encoded state value to the query string, which will end up in our oauthcallback app
  // after the user authenticates with GitHub.
  const uri = new URI(url).addQueryParam('state', encodedStateValue);
  return openNewTab(uri.toString());
};

export const getInvalidStateValueErrorTitle = (
  storedStateValue: string | null,
  apiStateValue: string | null
): string => {
  if (String(storedStateValue || '').trim() === '') {
    return _t('Empty Local State Value');
  } else if (String(apiStateValue || '').trim() === '') {
    return _t('Empty API State Value');
  } else {
    return _t('Invalid State Value');
  }
};

export const createAuthorizationStateErrorPayload = (
  storedStateValue: string | null,
  apiStateValue: string | null
): AuthorizationErrorPayload => ({
  info: _t('An error occurred during authorization.'),
  title: getInvalidStateValueErrorTitle(storedStateValue, apiStateValue),
  errorMessage: _t('Unable to verify authorization state.'),
});

export const getErrorInformation = (authorizationFlow?: AuthorizationFlow | null): string => {
  switch (authorizationFlow) {
    case AuthorizationFlows.ConnectIntegration:
      return _t('Sorry, we weren’t able to connect your GitHub organization to Coursera.');
    case AuthorizationFlows.Git.LaunchRepoAsGrader:
    case AuthorizationFlows.Git.LaunchRepoAsLearner:
      return _t('Sorry, we were unable to authenticate with GitHub.');
    default:
      return _t('Sorry, an unknown error has occurred.');
  }
};

export const getRetryButtonText = (authorizationFlow?: AuthorizationFlow | null): string => {
  switch (authorizationFlow) {
    case AuthorizationFlows.ConnectIntegration:
      return _t('Start Over');
    default:
      return _t('Try Again');
  }
};
