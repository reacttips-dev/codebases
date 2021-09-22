import getUserAgentString from './getUserAgentString';

export const enum OperatingSystem {
    WINDOWS = 'Windows',
    MACOSX = 'Mac OS X',
    CHROMIUMOS = 'Chromium OS',
    IOS = 'iOS',
    ANDROID = 'Android',
    LINUX = 'Linux',
    UNKNOWN = 'Unknown',
}

const WINDOWS_VERSION_MAPPING = {
    '5.1': 'XP',
    '6.0': 'Vista',
    '6.1': '7',
    '6.2': '8',
    '6.3': '8.1',
    '6.4': '10',
    '10.0': '10',
};

interface OsInfo {
    os: OperatingSystem;
    osVersion: string | undefined;
}

let cachedValue: OsInfo | undefined;

export default function getOsInfo(): OsInfo {
    if (!cachedValue) {
        cachedValue = calculateOsInfo();
    }
    return cachedValue;
}

export function calculateOsInfo(): OsInfo {
    let os: OperatingSystem;
    let osVersion: string | undefined = undefined;

    const userAgentString = getUserAgentString();

    if (/(cros)\s[\w]+\s([\w\.]+\w)/i.test(userAgentString)) {
        os = OperatingSystem.CHROMIUMOS;
    } else if (/(iPad|iPhone|iPod)(?=.*like Mac OS X)/i.test(userAgentString)) {
        os = OperatingSystem.IOS;
    } else if (/android/i.test(userAgentString)) {
        os = OperatingSystem.ANDROID;
    } else if (
        /(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i.test(
            userAgentString
        )
    ) {
        os = OperatingSystem.LINUX;
    } else if (/(macintosh|mac os x)/i.test(userAgentString)) {
        os = OperatingSystem.MACOSX;
    } else if (/(windows|win32)/i.test(userAgentString)) {
        os = OperatingSystem.WINDOWS;
        osVersion = getWindowsOsVersion(userAgentString);
    } else {
        os = OperatingSystem.UNKNOWN;
    }

    return { os, osVersion };
}

function getWindowsOsVersion(userAgentString): string {
    let winRawVersion = userAgentString.match(new RegExp('Windows NT ([\\d,.]+)'));
    return winRawVersion && WINDOWS_VERSION_MAPPING[winRawVersion[1]];
}
