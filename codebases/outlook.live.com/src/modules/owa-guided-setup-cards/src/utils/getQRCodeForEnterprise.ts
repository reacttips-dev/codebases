import { logUsage } from 'owa-analytics';
import { format } from 'owa-localize';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import {
    QRCodeUrlParams,
    initReponseHandler,
    getPopupWindowProps,
    getQRCodeUrl,
} from './qrCodeUtils';

/**
 * Idp url that will issue QR Code
 */
const AUTHORIZATION_URI = 'https://login.microsoftonline.com/{0}/oauth2/authorize';
/**
 * The reply address to redirect to
 */
const REDIRECT_URI = '/mail/oauthRedirect.html';
const RESPONSE_TYPE = 'none';
/**
 * The target app that will be redeeming the QR code token (Outlook Mobile App Id)
 */
const TARGET_CLIENT_ID = '27922004-5251-4030-b22d-91ecd9a37ea4';
/**
 * Indicates the app requesting QR Code (OWA App Id)
 */
const CLIENT_ID = '00000002-0000-0ff1-ce00-000000000000';
/**
 * Controls app branding and customizing some of the strings in the QR code page
 */
const COBRAND_ID = 'deb3f74a-ed5b-4ef1-8d3c-92b85dd47352';
/**
 * TODO: Remove the following 2 params (Slice and Data_center)
 * when AAD has rolled out the QR code to WW.
 */
const SLICE = 'TestSlice';
const DATA_CENTER = 'prod-wst-test1';
let winPopup;

export function displayQRCodeForEnterprise(onDismiss?: () => void) {
    initReponseHandler();
    if (winPopup?.close) {
        winPopup.close();
    }
    const params: QRCodeUrlParams = {
        client_id: CLIENT_ID,
        target_client_id: TARGET_CLIENT_ID,
        response_type: RESPONSE_TYPE,
        redirect_uri: format('{0}{1}', window.location.origin, REDIRECT_URI),
        cobrand_id: COBRAND_ID,
        authorization_uri: format(
            AUTHORIZATION_URI,
            getUserConfiguration().SessionSettings.ExternalDirectoryTenantGuid
        ),
        qrCode: true,
        slice: SLICE,
        dc: DATA_CENTER,
    };
    winPopup = window.open(getQRCodeUrl(params), '_blank', getPopupWindowProps());

    if (onDismiss) {
        winPopup.addEventListener('unload', function (event) {
            onDismiss();
        });
    }

    logUsage('QrCodeLoadForEnterprise', null, { isCore: true });
    if (winPopup?.focus) {
        winPopup.focus();
    }
}
