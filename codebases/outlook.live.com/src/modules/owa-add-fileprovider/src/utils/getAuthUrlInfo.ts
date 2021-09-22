import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import generateRandomCSRFToken from './generateRandomCSRFToken';
import { getOrigin } from 'owa-url';
import { isTdsBox } from 'owa-config';

function addUrlParameter(url: string, key: string, value: string): string {
    if (!url || !key || !value) {
        throw new Error('Key and Value parameters should not be null');
    }

    if (url.indexOf('?') > 0) {
        return `${url}&${key}=${value}`;
    } else {
        return `${url}?${key}=${value}`;
    }
}

export const AUTH_REDIRECT_URL_BASE = isTdsBox()
    ? 'https://exchangelabs.live-int.com/owa'
    : 'https://outlook.office.com/owa';

export function getAuthRedirectPageUrl(providerType?: AttachmentDataProviderType) {
    const getParams = providerType ? encodeURIComponent(`?provider=${providerType}`) : '';
    const htmlPage =
        providerType && providerType === AttachmentDataProviderType.Facebook
            ? 'AddFacebookFileProvider.html'
            : 'AddFileProvider.html';
    return `${getOrigin()}/mail/${htmlPage}${getParams}`;
}

export function getAuthRedirectPageUrlThroughAdpRedirect(providerType: AttachmentDataProviderType) {
    const forwardToUrl = `${getOrigin()}/mail/AddFileProvider.html`;
    const getParams = encodeURIComponent(`provider=${providerType}&url=${forwardToUrl}`);

    return `${AUTH_REDIRECT_URL_BASE}/ADPRedirect.aspx?${getParams}`;
}

export interface AddableProviderAuthUrlInfo {
    authUrl: string;
    redirectUrl: string;
    csrfToken: string;
}

export function getAuthUrlInfoFunc(
    providerType: AttachmentDataProviderType,
    baseAuthUrl: string,
    redirectUrl: string,
    providerAppId: string,
    responseType: string,
    urlGetParams: (csrfToken: string) => { [key: string]: string }
) {
    return () => {
        const csrfToken = generateRandomCSRFToken();

        let authUrl = addUrlParameter(baseAuthUrl, 'client_id', providerAppId);
        authUrl = addUrlParameter(authUrl, 'redirect_uri', redirectUrl);
        authUrl = addUrlParameter(authUrl, 'response_type', responseType);

        if (urlGetParams) {
            const getParams = urlGetParams(csrfToken);
            authUrl = Object.keys(getParams).reduce(
                (newUrl, key) => addUrlParameter(newUrl, key, getParams[key]),
                authUrl
            );
        }

        return {
            authUrl: authUrl,
            redirectUrl: redirectUrl,
            csrfToken: csrfToken,
        };
    };
}
