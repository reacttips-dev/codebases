import registerServiceworker from './registerServiceworker';
import { getBrowserInfo, Browser, isMinimumBrowserVersion } from 'owa-user-agent';
import { isFeatureEnabled } from 'owa-feature-flags';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';
import getIgnoredSearchParams from 'owa-serviceworker-common/lib/getIgnoredSearchParams';
import type { CustomData } from 'owa-analytics-types';
import { getBootType } from 'owa-config';
import { hasQueryStringParameter } from 'owa-querystring';

export default async function initializeServiceWorker(
    windowObj: Window,
    app: ServiceWorkerSource,
    expectedXAppNameHeader?: string
) {
    const dp = new PerformanceDatapoint('RegisterServiceWorker');
    const serviceWorkerContainer: ServiceWorkerContainer | undefined =
        windowObj.navigator?.serviceWorker;
    let reason: string | undefined | void;
    let registerError: Error;
    const customData: CustomData = {
        bt: await getBootType(),
        sisp: getIgnoredSearchParams(windowObj.location?.search),
        ivm: hasQueryStringParameter('version') && hasQueryStringParameter('popoutv2'),
    };
    if (serviceWorkerContainer) {
        const registrations: readonly ServiceWorkerRegistration[] = serviceWorkerContainer.getRegistrations
            ? await serviceWorkerContainer.getRegistrations()
            : [];
        customData.swr = isServiceWorkerActive(registrations);
        reason = getReasonServiceIsNotSupported();
        if (!reason) {
            try {
                reason = await registerServiceworker(windowObj, app, dp, expectedXAppNameHeader);
            } catch (e) {
                registerError = e;
                reason = 'RegError';
            }
        } else if (registrations.length > 0) {
            for (let i = 0; i < registrations.length; ++i) {
                registrations[i].unregister();
            }
        }
    } else {
        reason = 'SWNotAvailable';
    }

    customData.owa_1 = reason || 'success';
    dp.addCustomData(customData);
    if (registerError) {
        dp.endWithError(DatapointStatus.ClientError, registerError);
    } else if (reason) {
        dp.endWithError(DatapointStatus.ServerError);
    } else {
        dp.end();
    }
}

function isServiceWorkerActive(registrations: readonly ServiceWorkerRegistration[]): string {
    if (!registrations || registrations.length < 1) {
        return 'NoReg';
    }
    const activeRegs = registrations.filter(r => r.active);
    if (activeRegs.length < 1) {
        return 'NoActive';
    }
    const relevantRegs = registrations.filter(
        r => r.active.scriptURL && r.active.scriptURL.indexOf('/sw.js') > -1
    );
    if (relevantRegs.length < 1) {
        return 'NoRel';
    }
    return 'Success';
}

function getReasonServiceIsNotSupported(): string {
    const { browser } = getBrowserInfo();
    let reason: string;
    if (isFeatureEnabled('fwk-prefetch-code-off')) {
        reason = 'Error_PrefetchDisabled';
    } else if (browser == Browser.CHROME || browser == Browser.EDGE_CHROMIUM) {
        if (isFeatureEnabled('fwk-prefetch-code-off-chromium') && !isMinimumBrowserVersion([77])) {
            reason = 'Error_ChromeMinVersion';
        }
    } else if (browser == Browser.EDGE) {
        if (!isMinimumBrowserVersion([17, 17134])) {
            reason = 'EdgeMinVersion';
        }
    } else if (browser == Browser.SAFARI) {
        if (!isMinimumBrowserVersion([11, 1])) {
            reason = 'SafariMinVersion';
        }
    } else if (browser != Browser.FIREFOX) {
        reason = 'UnsupportedBrowser:' + browser;
    }
    return reason;
}
