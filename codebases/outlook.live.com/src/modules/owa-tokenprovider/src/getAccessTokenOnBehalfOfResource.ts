import type AcquireTokenCallback from './schema/AcquireTokenCallback';
import acquireTokenFromAuthContext from './utils/acquireTokenFromAuthContext';
import { lazyCreateAdalAuthenticationContext } from 'owa-adal-angular';
import getAuthenticationUrl from './utils/getAuthenticationUrl';
import loginUserAndAcquireToken from './utils/loginUserAndAcquireToken';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export async function getAccessTokenOnBehalfOfResource(
    clientId: string,
    redirectUri: string,
    resource: string,
    authChallenge: string,
    allowConsentPrompt: boolean,
    getAccessTokenCallback: AcquireTokenCallback
): Promise<void> {
    const authUrl = await getAuthenticationUrl();
    const authContext = await lazyCreateAdalAuthenticationContext.importAndExecute(
        authUrl,
        clientId,
        redirectUri
    );
    const userConfiguration = getUserConfiguration();
    const userPrincipalName = userConfiguration.SessionSettings?.UserPrincipalName;
    const userEmail = userConfiguration.SessionSettings?.UserEmailAddress;
    authContext._user = {
        profile: {
            upn: userPrincipalName ? userPrincipalName : userEmail,
        },
    };

    const user = authContext.getCachedUser();
    if (user) {
        acquireTokenFromAuthContext(
            authContext,
            resource,
            authChallenge,
            allowConsentPrompt,
            getAccessTokenCallback
        );
    } else {
        loginUserAndAcquireToken(
            authContext,
            resource,
            authChallenge,
            allowConsentPrompt,
            getAccessTokenCallback
        );
    }
}
