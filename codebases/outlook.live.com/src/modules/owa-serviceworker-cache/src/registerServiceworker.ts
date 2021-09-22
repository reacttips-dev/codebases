import getQueryStringParameters from './utils/getQueryStringParameters';
import { trace } from 'owa-trace';
import {
    tryInitializeServiceWorkerCacheInstaller,
    installServiceWorkerCache,
} from './installServiceWorkerCache';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getBrowserInfo, Browser } from 'owa-user-agent';
import { getCurrentLanguage } from 'owa-localize';
import type { PerformanceDatapoint } from 'owa-analytics';
import { getIndexedPath } from 'owa-url';
import type CacheInstallationState from './interfaces/CacheInstallationState';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

const SERVICEWORKER_ACTIVATED: string = 'activated';

let state: CacheInstallationState = null;

export default function registerServiceworker(
    windowObject: Window,
    appName: ServiceWorkerSource,
    datapoint: PerformanceDatapoint,
    expectedXAppNameHeader?: string
): Promise<void | string> {
    const serviceWorkerContainer = windowObject.navigator.serviceWorker;
    state = {
        serviceWorkerContainer,
        appName,
        userLanguage: getCurrentLanguage()?.toLowerCase(),
        expectedXAppNameHeader,
    };
    let serviceworkerUrl = getIndexedPath('mail') + '/sw.js';
    let params = [];
    // fa=1 will tell the service worker, in serviceworkerlib, whether this flight is enabled
    // we also post a message to it, during the install phase, but that can happen significantly
    // after boot.
    isFeatureEnabled('fwk-sw-proxyFetchAlways') && proxyFetchForBrowser() && params.push('fa=1');
    isFeatureEnabled('fwk-sw-preload') && params.push('presd=1');

    const paramsString = getQueryStringParameters(windowObject, params);
    if (paramsString) {
        serviceworkerUrl += '?' + paramsString;
    }

    datapoint.addCustomData({
        url: serviceworkerUrl,
    });
    return serviceWorkerContainer
        .register(serviceworkerUrl, { scope: '/' })
        .then(() =>
            serviceWorkerContainer.ready.then(serviceWorkerReady).catch(() => 'SWReadyError')
        );
}

function serviceWorkerReady(registration: ServiceWorkerRegistration): Promise<void> {
    trace.info('[SW Client] ready fired, state: ' + registration.active.state);
    state.serviceWorkerRegistration = registration;
    if (registration.active) {
        return serviceWorkerActivating();
    } else {
        return new Promise(res => {
            state.serviceWorkerContainer.oncontrollerchange = () => {
                serviceWorkerActivating();
                res();
            };
        });
    }
}

function serviceWorkerActivating(): Promise<void> {
    const activeRegistration = state.serviceWorkerRegistration;
    if (activeRegistration.active.state == SERVICEWORKER_ACTIVATED) {
        serviceWorkerActivated();
        return Promise.resolve();
    } else {
        return new Promise(res => {
            activeRegistration.active.onstatechange = () => {
                if (activeRegistration.active.state == SERVICEWORKER_ACTIVATED) {
                    activeRegistration.active.onstatechange = null;
                    serviceWorkerActivated();
                    res();
                }
            };
        });
    }
}

function serviceWorkerActivated() {
    tryInitializeServiceWorkerCacheInstaller(state);
    installServiceWorkerCache();
}

function proxyFetchForBrowser(): boolean {
    const { browser, browserVersion } = getBrowserInfo();
    return (
        (browser == Browser.CHROME || browser == Browser.EDGE_CHROMIUM) &&
        browserVersion &&
        browserVersion.length > 0 // && browserVersion[0] < 76
    );
}
