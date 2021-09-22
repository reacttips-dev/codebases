import { sharedStart, StartConfig } from 'owa-shared-start';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { preloadLocStrings } from 'owa-localize-internal';
import { fetchThemeFile, ThemeConstants } from 'owa-theme-shared';
import { getItem, setItem } from 'owa-local-storage';
import { getBposNavBarDataAsync } from 'owa-bpos-store';
import { getOwaCanaryCookieValue } from 'owa-service/lib/canary';
import { getConfig, updateServiceConfig } from 'owa-service/lib/config';
import { getCurrentDensityWithoutFlight } from 'owa-fabric-densities/lib/getCurrentDensityWithoutFlight';
import { lazyGetOwaAuthTokenFromMetaOsHub } from 'owa-metaos-app-bootstrap';
import { lazyNativeResolvers } from 'outlook-resolvers-native';
import { lazyWebResolvers } from 'outlook-resolvers-web';
import { isNative } from 'owa-hostapp-feature-flags/lib/utils/isNative';
import { lazyCreateManagedQueryLink } from 'owa-managed-query-link';
import { lazyLocalStateResolvers } from 'outlook-resolvers-local-state';
import { shouldGetTokenFromMetaOSHub } from 'owa-metaos-utils';

const localStorageSource = 'ls';
const DensityLocalStorageKey = 'owa_density';
const functionName = 'start';

export default function start(config: StartConfig): Promise<any> {
    if (shouldGetTokenFromMetaOSHub()) {
        const oldRunBeforeStart = config.runBeforeStart;
        config.runBeforeStart = (startConfig: StartConfig) =>
            lazyGetOwaAuthTokenFromMetaOsHub.import().then(getAuthToken => {
                updateServiceConfig({ getAuthToken });
                return oldRunBeforeStart?.(startConfig);
            });
    }

    return sharedStart({
        ...config,
        runAfterRequests: (sessionDataPromise: Promise<SessionData>) => {
            // let's start downloading the resolvers now since we need them for bootstrap
            if (isNative()) {
                lazyNativeResolvers.import();
                lazyCreateManagedQueryLink.import();
            } else {
                lazyWebResolvers.import();
            }
            lazyLocalStateResolvers.import();

            // try to load the theme data from local storage
            var cachedNormalizedTheme = getItem(window, ThemeConstants.LOCAL_STORAGE_KEY);
            if (cachedNormalizedTheme) {
                fetchThemeFile(cachedNormalizedTheme, localStorageSource);
            }

            preloadLocStrings(localStorageSource);

            // load the bpos data as soon as possible so we can start rendering the header as soon as possible
            if (config.loadBpos && !getConfig().disableAllRequests) {
                // if we have a canary value, then we can get the bpos data as soon as possible.
                // if not, we will have to wait for the session data promise to finish so that the canary is set
                if (getOwaCanaryCookieValue()) {
                    getBposNavBarDataAsync(functionName, config.app, true /* ignoreAuthError */);
                } else {
                    sessionDataPromise.then(() => getBposNavBarDataAsync(functionName, config.app));
                }
            }

            const cachedDensity = getItem(window, DensityLocalStorageKey);
            if (cachedDensity) {
                getCurrentDensityWithoutFlight(cachedDensity).import();
            }

            // Initialize localization once we have the user culture
            sessionDataPromise.then(sessionData => {
                preloadLocStrings('sd');
                const density = sessionData?.owaUserConfig?.UserOptions?.DisplayDensityMode;
                if (density) {
                    setItem(window, DensityLocalStorageKey, density);
                }
            });

            config.runAfterRequests?.(sessionDataPromise);
        },
    });
}
