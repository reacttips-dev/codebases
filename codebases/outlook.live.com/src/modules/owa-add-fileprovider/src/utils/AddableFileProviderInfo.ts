import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getFileProviderCreationInfo from '../services/getFileProviderCreationInfo';
import type GetNewAttachmentDataProviderCreationInfoResponse from 'owa-service/lib/contract/GetNewAttachmentDataProviderCreationInfoResponse';
import getWopiFileProviderCreationInfo from '../services/getWopiFileProviderCreationInfo';
import type GetAttachmentDataProviderCreatorResponse from 'owa-service/lib/contract/GetAttachmentDataProviderCreatorResponse';
import type WopiAttachmentDataProviderCreator from 'owa-service/lib/contract/WopiAttachmentDataProviderCreator';
import {
    AddableProviderAuthUrlInfo,
    AUTH_REDIRECT_URL_BASE,
    getAuthRedirectPageUrl,
    getAuthRedirectPageUrlThroughAdpRedirect,
    getAuthUrlInfoFunc,
} from './getAuthUrlInfo';
import isAttachmentDataProviderTypeEnabled from './isAttachmentDataProviderTypeEnabled';

const CODE_AUTH_RESPONSE_TYPE = 'code';
const TOKEN_AUTH_RESPONSE_TYPE = 'token';
const ASYNC_INITIALIZE_RETRY_TIMEOUT_IN_MS = 3000;
const ASYNC_INITIALIZE_RETRY_NUMBER = 3;

interface AddableFileProviderInfo {
    providerType: AttachmentDataProviderType;
    getAuthUrlInfo: () => AddableProviderAuthUrlInfo;
    getCSRFToken: (urlParameters: any) => string;
    getOAuthCode: (urlParameters: any) => string;
}
export default AddableFileProviderInfo;

function defaultGetParams(csrfToken: string) {
    return { state: csrfToken };
}
function defaultGetCSRFToken(urlParameters: any) {
    return urlParameters.state;
}
function defaultGetOAuthCode(urlParameters: any) {
    return urlParameters.code;
}

async function asyncInitializeAddableFileProviderInfo(
    providerType: AttachmentDataProviderType,
    info: AddableFileProviderInfo,
    baseAuthUrl: string,
    redirectUrl: string,
    authResponseType: string,
    authUrlGetParams: (csrfToken: string) => { [key: string]: string },
    retryCount: number
): Promise<void> {
    // Do any async intialization here

    try {
        let providerAppKey: string;

        if (
            providerType === AttachmentDataProviderType.WopiBox ||
            providerType === AttachmentDataProviderType.WopiDropbox ||
            providerType === AttachmentDataProviderType.WopiEgnyte
        ) {
            // Use a different web service to retrieve Wopi provider's information.
            const response: GetAttachmentDataProviderCreatorResponse = await getWopiFileProviderCreationInfo(
                providerType
            );
            providerAppKey = response.AttachmentDataProviderCreator.ProviderAppKey;
            baseAuthUrl = (response.AttachmentDataProviderCreator as WopiAttachmentDataProviderCreator)
                .AuthorizationUri;
        } else {
            // Get the creation info for the provider and then create a function that provides the authentication info
            const response: GetNewAttachmentDataProviderCreationInfoResponse = await getFileProviderCreationInfo(
                providerType
            );
            providerAppKey = response.ProviderAppKey;
        }

        info.getAuthUrlInfo = getAuthUrlInfoFunc(
            providerType,
            baseAuthUrl,
            redirectUrl,
            providerAppKey,
            authResponseType,
            authUrlGetParams
        );
    } catch (error) {
        if (retryCount > 0) {
            // In case of any failure we try again in a while
            setTimeout(
                () =>
                    asyncInitializeAddableFileProviderInfo(
                        providerType,
                        info,
                        baseAuthUrl,
                        redirectUrl,
                        authResponseType,
                        authUrlGetParams,
                        --retryCount
                    ),
                ASYNC_INITIALIZE_RETRY_TIMEOUT_IN_MS
            );
        }
    }
}

export function createAddableFileProviderInfo(
    providerType: AttachmentDataProviderType,
    baseAuthUrl: string,
    redirectUrl: string,
    authResponseType: string,
    authUrlGetParams?: (csrfToken: string) => { [key: string]: string }
): AddableFileProviderInfo {
    const addableFileProviderInfo: AddableFileProviderInfo = {
        providerType: providerType,
        getAuthUrlInfo: null,
        getCSRFToken: defaultGetCSRFToken,
        getOAuthCode: defaultGetOAuthCode,
    };

    // As there is some info that needs to be initialize based on the service call
    // so we initialize that asynchronously
    asyncInitializeAddableFileProviderInfo(
        providerType,
        addableFileProviderInfo,
        baseAuthUrl,
        redirectUrl,
        authResponseType,
        authUrlGetParams,
        ASYNC_INITIALIZE_RETRY_NUMBER
    );

    return addableFileProviderInfo;
}

/**
 * The reason we lazy initialize the addableFileProviderInfoMap is that the strings might not be available when the module is executed as
 * they are lazy initialized as well
 */
let addableFileProviderInfoMap: { [key: number]: AddableFileProviderInfo } = null;
function getAddableFileProviderInfoMap() {
    if (!addableFileProviderInfoMap) {
        // NOTE: Do not use spread operator to initialize from createAddableFileProviderInfo as we do lazy initialization
        // so the map should contain the same instance of object created by createAddableFileProviderInfo
        addableFileProviderInfoMap = {};

        // Box provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.Box)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.Box
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.Box,
                'https://app.box.com/api/oauth2/authorize',
                getAuthRedirectPageUrlThroughAdpRedirect(AttachmentDataProviderType.Box),
                CODE_AUTH_RESPONSE_TYPE,
                defaultGetParams
            );
        }

        // Dropbox provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.Dropbox)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.Dropbox
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.Dropbox,
                'https://www.dropbox.com/oauth2/authorize',
                getAuthRedirectPageUrl(AttachmentDataProviderType.Dropbox),
                CODE_AUTH_RESPONSE_TYPE,
                defaultGetParams
            );
        }

        // Facebook provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.Facebook)) {
            const facebookAddableProviderInfo = createAddableFileProviderInfo(
                AttachmentDataProviderType.Facebook,
                'https://www.facebook.com/dialog/oauth',
                getAuthRedirectPageUrl(AttachmentDataProviderType.Facebook),
                TOKEN_AUTH_RESPONSE_TYPE,
                csrfToken => {
                    return {
                        state: csrfToken,
                        scope: 'user_photos,email',
                    };
                }
            );
            facebookAddableProviderInfo.getCSRFToken = defaultGetCSRFToken;
            facebookAddableProviderInfo.getOAuthCode = (urlParameters: any) =>
                urlParameters.access_token;
            addableFileProviderInfoMap[
                AttachmentDataProviderType.Facebook
            ] = facebookAddableProviderInfo;
        }

        // GDrive provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.GDrive)) {
            const gDriveAddableProviderInfo = createAddableFileProviderInfo(
                AttachmentDataProviderType.GDrive,
                'https://accounts.google.com/o/oauth2/auth',
                `${AUTH_REDIRECT_URL_BASE}/ADPRedirect.aspx`,
                CODE_AUTH_RESPONSE_TYPE,
                csrfToken => {
                    const state = {
                        state: csrfToken,
                        provider: AttachmentDataProviderType.GDrive.toString(),
                        url: getAuthRedirectPageUrl(),
                    };

                    return {
                        state: JSON.stringify(state),
                        scope: 'https://www.googleapis.com/auth/drive',
                        access_type: 'offline',
                        prompt: 'consent',
                        include_granted_scopes: 'true',
                    };
                }
            );
            gDriveAddableProviderInfo.getCSRFToken = (urlParameters: any) => {
                const stateDict: any = JSON.parse(urlParameters.state);
                return stateDict.state;
            };
            addableFileProviderInfoMap[
                AttachmentDataProviderType.GDrive
            ] = gDriveAddableProviderInfo;
        }

        // OneDriveConsumer provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.OneDriveConsumer)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.OneDriveConsumer
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.OneDriveConsumer,
                'https://login.live.com/oauth20_authorize.srf',
                getAuthRedirectPageUrlThroughAdpRedirect(
                    AttachmentDataProviderType.OneDriveConsumer
                ),
                CODE_AUTH_RESPONSE_TYPE,
                csrfToken => {
                    return {
                        state: csrfToken,
                        scope: 'wl.basic onedrive.readwrite wl.offline_access',
                    };
                }
            );
        }

        // WopiBox provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.WopiBox)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.WopiBox
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.WopiBox,
                '', // AuthorizationUri will be retrieved from WOPI bootstrap call
                getAuthRedirectPageUrlThroughAdpRedirect(AttachmentDataProviderType.WopiBox),
                CODE_AUTH_RESPONSE_TYPE,
                defaultGetParams
            );
        }

        // WopiEgnyte provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.WopiEgnyte)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.WopiEgnyte
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.WopiEgnyte,
                '', // AuthorizationUri will be retrieved from WOPI bootstrap call
                getAuthRedirectPageUrlThroughAdpRedirect(AttachmentDataProviderType.WopiEgnyte),
                CODE_AUTH_RESPONSE_TYPE,
                defaultGetParams
            );
        }

        // WopiDropbox provider
        if (isAttachmentDataProviderTypeEnabled(AttachmentDataProviderType.WopiDropbox)) {
            addableFileProviderInfoMap[
                AttachmentDataProviderType.WopiDropbox
            ] = createAddableFileProviderInfo(
                AttachmentDataProviderType.WopiDropbox,
                '', // AuthorizationUri will be retrieved from WOPI bootstrap call
                getAuthRedirectPageUrlThroughAdpRedirect(AttachmentDataProviderType.WopiDropbox),
                CODE_AUTH_RESPONSE_TYPE,
                defaultGetParams
            );
        }
    }

    return addableFileProviderInfoMap;
}

export function getAddableFileProviderInfo(
    providerType: AttachmentDataProviderType
): AddableFileProviderInfo {
    const addableFileProviderInfoMap = getAddableFileProviderInfoMap();
    if (providerType in addableFileProviderInfoMap) {
        return addableFileProviderInfoMap[providerType];
    }

    return null;
}
