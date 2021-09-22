import type AcquireTokenCallback from '../schema/AcquireTokenCallback';
import type AuthenticationContext from 'adal-angular';
import { aquireTokenAfterLogin } from './acquireTokenAfterLogin';

const ADAL_IFRAME_NAME: string = 'adalIdTokenFrame';

interface MyWindow extends Window {
    //please keep this name in sync with ExtSSO.aspx in utah
    detectUserCachedCallback: (loginError: string, idToken: string) => void;
}

declare var window: MyWindow;

export default function loginUserAndAcquireToken(
    authContext: AuthenticationContext,
    resource: string,
    authChallenge: string,
    allowConsentPrompt: boolean,
    getAccessTokenCallback: AcquireTokenCallback
): void {
    authContext.config.displayCall = function (url: string) {
        validateUrl(url);

        window.detectUserCachedCallback = aquireTokenAfterLogin(
            authContext,
            resource,
            authChallenge,
            allowConsentPrompt,
            getAccessTokenCallback
        );

        loadAdalFrame(authContext, url);
    };
    authContext.login();
}

function validateUrl(url: string) {
    if (url.indexOf('?') == -1) {
        throw new Error('Invalid Url in Adal Auth Context Display Call');
    }
}

function loadAdalFrame(authContext: AuthenticationContext, url: string) {
    var frameHandle = authContext._addAdalFrame(ADAL_IFRAME_NAME);
    frameHandle.src = 'about:blank';
    authContext._loadFrame(url + '&prompt=none', ADAL_IFRAME_NAME);
}
