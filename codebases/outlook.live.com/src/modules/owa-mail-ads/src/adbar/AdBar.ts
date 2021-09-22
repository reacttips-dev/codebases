import { AdsDimension, AdsProvider, getAdsConfig, parseAdsDimension } from './AdsConfig';
import { AdType } from './AdType';
import AppNexusRenderer from './AppNexusRenderer';
import VerizonYahooRenderer from './VerizonYahooRenderer';
import showAdBlock from '../actions/showAdBlock';
import { logUsage } from 'owa-analytics';
import { getAstScriptUrl, loadScript } from 'owa-mail-ads-shared';
import { openComposeActionName } from 'owa-mail-compose-action-names';
import { createRetriableFunction } from 'owa-retriable-function';
import type { TraceErrorObject } from 'owa-trace';
import { dispatch } from 'satcheljs';

const createRetriableForLoadingScript = createRetriableFunction({
    maximumAttempts: 2,
    timeBetweenRetryInMS: () => 1000,
});

interface RegisteredAd {
    Provider: AdsProvider;
    DetermineAd: () => string;
}

const registeredAds: { [id: string]: RegisteredAd } = {};

const dimensions: { [id: string]: AdsDimension } = {
    WAB5: {
        Size: [
            [300, 600],
            [300, 250],
        ],
        PageGroupPrefix: 'WAB5',
        AllowedFormats: ['banner'],
        JACPosition: 'RR',
        JACAdSize: ['300x600', '300x250'],
    },
    WAB2: {
        Size: [[160, 600]],
        PageGroupPrefix: 'WAB2',
        ComposeGroupPrefix: 'WAB4',
        AllowedFormats: ['banner'],
        JACPosition: 'RR',
        JACAdSize: ['160x600'],
    },
    WAB7: {
        Size: [[728, 90]],
        PageGroupPrefix: 'WAB7',
        AllowedFormats: ['banner'],
        JACPosition: 'BILLBOARD',
        JACAdSize: ['728x90'],
    },
};

const VerizonYahooCountries = ['BR', 'CA', 'DE', 'ES', 'FR', 'GB', 'JP', 'IT', 'UK', 'US'];

async function loadAstScriptAndCheck(): Promise<any> {
    await loadScript(getAstScriptUrl());

    const apn = (<any>window).apntag;
    if (!apn || !apn.anq) {
        var error: TraceErrorObject = new Error('AppNexus namespace blocked');
        error.external = true;
        return Promise.reject(error);
    }
    return Promise.resolve();
}

async function loadYahooVerizonScriptAndCheck(): Promise<any> {
    await loadScript('https://jac.yahoosandbox.com/0.6.0-msft/jac.js', false);

    const jac = (<any>window).JAC;
    if (jac == null) {
        var error: TraceErrorObject = new Error('Yahoo JAC namespace blocked');
        error.external = true;
        return Promise.reject(error);
    }
    return Promise.resolve();
}

export function loadDisplayScript(adType: AdType): Promise<any> {
    const promises: Promise<void>[] = [];
    const { retriableFunc } = createRetriableForLoadingScript(async () => {
        if (adType == AdType.AppNexus) {
            await loadAstScriptAndCheck();
        } else if (adType == AdType.YahooVerizon) {
            await loadYahooVerizonScriptAndCheck();
        }
    });

    promises.push(
        retriableFunc()
            .then(() => {
                return Promise.resolve();
            })
            .catch((e: TraceErrorObject) => {
                if (typeof e == 'string') {
                    e = new Error(e);
                }
                Object.defineProperty(e, 'external', { value: true });
                throw e;
            })
    );

    promises[0]
        .then(() => {})
        .catch((error: string | TraceErrorObject) => {
            // When the JAC file fails to be loaded, it does not mean the user has installed Ad blocker
            if (adType == AdType.AppNexus) {
                dispatch(showAdBlock());
            }
            logUsage('AdsNotInitialized', [typeof error === 'string' ? error : error?.message]);
        });

    return Promise.all(promises);
}

let lastRefreshTime: number;
let lastDimension: AdsDimension;
let promise: Promise<void>;
let refreshThottleInterval: number;
export function fetchAds(adContainerId: string, determineAd: () => string) {
    const config = getAdsConfig();
    const currentDimension = dimensions[determineAd()];
    // check if the ads container is visible
    if (currentDimension) {
        // Currently, Yahoo JAC file is not blocked by the Adblocker plugin directly but the Yahoo ads will still be blocked finally
        // There is no easy way to detect if the Yahoo ad is blocked upfront to show the ad block message to the users.
        // We still try to load ast.js to see if the Adblocker is installed. If so, we will not initialize the Yahoo Ad.
        promise = promise || loadDisplayScript(AdType.AppNexus);
        promise.then(() => {
            parseAdsDimension(currentDimension);
            if (!registeredAds[adContainerId]) {
                registeredAds[adContainerId] = {
                    Provider:
                        VerizonYahooCountries.indexOf(config.CountryCode) > -1
                            ? new VerizonYahooRenderer(adContainerId)
                            : new AppNexusRenderer(adContainerId),
                    DetermineAd: determineAd,
                };
            } else if (lastDimension.PageGroupPrefix != currentDimension.PageGroupPrefix) {
                registeredAds[adContainerId].Provider.modify();
            }

            lastDimension = currentDimension;
            lastRefreshTime = Date.now();
            refreshThottleInterval = config.RefreshThottleInterval;
        });
    }

    return config.AdMarket;
}

let throttleCount = 0;

export function refresh(actionName?: string) {
    const currentTime = Date.now();
    const timeBetweenAds = currentTime - lastRefreshTime;
    const dontThrottleAds = lastRefreshTime && timeBetweenAds > refreshThottleInterval;
    if (dontThrottleAds) {
        lastRefreshTime = currentTime;
        const keys = Object.keys(registeredAds);
        for (let ii = 0; ii < keys.length; ii++) {
            const index = keys[ii];
            const dimension = dimensions[registeredAds[index].DetermineAd()];
            if (dimension) {
                parseAdsDimension(dimension, actionName == openComposeActionName);
                registeredAds[index].Provider.refresh(throttleCount, actionName);
            }
        }
        throttleCount = 0;
    } else {
        throttleCount++;
    }
}

export function disableOrEnableRefresh(noRefreshReason?: string) {
    const keys = Object.keys(registeredAds);
    for (let ii = 0; ii < keys.length; ii++) {
        const index = keys[ii];
        registeredAds[index].Provider.disableOrEnableRefresh(noRefreshReason);
    }
}

export function test_setDisplayPromise(p: Promise<void>) {
    promise = p;
}
