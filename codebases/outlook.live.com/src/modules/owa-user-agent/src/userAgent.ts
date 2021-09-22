import getBrowserInfo, { Browser } from './utils/getBrowserInfo';
import getOsInfo, { OperatingSystem } from './utils/getOsInfo';

export function isMac(): boolean {
    return getOsInfo().os == OperatingSystem.MACOSX;
}

export function isWindows(): boolean {
    return getOsInfo().os === OperatingSystem.WINDOWS;
}

export function isLinux(): boolean {
    return getOsInfo().os === OperatingSystem.LINUX;
}

export function isWinXp(): boolean {
    return getOsInfo().os === OperatingSystem.WINDOWS && getOsInfo().osVersion === 'XP';
}

export function isWin10(): boolean {
    return getOsInfo().os === OperatingSystem.WINDOWS && getOsInfo().osVersion === '10';
}

export function isChromiumOs(): boolean {
    return getOsInfo().os == OperatingSystem.CHROMIUMOS;
}

export function isAndroidOs(): boolean {
    return getOsInfo().os == OperatingSystem.ANDROID;
}

export function isIOs(): boolean {
    return getOsInfo().os == OperatingSystem.IOS;
}

export function isBrowserIE(): boolean {
    return getBrowserInfo().browser === Browser.MSIE;
}

export function isBrowserChrome(): boolean {
    return getBrowserInfo().browser === Browser.CHROME;
}

export function isBrowserFirefox(): boolean {
    return getBrowserInfo().browser === Browser.FIREFOX;
}

export function isBrowserEdge(): boolean {
    return getBrowserInfo().browser === Browser.EDGE;
}

export function isBrowserEDGECHROMIUM(): boolean {
    return getBrowserInfo().browser === Browser.EDGE_CHROMIUM;
}

export function isBrowserSafari(): boolean {
    return getBrowserInfo().browser === Browser.SAFARI;
}

export function isBrowserOpera(): boolean {
    return getBrowserInfo().browser === Browser.OPERA;
}

export function getBrowserVersion(): number[] | null {
    return getBrowserInfo().browserVersion;
}
