import getBrowserInfo from './getBrowserInfo';

export default function isMinimumBrowserVersion(minimumVersion: number[]) {
    const { browserVersion } = getBrowserInfo();

    if (minimumVersion.length > browserVersion.length) {
        return false;
    }
    for (let i = 0; i < minimumVersion.length; i++) {
        if (browserVersion[i] !== minimumVersion[i]) {
            return browserVersion[i] > minimumVersion[i];
        }
    }
    return true;
}
