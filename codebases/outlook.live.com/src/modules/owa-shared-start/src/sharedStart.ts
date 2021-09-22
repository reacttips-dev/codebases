import getSessionData from './getSessionData';
import { onBootComplete } from './onBootComplete';
import { onBootError } from './onBootError';
import setReferrerMeta from './setReferrerMeta';
import { validateCacheHealth } from './validateCacheHealth';
import { setApp } from 'owa-config/lib/bootstrapOptions';
import createBootError from './createBootError';
import { markFunction, addBootTiming, trackBottleneck, PromiseWithKey } from 'owa-performance';
import type { default as StartConfig, BootstrapFunction } from './interfaces/StartConfig';
import * as AriaUtils from './ariaUtils';
import { getOwsPath, getOpxHostData } from 'owa-config';
import getScopedPath from 'owa-url/lib/getScopedPath';
import { updateServiceConfig } from 'owa-service/lib/config';
import { setIsDeepLink } from 'owa-url/lib/isDeepLink';
import { findManifestExpirationDate } from './findManifestExpirationDate';
import { overrideLoadStyles } from './overrideLoadStyles';

let startTime: number;

export function sharedStart(config: StartConfig): Promise<any> {
    return internalStart(config)
        .then(() => {
            try {
                onBootComplete(startTime);
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen && loadingScreen.parentNode == document.body) {
                    addBootTiming('ls_e');
                    document.body.removeChild(loadingScreen);
                    config.onLoaderRemoved?.();
                }
            } catch (e) {
                throw createBootError(e, 'BootComplete');
            }
        })
        .catch(bootError => {
            onBootError(bootError, config);
        });
}

function internalStart(config: StartConfig) {
    try {
        startTime = Date.now();
        setApp(config.app);
        setIsDeepLink(!!config.isDeepLink);
        AriaUtils.setAriaTenantToken(config.startupAriaToken);

        const runBeforeStartPromise: Promise<void> | undefined = config
            .runBeforeStart?.(config)
            .catch(error => {
                if (!error.source) {
                    error.source = 'BeforeBoot';
                }
                throw error;
            });

        // Since the Referrer-Policy header does not work in Edge or IE,
        // we can dynamically add a referrer meta tag that Edge and IE will respect.
        // To start, we will set the policy to 'never' for security reasons.
        // After session data comes back, we will know if the user is a consumer
        // user or not, and then we can set it to 'origin' before the ads code get loaded
        setReferrerMeta('never');

        updateServiceConfig({
            baseUrl: getScopedPath(getOwsPath()),
        });

        const sessionDataFunction = config.overrideBootPromises || (() => getSessionData(config));
        let sessionDataPromise = runBeforeStartPromise
            ? runBeforeStartPromise.then(sessionDataFunction)
            : sessionDataFunction();

        overrideLoadStyles();
        const javascriptPromise: Promise<BootstrapFunction> = markFunction(
            () => config.bootstrap.import(),
            'mjs'
        )();
        const cachesToClean = config.cachesToClean;
        const bootPromises: PromiseWithKey<any>[] = [
            { promise: sessionDataPromise, key: 'sd' },
            {
                promise: validateCacheHealth(
                    sessionDataPromise,
                    findManifestExpirationDate(cachesToClean),
                    cachesToClean
                ),
                key: 'vc',
            },
            { promise: javascriptPromise, key: 'js' },
        ];

        let optionsPromise: Promise<any> = Promise.resolve();
        const opxHostPromise = getOpxHostData();

        const strategies = config.strategies;
        const options = config.options;

        if (options) {
            bootPromises.push({
                promise: markFunction(() => options.import(), 'ojs')(),
                key: 'ojs',
            });

            optionsPromise = Promise.all([
                options.import(),
                (opxHostPromise as Promise<any>) || Promise.resolve(),
            ]).then(([optionsFunc]) => {
                return optionsFunc(sessionDataPromise, strategies);
            });
        }

        const bootstrapPromises = [javascriptPromise, optionsPromise];
        if (opxHostPromise) {
            bootstrapPromises.push(opxHostPromise);
        }

        bootPromises.push({
            promise: Promise.all(bootstrapPromises)
                .then(([bootFunc, options]) => {
                    try {
                        return bootFunc.apply(
                            null,
                            options ? [options] : [sessionDataPromise, strategies]
                        );
                    } catch (e) {
                        throw createBootError(e, 'Bootstrap');
                    }
                })
                .catch(e => {
                    throw createBootError(e, 'Script');
                }),
            key: null,
        });

        if (config.runAfterRequests) {
            config.runAfterRequests(sessionDataPromise);
        }

        if (config.strategies) {
            // start downloading the boot strategies right away
            for (let strategy of Object.keys(config.strategies)) {
                const lazyAction = config.strategies[strategy];
                if (lazyAction) {
                    lazyAction.import();
                }
            }
        }

        return trackBottleneck('start', bootPromises);
    } catch (e) {
        return Promise.reject(createBootError(e, 'Preboot'));
    }
}
