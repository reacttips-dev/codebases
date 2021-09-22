import { getOwaCanaryCookie, getOwaCanaryDebugCookie } from './canary';
import type { HeadersWithoutIterator } from './RequestOptions';
import { getCookie } from 'owa-config';

export function setCanaryHeader(headers: HeadersWithoutIterator) {
    const canaryHeaders = getCanaryHeaders();
    Object.keys(canaryHeaders).forEach(key => {
        headers.set(key, canaryHeaders[key]);
    });
}

export function getCanaryHeaders(): { [key: string]: string } {
    const targetServer = getCookie('targetServer');
    const headers = {
        'X-OWA-CANARY': getOwaCanaryCookie(targetServer),
    };

    const owaCanaryDebugCookie = getOwaCanaryDebugCookie(targetServer);
    if (owaCanaryDebugCookie) {
        headers['X-OWA-CANARY-DEBUG'] = owaCanaryDebugCookie;
    }

    return headers;
}
