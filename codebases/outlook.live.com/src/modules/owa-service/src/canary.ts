import { getCookie } from 'owa-config';

export function getOwaCanaryCookieValue(targetServer?: string): string | null {
    let canaryCookie = getCookie(getOwaCanaryCookieName('X-OWA-CANARY', targetServer));
    const canaryCookieProd = getCookie(getOwaCanaryCookieName('X-OWA-CANARY-PRD', targetServer));
    const canaryCookieBlackForest = getCookie(
        getOwaCanaryCookieName('X-OWA-CANARY-BF', targetServer)
    );

    // we only cache the canary when we find one
    if (!canaryCookie || canaryCookie.length == 0) {
        return null;
    }

    if (canaryCookieProd && canaryCookieProd.length > 0) {
        canaryCookie += ',' + canaryCookieProd;
    }

    if (canaryCookieBlackForest && canaryCookieBlackForest.length > 0) {
        canaryCookie += ',' + canaryCookieBlackForest;
    }

    return canaryCookie;
}

export function getOwaCanaryCookie(targetServer?: string) {
    return getOwaCanaryCookieValue(targetServer) || 'X-OWA-CANARY_cookie_is_null_or_empty';
}

export function getOwaCanaryDebugCookie(targetServer: string | undefined) {
    return getCookie(getOwaCanaryCookieName('X-OWA-CANARY-DEBUG', targetServer));
}

export function getTargetServer() {
    return getCookie('targetServer');
}

function getOwaCanaryCookieName(prefix: string, serverRedirect: string | undefined): string {
    serverRedirect = serverRedirect || getTargetServer();
    return prefix + (serverRedirect ? '_' + serverRedirect.toLocaleLowerCase() : '');
}
