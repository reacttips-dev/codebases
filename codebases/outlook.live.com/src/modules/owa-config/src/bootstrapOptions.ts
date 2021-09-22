import { isGulpOrBranchingValue, hasQueryStringParameter } from 'owa-querystring';
import { getDefaultCdnSettings, getDefaultCdnUrl } from './defaultCdnSettings';
import { findMetatag } from 'owa-metatags';

export let firstApp: string | undefined;
export function setFirstApp(app: string) {
    if (!firstApp) {
        firstApp = app;
    }
}

let overrideApp: string;
export function setApp(app: string) {
    overrideApp = app;
    setFirstApp(app);
}

let overrideBaseUrl: string;
export function setOverrideBaseUrls(baseUrl: string) {
    overrideBaseUrl = baseUrl;
}

export function getApp() {
    return overrideApp;
}

export function getClientVersion() {
    return getMetatagValue('scriptVer');
}

export function getCdnUrl(): string {
    const url = getMetatagValue('cdnUrl');
    if (isUrlPresent(url)) {
        return url;
    }

    return getDefaultCdnUrl();
}

export function getBackupCdnUrl(): string {
    const url = getMetatagValue('backupCdnUrl');
    if (isUrlPresent(url)) {
        return url;
    }

    return getDefaultCdnUrl(true);
}

export function getPackageBaseUrl(): string {
    if (overrideBaseUrl) {
        return overrideBaseUrl;
    }

    const cdnUrl = getMetatagValue('cdnUrl');
    const cdnContainer = getMetatagValue('cdnContainer');
    const devCdnUrl = getMetatagValue('devCdnUrl');

    if (isUrlPresent(devCdnUrl)) {
        return devCdnUrl;
    }

    if (isUrlPresent(cdnUrl) && isUrlPresent(cdnContainer)) {
        return cdnUrl + cdnContainer + getClientVersion() + '/';
    }

    return addVersionToPath(getDefaultCdnSettings().PackageBaseUrl);
}

export function getScriptPath(): string {
    return addProtocol(getPackageBaseUrl() + getScriptRelativePath());
}

export function getResourcePath(): string {
    return addProtocol(`${getPackageBaseUrl()}resources/`);
}

export function getScriptBackupPath(): string {
    if (overrideBaseUrl) {
        return overrideBaseUrl;
    }

    const backupCdnUrl = getMetatagValue('backupCdnUrl');
    const cdnContainer = getMetatagValue('cdnContainer');

    // Make sure the meta tag in the index page is getting replaced by owa-web-server.
    // If it is not, then we will use the hard coded value
    let url = addVersionToPath(getDefaultCdnSettings().BackupBaseUrl);

    if (isUrlPresent(backupCdnUrl) && isUrlPresent(cdnContainer)) {
        url = backupCdnUrl + cdnContainer + getClientVersion() + '/';
    }

    return addProtocol(url) + getScriptRelativePath();
}

export function isUrlPresent(url: string) {
    return url && url.indexOf('/') > -1;
}

function getScriptRelativePath() {
    const scriptPath = getMetatagValue('scriptPath');
    return isUrlPresent(scriptPath) ? scriptPath : getDefaultCdnSettings().ScriptPath;
}

const protocol = window.location?.protocol || 'https:';
const protocolRegExp = new RegExp('^https?:');
export function addProtocol(url: string) {
    // Only add the protocol if we don't already have one
    if (!protocolRegExp.test(url)) {
        url = protocol + url;
    }

    return url;
}

function getMetatagValue(tag: string): string {
    return findMetatag(tag) || '';
}

function addVersionToPath(base: string): string {
    let version = isGulpOrBranchingValue
        ? ''
        : getClientVersion() + '/' + (hasQueryStringParameter('debugJs') ? 'debug/' : '');
    return base + version;
}
