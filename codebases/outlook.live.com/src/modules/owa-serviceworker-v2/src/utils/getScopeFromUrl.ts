import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

const vdirToSourceMaping: { [vdir: string]: ServiceWorkerSource } = {
    mail: 'mail',
    calendar: 'mail',
    files: 'mail',
    opx: 'Opx',
};

export default function getScopeFromUrl(url: URL): ServiceWorkerSource | null {
    const path = url.pathname.toLowerCase();
    if (path.indexOf('/owa') == 0) {
        return null;
    }

    const pathParts = path.split('/').filter(p => p);
    const vdir = pathParts[0];

    // mini-edge-extension URL comes with a queryParam
    if (url.search.indexOf('isExtension') > -1) {
        return 'miniExtension';
    }

    // the opxs can be in the format of
    // mail/opxdeeplink or
    // mail/user@contoso.com/opxdeeplink
    // we also want to make sure we are not requesting a file so we will check if the last part has a '.'
    if (
        (pathParts[1] == 'opxdeeplink' || pathParts[2] == 'opxdeeplink') &&
        pathParts[pathParts.length - 1].indexOf('.') == -1
    ) {
        return vdir == 'calendar' ? 'calendarDeepOpx' : null;
    }

    if (
        url.search?.indexOf('popoutv2') > -1 &&
        (pathParts[1] == 'deeplink' || pathParts[2] == 'deeplink') &&
        pathParts[pathParts.length - 1].indexOf('.') == -1 &&
        vdirToSourceMaping[vdir]
    ) {
        return vdirToSourceMaping[vdir];
    }

    if (
        path.indexOf('.') != -1 ||
        pathParts[1] == 'opx' ||
        pathParts[1] == 'deeplink' ||
        path.indexOf('@') != -1
    ) {
        return null;
    }

    return vdirToSourceMaping[vdir] || null;
}
