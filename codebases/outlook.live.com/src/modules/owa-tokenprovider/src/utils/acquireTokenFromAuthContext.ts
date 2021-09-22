import type AcquireTokenCallback from '../schema/AcquireTokenCallback';
import type AuthenticationContext from 'adal-angular';
import AdalErrorCode from '../schema/AdalErrorCode';

export default function acquireTokenFromAuthContext(
    authContext: AuthenticationContext,
    resource: string,
    authChallenge: string,
    allowConsentPrompt: boolean,
    getAccessTokenCallback: AcquireTokenCallback
): void {
    if (authChallenge) {
        authContext.acquireTokenPopup(
            resource,
            null /* extraParameters */,
            authChallenge,
            getAccessTokenCallback
        );
    } else {
        authContext.acquireToken(resource, function (error, token) {
            if (shouldTryAcquireTokenPopup(error, allowConsentPrompt)) {
                authContext.acquireTokenPopup(
                    resource,
                    null /* extraParameters */,
                    null,
                    getAccessTokenCallback
                );
            } else {
                getAccessTokenCallback(error, token);
            }
        });
    }
}

function shouldTryAcquireTokenPopup(error: string, allowConsentPrompt: boolean): boolean {
    if (!error) {
        return false;
    }
    if (error.indexOf(AdalErrorCode.NoUserLogin) >= 0) {
        // This is to handle no user signed in error (13001) in incognito.
        return true;
    }
    if (error.indexOf(AdalErrorCode.NoPreAuth) >= 0 && allowConsentPrompt) {
        // Failed to get access token silently and allowConsentPrompt is true and error is about missing consent
        return true;
    }

    return false;
}
