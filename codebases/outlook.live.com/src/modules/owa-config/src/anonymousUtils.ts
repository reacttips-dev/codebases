import { getQueryStringParameters } from 'owa-querystring';
import { getCookie } from './universalCookies';

export function isAnonymousUser() {
    const defaultAnchorMailbox = getCookie('DefaultAnchorMailbox');
    return (
        defaultAnchorMailbox == null ||
        defaultAnchorMailbox.trim().length == 0 ||
        hasAnonymousRetryParam()
    );
}

export function hasAnonymousParam() {
    const queryStringValues = getQueryStringParameters(window.location);
    return Object.keys(queryStringValues).indexOf('anonymous') >= 0;
}

export function hasAnonymousRetryParam() {
    const queryStringValues = getQueryStringParameters(window.location);
    return Object.keys(queryStringValues).indexOf('anonRetry') >= 0;
}
