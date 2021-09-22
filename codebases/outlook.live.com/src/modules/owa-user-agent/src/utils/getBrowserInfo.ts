import getUserAgentString from './getUserAgentString';

// Algorithm copied from Aria
export const enum Browser {
    MSIE = 'MSIE',
    CHROME = 'Chrome',
    FIREFOX = 'Firefox',
    SAFARI = 'Safari',
    EDGE = 'Edge',
    EDGE_CHROMIUM = 'Edge Anaheim',
    ELECTRON = 'Electron',
    SKYPE_SHELL = 'SkypeShell',
    PHANTOMJS = 'PhantomJS',
    OPERA = 'Opera',
    UNKNOWN = 'Unknown',
}

interface BrowserInfo {
    browser: Browser;
    browserVersion: number[];
}

let cachedValue: BrowserInfo | undefined;

export default function getBrowserInfo(): BrowserInfo {
    if (!cachedValue) {
        cachedValue = calculateBrowserInfo();
    }

    return cachedValue;
}

export function calculateBrowserInfo(): BrowserInfo {
    let browser: Browser = Browser.UNKNOWN;
    let browserVersion: number[] | undefined;
    const userAgentString = getUserAgentString();
    if (/OPR\//.test(userAgentString)) {
        browser = Browser.OPERA;
        browserVersion = getNonIEBrowserVersion(userAgentString, 'OPR');
    } else if (/PhantomJS/.test(userAgentString)) {
        browser = Browser.PHANTOMJS;
    } else if (/Edge/.test(userAgentString)) {
        browser = Browser.EDGE;
    } else if (/Edg/.test(userAgentString)) {
        browser = Browser.EDGE_CHROMIUM;
        browserVersion = getNonIEBrowserVersion(userAgentString, 'Edg');
    } else if (/Electron/.test(userAgentString)) {
        browser = Browser.ELECTRON;
    } else if (/Chrome/.test(userAgentString) || /CriOS/.test(userAgentString)) {
        browser = Browser.CHROME;
    } else if (/Trident/.test(userAgentString)) {
        browser = Browser.MSIE;
        browserVersion = getIEBrowserVersion(userAgentString);
    } else if (/Firefox/.test(userAgentString)) {
        browser = Browser.FIREFOX;
    } else if (/Safari/.test(userAgentString) || /AppleWebKit/.test(userAgentString)) {
        browser = Browser.SAFARI;
        browserVersion = getNonIEBrowserVersion(userAgentString, 'Version');
    } else if (/SkypeShell/.test(userAgentString)) {
        browser = Browser.SKYPE_SHELL;
    }

    return {
        browser,
        browserVersion: browserVersion || getNonIEBrowserVersion(userAgentString, browser),
    };
}

function getNonIEBrowserVersion(userAgentString: string, prefix: string): number[] {
    let match = userAgentString.match(new RegExp(prefix + '/([\\d,\\.]+)'));

    return !match ? [] : parseVersionString(match[1]);
}

function getIEBrowserVersion(userAgentString: string): number[] {
    let match = userAgentString.match(/MSIE ([\d,\.]+)/);
    if (match) {
        return parseVersionString(match[1]);
    }
    match = userAgentString.match(/rv:([\d,\.]+)/);
    return !match ? [] : parseVersionString(match[1]);
}

export function test_reset() {
    cachedValue = undefined;
}

function parseVersionString(version: string): number[] {
    return version.split(/[\.,]/).map(num => parseInt(num));
}
