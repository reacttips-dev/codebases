import { getLinkElementOrigin, getLocationOrigin } from './utils';
export function normalizeUrl(url) {
    return buildUrl(url, getLocationOrigin()).href;
}
export function isValidUrl(url) {
    try {
        return !!buildUrl(url);
    }
    catch (_a) {
        return false;
    }
}
export function haveSameOrigin(url1, url2) {
    return getOrigin(url1) === getOrigin(url2);
}
export function getOrigin(url) {
    return getLinkElementOrigin(buildUrl(url));
}
export function getPathName(url) {
    var pathname = buildUrl(url).pathname;
    return pathname[0] === '/' ? pathname : "/" + pathname;
}
export function getSearch(url) {
    return buildUrl(url).search;
}
export function getHash(url) {
    return buildUrl(url).hash;
}
export function buildUrl(url, base) {
    if (checkURLSupported()) {
        return base !== undefined ? new URL(url, base) : new URL(url);
    }
    if (base === undefined && !/:/.test(url)) {
        throw new Error("Invalid URL: '" + url + "'");
    }
    var doc = document;
    var anchorElement = doc.createElement('a');
    if (base !== undefined) {
        doc = document.implementation.createHTMLDocument('');
        var baseElement = doc.createElement('base');
        baseElement.href = base;
        doc.head.appendChild(baseElement);
        doc.body.appendChild(anchorElement);
    }
    anchorElement.href = url;
    return anchorElement;
}
var isURLSupported;
function checkURLSupported() {
    if (isURLSupported !== undefined) {
        return isURLSupported;
    }
    try {
        var url = new URL('http://test/path');
        isURLSupported = url.href === 'http://test/path';
        return isURLSupported;
    }
    catch (_a) {
        isURLSupported = false;
    }
    return isURLSupported;
}
//# sourceMappingURL=urlPolyfill.js.map