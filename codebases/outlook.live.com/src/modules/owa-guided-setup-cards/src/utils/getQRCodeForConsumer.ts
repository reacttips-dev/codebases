import { isFeatureEnabled } from 'owa-feature-flags';
import { logUsage } from 'owa-analytics';
import { getCurrentCulture } from 'owa-localize';
import {
    QRCodeUrlParams,
    initReponseHandler,
    getPopupWindowProps,
    getQRCodeUrl,
} from './qrCodeUtils';

/**
 * Idp url that will issue QR Code
 */
const AUTHORIZATION_URI = 'https://login.live.com/getQRcode.srf';
/**
 * The reply address to redirect to
 */
const REDIRECT_URI = '/mail/oauthRedirect.html';
/**
 * The target app that will be redeeming the QR code token (Outlook Mobile App Id)
 */
const TARGET_CLIENT_ID = '0000000048170EF2';
/**
 * The app requesting QR Code (OWA app Id)
 */
const CLIENT_ID = '00000000000477e9';
/**
 * scopes for which this code is issued
 */
const SCOPE = 'service::outlook.com::MBI_SSL';
/**
 * Controls app branding and customizing some of the strings in the QR code page
 */
const COBRAND_ID = '1e360405-d045-40c1-ad47-34f5d0129655';
let popup;

export function displayQRCodeForConsumer(onDismiss?: () => void) {
    if (isFeatureEnabled('auth-enableQRCode')) {
        initReponseHandler();
        if (popup?.close) {
            popup.close();
        }
        const params: QRCodeUrlParams = {
            client_id: CLIENT_ID,
            scope: SCOPE,
            target_client_id: TARGET_CLIENT_ID,
            redirect_uri: window.location.origin + REDIRECT_URI,
            mkt: getCurrentCulture(),
            cobrand_id: COBRAND_ID,
            authorization_uri: AUTHORIZATION_URI,
        };
        popup = window.open(getQRCodeUrl(params), '_blank', getPopupWindowProps());

        if (onDismiss) {
            popup.addEventListener('unload', function (event) {
                onDismiss();
            });
        }

        logUsage('QrCodeLoad', null, { isCore: true });
        if (popup?.focus) {
            popup.focus();
        }
    }
}
