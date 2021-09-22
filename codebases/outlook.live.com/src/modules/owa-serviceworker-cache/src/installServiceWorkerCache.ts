import type CacheInstallationState from './interfaces/CacheInstallationState';
import {
    CacheStatus,
    ClientMessage,
    Action,
    CachePriorityStrategy,
    ServiceWorkerMessage,
    ServiceWorkerMessageType,
} from 'owa-serviceworker-common';
import cacheProgressEventDispatcher from './cacheProgressEventDispatcher';
import serviceWorkerErrorEvent from './serviceWorkerErrorEvent';
import { getConsecutiveErrorCount } from './consecutiveErrorCount';
import { isFeatureEnabled, getEnabledFlightsWithPrefix } from 'owa-feature-flags';
import getRootVdirName from 'owa-url/lib/getRootVdirName';
import getIndexedPath from 'owa-url/lib/getIndexedPath';
import getQueryStringParameters from './utils/getQueryStringParameters';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getQueryStringParameter } from 'owa-querystring';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import updateCacheDiagnostics from './updateCacheDiagnostics';
import { getClientId, getBrowserHeight } from 'owa-config';
import getTracingEnabled from './utils/getTracingEnabled';
import { getCachedReadingPanePosition } from 'owa-serviceworker-common/lib/getCachedReadingPanePosition';
import { getBootFlights } from 'owa-metatags';

const MAX_CONSECUTIVE_ERROR: number = 5;
const INSTALL_CACHE_INTERVAL = 21600000; // 6 hours in ms

let intervalId: NodeJS.Timer | undefined;
let state: CacheInstallationState = null;

export function resetGlobals(): void {
    state = null;
}

export function tryInitializeServiceWorkerCacheInstaller(
    installationState: CacheInstallationState
): void {
    if (!state) {
        state = installationState;
        state.serviceWorkerContainer.onmessage = serviceWorkerMessageEvent;
    }

    if (isHostAppFeatureEnabled('nativeServiceWorker') && !intervalId) {
        intervalId = setInterval(installServiceWorkerCache, INSTALL_CACHE_INTERVAL);
    }
}

export function installServiceWorkerCache(action?: Action, hxVersion?: string): void {
    if (!state) {
        // if we don't have state then we can't send a message as the service worker
        // has not been initialized
        return;
    }

    const rootUrl = getIndexedPath('/' + getRootVdirName()) + '/';
    const manifestRequestQueryParams = ['manifestVersion=2'];

    const isNative = isHostAppFeatureEnabled('nativeServiceWorker');
    const manifestUrl: string = `${rootUrl}${
        isNative ? 'native' : state.appName
    }cache.manifest?${getQueryStringParameters(window, manifestRequestQueryParams, ['hxVersion'])}`;
    const dynamicRequestHeaders: { [key: string]: string } = {};
    const logonEmailAddress = getUserConfiguration()?.SessionSettings?.LogonEmailAddress;
    if (logonEmailAddress) {
        dynamicRequestHeaders['X-AnchorMailbox'] = logonEmailAddress;
    }
    if (isNative) {
        dynamicRequestHeaders['x-native-host'] = 'true';
    }

    const clientMessage: ClientMessage = {
        source: state.appName,
        action:
            action ||
            (getConsecutiveErrorCount(state.appName) > MAX_CONSECUTIVE_ERROR
                ? Action.UnInstall
                : Action.Install),
        language: state.userLanguage,
        manifestUrl: manifestUrl,
        proxyFetchAlways: isFeatureEnabled('fwk-sw-proxyFetchAlways'),
        rootUrl,
        dynamicRequestHeaders,
        hxVersion: getServiceWorkerHxVersion(hxVersion),
        expectedXAppNameHeader: state.expectedXAppNameHeader,
        priorityStrategy: isNative
            ? CachePriorityStrategy.Resources
            : CachePriorityStrategy.Updates,
        clientId: getClientId(),
        tracingEnabled: getTracingEnabled(),
        windowHeight: getBrowserHeight(),
        readingPanePosition: getCachedReadingPanePosition(),
        dynamicQueryString: getDynamicQueryStringParameters(),
    };
    state.serviceWorkerRegistration.active.postMessage(clientMessage);
}

const prefix = 'bf-';
function getDynamicQueryStringParameters(): string | undefined {
    const bootFlights = [...getBootFlights()];
    for (const flight of getEnabledFlightsWithPrefix(prefix)) {
        const clientFlight = flight.split(prefix)[1];
        if (bootFlights?.indexOf(clientFlight) == -1) {
            bootFlights.push(clientFlight);
        }
    }
    return bootFlights.length > 0 ? `bootflights=${bootFlights.join(',')}` : undefined;
}

function getServiceWorkerHxVersion(overrideHxVersion: string | undefined): string | undefined {
    if (isHostAppFeatureEnabled('hxVersionQueryStringParam')) {
        if (overrideHxVersion) {
            return overrideHxVersion;
        }
        const hxVersion = getQueryStringParameter('hxVersion');
        if (hxVersion) {
            return hxVersion;
        }
    }
    return undefined;
}

export function serviceWorkerMessageEvent(messageEvent: MessageEvent): void {
    if (messageEvent.data) {
        const message: ServiceWorkerMessage = messageEvent.data;
        switch (message.messageType) {
            case ServiceWorkerMessageType.CacheProgress:
                cacheProgressEventDispatcher(state, message);
                break;
            case ServiceWorkerMessageType.Error:
                serviceWorkerErrorEvent(message);
                break;
            case ServiceWorkerMessageType.OnCacheInstall:
                const cacheMessage = message.cacheMessage;
                if (cacheMessage) {
                    const status = cacheMessage.status;
                    updateCacheDiagnostics(
                        state.appName,
                        typeof status == 'number' ? status : CacheStatus.CacheFailed
                    );
                }
                break;
        }
    }
}
