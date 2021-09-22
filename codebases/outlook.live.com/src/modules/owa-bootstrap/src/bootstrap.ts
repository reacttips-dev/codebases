import { bootstrap as sharedBootstrap } from 'owa-shared-bootstrap';
import type { BootstrapOptions } from './types/BootstrapOptions';
// Import setHtmlLangOrchestrator so that it gets run.
import './orchestrators/setHtmlLangOrchestrator';
import 'owa-fabric-theme'; // Need to initialize orchestrators that listen for theme and locale change
import { DesktopErrorComponentAsync } from 'owa-desktop-error-component';
import { getOpxHostApi } from 'owa-opx';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { getWindowTitle } from './initialization/getWindowTitle';
import { initializeOwaLocalization } from './initialization/initializeOwaLocalization';
import { initializeManifest } from './initialization/initializeManifest';
import initializeTheme from './initialization/initializeTheme';
import initializeDensity from './initialization/initializeDensity';
import { getBposPromise } from 'owa-bpos-store';
import { lazyPwaUtils } from 'owa-pwa-utils';
import { updateServiceConfig } from 'owa-service/lib/config';
import { getMailboxSpecificRequestOptions } from 'owa-request-options';
import { isPwa } from 'owa-config';
import { initializeApolloClient, unblockBootResolvers, wrapInApolloProvider } from 'owa-apollo';
import { lazyNativeResolvers } from 'outlook-resolvers-native';
import { lazyWebResolvers } from 'outlook-resolvers-web';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyCreateManagedQueryLink } from 'owa-managed-query-link';
import { PromiseWithKey, trackBottleneck } from 'owa-performance';
import { lazyLocalStateResolvers } from 'outlook-resolvers-local-state';
import { setConfiguration } from 'owa-userconfiguration-cache';
import { logUsage } from 'owa-analytics';
import { firstApp } from 'owa-config/lib/bootstrapOptions';
import { DEFAULT_USER_CONFIG } from 'owa-graph-schema';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { lazyCachePolicies } from 'outlook-cache-policies';

export function bootstrap(options: BootstrapOptions) {
    if (isHostAppFeatureEnabled('wrongIndex') && firstApp != 'Native') {
        logUsage('WrongIndexNative');
    }

    const prerenderPromises: PromiseWithKey<unknown>[] = [];

    const bposPromise = getBposPromise();
    if (bposPromise) {
        prerenderPromises.push({ promise: bposPromise, key: 'bpos' });
    }

    // Initialize the Apollo client
    const lazyResolvers = isHostAppFeatureEnabled('nativeResolvers')
        ? lazyNativeResolvers
        : lazyWebResolvers;
    const createManagedQueryLink = isHostAppFeatureEnabled('managedQueryLink')
        ? lazyCreateManagedQueryLink.import()
        : undefined;
    const initializeApolloPromise = initializeApolloClient({
        lazyResolvers: lazyResolvers.import(),
        lazyLocalStateResolvers: lazyLocalStateResolvers.import(),
        lazyCreateManagedQueryLink: createManagedQueryLink,
        lazyCachePolicies: lazyCachePolicies.import(),
        context: {
            isFeatureEnabled,
        },
    });

    prerenderPromises.push({ key: 'apollo', promise: initializeApolloPromise });

    updateServiceConfig({
        // This is used in owa-service to get Request Options with appropriate headers
        // needed for multi-account support. Parameters: UserIdentity, MailboxSmtpAddress and MailboxType
        // passed within getMailboxSpecificRequestOptions are used to decide which headers to be added for the same.
        prepareRequestOptions: getMailboxSpecificRequestOptions,
    });

    return sharedBootstrap({
        ...options,
        renderMainComponent: wrapInApolloProvider(options.renderMainComponent!),
        initializeState: (sessionData?: SessionData) => {
            // In-memory cache of user configuration. Main source of data for Web resolver and fallback for Hx resolver.
            // Has to be set before start of UI rendering as it's a main source of data during initial render.
            setConfiguration(sessionData?.owaUserConfig, DEFAULT_USER_CONFIG);
            initializeManifest();
            const statePromises: PromiseWithKey<any>[] = [
                {
                    key: 'th',
                    promise: (async () => {
                        if (isPwa()) {
                            await lazyPwaUtils.import();
                        }

                        return initializeTheme();
                    })(),
                },
                {
                    key: 'dnst',
                    promise: initializeDensity(),
                },
            ];

            const originalPromise = options.initializeState(sessionData, initializeApolloPromise);
            if (originalPromise) {
                statePromises.push({ key: 'ias', promise: originalPromise });
            }
            return trackBottleneck('stf', statePromises);
        },
        getWindowTitle: () =>
            isHostAppFeatureEnabled('moduleNameFromWindow')
                ? getWindowTitle(options.getModuleName)
                : options.getModuleName(),
        initializeLocalization: initializeOwaLocalization,
        fullErrorComponent: DesktopErrorComponentAsync,
        prerenderPromises,
        onComponentError: () => {
            if (isHostAppFeatureEnabled('opxComponentLifecycle')) {
                getOpxHostApi().onFatalError();
            }
        },
    }).then(unblockBootResolvers);
}
