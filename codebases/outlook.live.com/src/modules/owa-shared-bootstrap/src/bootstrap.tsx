import * as React from 'react';
import * as ReactDOM from 'react-dom';

if (typeof window !== 'undefined') {
    window.React = React;
    window.ReactDOM = ReactDOM;
}

import type { BootstrapOptions } from './types/BootstrapOptions';
import asyncRender from './asyncRender';
import { ErrorBoundary } from 'owa-error-boundary';
import { DEFAULT_LOCALE, getSupportedFallbackForLocale } from './getSupportedFallbackForLocale';
import initializeSatchelMiddleware from './initializeSatchelMiddleware';
import initializeWindowTitle from './initializeWindowTitle';
import initializeDateTime from './initializeDateTime';
import { getCultureOverride } from './getCultureOverride';
import setUserConfiguration from 'owa-session-store/lib/actions/setUserConfiguration';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { checkAndHandleOwaHipError } from 'owa-service-error';
import { updateServiceConfig } from 'owa-service/lib/config';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { logUsage } from 'owa-analytics';
import { addAnalyticsCallbacks } from 'owa-analytics-start';
import { initializeApplicationSettings } from 'owa-application-settings';
import {
    extractFlightsFromSettings,
    initializeFeatureFlags,
    isFeatureEnabled,
} from 'owa-feature-flags';
import { trackBottleneck, markFunction, PromiseWithKey } from 'owa-performance';
import { preloadStrategies } from './preloadStrategies';
import { OwaWorkload, setOwaWorkload } from 'owa-workloads';
import { registerFontSubsets } from 'owa-icons';
import { registerDefaultFontFaces } from '@fluentui/style-utilities';
import { lazyIsUserIdle } from 'owa-useractivity-manager';
import {
    getPackageBaseUrl,
    getCdnUrl,
    getOpxHostData,
    parseExtraSettings,
    doesBuildMatch,
    getClientVersion,
} from 'owa-config';
import { unblockLazyLoadCallbacks } from 'owa-bundling-light';
import { setBundlingConfig } from 'owa-bundling';
import { lazySetupSharedPostBoot } from 'owa-shared-post-boot';
import { registerCreateServiceResponseCallback as registerOwsCreateServiceResponseCallback } from 'owa-service/lib/fetchWithRetry';
import { registerCreateServiceResponseCallback as registerOwsPrimeCreateServiceResponseCallback } from 'owa-ows-gateway/lib/registerCreateServiceResponseCallback';
import { initializeRouter } from 'owa-router';
import createBootError from 'owa-shared-start/lib/createBootError';
import { hasQueryStringParameter } from 'owa-querystring';

setBundlingConfig(logUsage);

const DelayAfterRenderInMilliseconds = 100;

/**
 *  Bootstraps the application
 *  See [README.md](../../../../README.md) for details on boot flow
 */
export default markFunction(bootstrap, 'btsp');

let idleFn: (() => boolean) | null = null;

function bootstrap(options: BootstrapOptions): Promise<any> {
    addAnalyticsCallbacks(
        registerOwsCreateServiceResponseCallback,
        registerOwsPrimeCreateServiceResponseCallback
    );
    registerDefaultFontFaces(`${getCdnUrl()}assets/mail/fonts/v1`);
    setOwaWorkload(options.workload || OwaWorkload.None);

    initializeSatchelMiddleware();
    registerFontSubsets(getPackageBaseUrl(), options.iconFonts);

    updateServiceConfig({
        onHipChallengeNeeded: responseHeaders => {
            if (!isFeatureEnabled('fwk-hipExceptionRedirect')) {
                return false;
            }

            return checkAndHandleOwaHipError(responseHeaders);
        },
        isUserIdle: () => {
            if (idleFn) {
                return idleFn();
            } else {
                lazyIsUserIdle.import().then(f => (idleFn = f));
                return false;
            }
        },
        isFeatureEnabled: f => isFeatureEnabled(f as any, true),
    });

    return options.sessionPromise
        .then(async data => {
            // sessionData should never be undefined in the bootstrap flow. It will onle be undefined
            // when switching modules
            const sessionData = data!;

            // Since poisoning the build means to restart the client with a bO query string parameter
            // we don't want to do it if we already have the query string paramter present.
            if (doesBuildMatch(sessionData.skipBuilds) && !hasQueryStringParameter('bO')) {
                throw createBootError(
                    new Error(`PoisonedBuild ${getClientVersion()}`),
                    'PoisonedBuild'
                );
            }
            const extraSettings = parseExtraSettings(sessionData.extraSettings);
            let featureOverrides: string[] = extraSettings.featureOverrides || [];
            let featureFlags = (sessionData.features || []).concat(featureOverrides);

            let flightsFromSettings = extractFlightsFromSettings(
                sessionData.applicationSettings?.settings
            );
            initializeFeatureFlags([...featureFlags, ...flightsFromSettings]);

            setUserConfiguration(sessionData.owaUserConfig);
            (sessionData.owaUserConfig as any) = getUserConfiguration();

            if (isFeatureEnabled('fwk-application-settings')) {
                initializeApplicationSettings(sessionData.applicationSettings);
            }

            let preRenderPromises: PromiseWithKey<unknown>[] = options.prerenderPromises || [];
            const hostPromise = getOpxHostData();
            if (hostPromise) {
                preRenderPromises.push({ promise: hostPromise, key: 'hp' });
            }

            const { locale, culture, dir } = getLocalizationContext(sessionData);
            preRenderPromises.push({
                promise: options
                    .initializeLocalization(locale, culture, dir)
                    .catch(e => {
                        addIfNotNull(e, 'source', 'InitLoc');
                        addIfNotNull(e, 'status', e.httpStatus);
                        return Promise.reject(e);
                    })
                    .then(() => {
                        initializeWindowTitle(options.getWindowTitle);
                    }),
                key: 'lcl',
            });

            // Make sure shouldInitializeTimeZoneAnonymously is a boolean as undefined
            // will not initialize the time zones
            const dateTimePromise = initializeDateTime(
                !!options.shouldInitializeTimeZoneAnonymously
            );
            if (dateTimePromise && options.waitForDateTimeStore) {
                preRenderPromises.push({ promise: dateTimePromise, key: 'dt' });
            }

            // Start the application
            const initializeStatePromise = options.initializeState(sessionData);
            if (initializeStatePromise) {
                preRenderPromises.push({
                    promise: initializeStatePromise,
                    key: 'ist',
                });
            }

            if (options.routerOptions) {
                // Router initialization depends on user configuration, so initialize it after
                preRenderPromises.push({
                    promise: initializeRouter(options.routerOptions),
                    key: 'rt',
                });
            }

            const strategies = options.strategies;
            preRenderPromises = preRenderPromises.concat(preloadStrategies(strategies));

            // Await any additional promises before final render
            await trackBottleneck('ren', preRenderPromises);

            // start downloading the bundle
            options.postLazyAction?.import();

            // Return a Promise to render the initial app state
            return markFunction(asyncRender, 'ren')(
                <ErrorBoundary
                    fullErrorComponent={options.fullErrorComponent}
                    onError={options.onComponentError}
                    windowIcons={options.windowIcons}>
                    {options.renderMainComponent!()}
                </ErrorBoundary>,
                document.getElementById('app')
            );
        })
        .then(() => {
            setTimeout(() => {
                const postLazyAction = options.postLazyAction;
                if (postLazyAction) {
                    postLazyAction.importAndExecute.apply(
                        postLazyAction,
                        options!.postLazyArgs || []
                    );
                }
                unblockLazyLoadCallbacks();
                lazySetupSharedPostBoot.importAndExecute(
                    options.analyticsOptions,
                    options.swConfig?.app,
                    options.swConfig?.expectedXAppNameHeader
                );
            }, DelayAfterRenderInMilliseconds);
        });
}

function getLocalizationContext(sessionData: SessionData) {
    const override = getCultureOverride();
    const { UserLanguage, UserCulture, IsUserCultureRightToLeft } =
        sessionData.owaUserConfig.SessionSettings ?? {};

    const locale: string =
        override ||
        (UserLanguage && getSupportedFallbackForLocale(UserLanguage).locale) ||
        DEFAULT_LOCALE;
    const dir: 'ltr' | 'rtl' | undefined = override
        ? undefined
        : IsUserCultureRightToLeft
        ? 'rtl'
        : 'ltr';
    const culture: string = UserCulture || DEFAULT_LOCALE;

    return { locale, culture, dir };
}

function addIfNotNull(error: Error, column: string, value: any) {
    if (error[column] === undefined) {
        error[column] = value;
    }
}
