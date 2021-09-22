import type { ApiMethodCallback } from '../ApiMethod';
import {
    getAccessTokenOnBehalfOfAddin,
    saveSsoApiCallback,
    SsoErrorCode,
    getActiveSsoCallback,
} from 'owa-addins-sso';
import {
    getAddinCommandForControl,
    isAnyDialogOpen,
    isUserInstalledStoreAddin,
} from 'owa-addins-store';
import { createOsfErrorResult, createOsfSuccessResult } from './CreateOsfResult';
import isAddinSSOEnabled from '../../utils/isAddinSSOEnabled';
import isInvalidSSOResourceUrl from '../../utils/isInvalidSSOResourceUrl';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export interface GetAccessTokenApiMethodData {
    // auth Challenge contains claims used for doing MFA sign in
    authChallenge?: string;
    allowConsentPrompt?: boolean;
    forMSGraphAccess?: boolean;
    allowSignInPrompt?: boolean;
    SecurityOrigin?: string;
}

export default function getAccessTokenApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: GetAccessTokenApiMethodData,
    callback: ApiMethodCallback
) {
    if (isConsumer()) {
        callback(createOsfErrorResult(SsoErrorCode.SSOUnsupportedPlatform));
        return;
    }

    if (!isAddinSSOEnabled(controlId)) {
        callback(createOsfErrorResult(SsoErrorCode.NotSsoAgave));
        return;
    }

    if (getActiveSsoCallback()) {
        callback(createOsfErrorResult(SsoErrorCode.AddinIsAlreadyRequestingToken));
        return;
    }

    if (isAnyDialogOpen(hostItemIndex)) {
        callback(createOsfErrorResult(SsoErrorCode.InternalError));
        return;
    }

    if (isInvalidSSOResourceUrl(controlId, data.SecurityOrigin)) {
        callback(createOsfErrorResult(SsoErrorCode.InvalidResourceUrl));
        return;
    }

    let allowConsentPrompt = data.allowConsentPrompt;
    if (data.forMSGraphAccess) {
        const addinCommand = getAddinCommandForControl(controlId);
        if (isUserInstalledStoreAddin(addinCommand?.extension)) {
            // if addin is installed by user from store throw 13012 (SSOUnsupportedPlatform)
            callback(createOsfErrorResult(SsoErrorCode.SSOUnsupportedPlatform));
            return;
        } else {
            // don't bother user with a consent prompt that only grants profile access
            allowConsentPrompt = false;
        }
    }

    const ssoCallback = (error: SsoErrorCode, token?: string): void => {
        if (error) {
            callback(createOsfErrorResult(error));
        } else {
            callback(createOsfSuccessResult(token));
        }
    };

    saveSsoApiCallback(ssoCallback);

    getAccessTokenOnBehalfOfAddin(controlId, data.authChallenge, allowConsentPrompt);
}
