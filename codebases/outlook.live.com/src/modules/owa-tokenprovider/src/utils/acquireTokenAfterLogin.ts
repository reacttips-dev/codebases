import type AcquireTokenCallback from '../schema/AcquireTokenCallback';
import acquireTokenFromAuthContext from './acquireTokenFromAuthContext';
import type AuthenticationContext from 'adal-angular';

export let aquireTokenAfterLogin = (
    authContext: AuthenticationContext,
    resource: string,
    authChallenge: string,
    allowConsentPrompt: boolean,
    getAccessTokenCallback: AcquireTokenCallback
) => (loginError: string | null, idToken: string | null): void => {
    if (loginError || !idToken) {
        getAccessTokenCallback(loginError, null /* token */);
    } else {
        authContext.getCachedUser();
        acquireTokenFromAuthContext(
            authContext,
            resource,
            authChallenge,
            allowConsentPrompt,
            getAccessTokenCallback
        );
    }
};
