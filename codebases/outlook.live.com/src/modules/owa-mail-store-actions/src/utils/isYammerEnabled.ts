import { isFeatureEnabled } from 'owa-feature-flags';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { logUsage } from 'owa-analytics';

const WHITELISTED_DOMAINS = ['office.com', 'office365.com'];

let isSupported: boolean;

export default function isYammerEnabled() {
    return isFeatureEnabled('rp-yammer') && isYammerSupported();
}

// Yammer interactive content is enabled for IE behind a flight
// Yammer interactive content is only enabled for standard office domains until VSO:61359 is fixed
function isYammerSupported() {
    if (isSupported != null) {
        return isSupported;
    }

    const isIE = isBrowserIE();
    const isEnabledOnIE = isIE && isFeatureEnabled('rp-yammer-ie');

    if (isIE && !isEnabledOnIE) {
        logUsage('Yammer_UnsupportedBrowser');
    }

    const isDomainWhitelisted = WHITELISTED_DOMAINS.some(allowedDomain => {
        return window.location.host.indexOf(allowedDomain) != -1;
    });

    if (!isDomainWhitelisted) {
        logUsage('Yammer_UnsupportedDomain');
    }

    isSupported = (!isIE || isEnabledOnIE) && isDomainWhitelisted;

    return isSupported;
}
