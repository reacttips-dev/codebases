import sendJavascriptRedirect from './sendJavascriptRedirect';
import { DefaultVdir } from '../settings';
import getRootKey from './getRootKey';
import { getCacheWrapperSync, getResourceScope } from '../cacheWrapperMap';
import getIgnoredSearchParams from 'owa-serviceworker-common/lib/getIgnoredSearchParams';
import tryGetRequestPathWithTrailingSlash from './tryGetRequestPathWithTrailingSlash';
import getScopeFromUrl from './getScopeFromUrl';
import { preloadStartupData } from '../utils/preloadStartupData';
import * as trace from './trace';
import isSwFeatureEnabled from './isSwFeatureEnabled';
import extractVersion from './extractVersion';

export default function handleGetResourceFetch(e: FetchEvent): Promise<Response | undefined> {
    const url = e.request.url;
    if (e.request.mode == 'navigate') {
        return handleNavigationFetch(e);
    }
    const wrapper = getResourceScope(url);
    if (wrapper) {
        // it is more performant to match the individual cache instead of matching the entire cache storage
        return wrapper.cache.match(url);
    }
    return self.caches ? self.caches.match(url) : Promise.resolve(undefined);
}

function handleNavigationFetch(e: FetchEvent): Promise<Response | undefined> {
    const url: URL = new URL(e.request.url);

    if (url.pathname == '/' && url.search == '') {
        // If the request for navigation was without root vdir then do a client side redirect to vdir
        return sendJavascriptRedirect(DefaultVdir);
    }

    const pathWithTrailingSlash = tryGetRequestPathWithTrailingSlash(url);
    if (pathWithTrailingSlash) {
        // If the request for navigation was without trailing slash then do a client side redirec to vdir + trailing slash
        return sendJavascriptRedirect(pathWithTrailingSlash);
    }

    const endGroupTrace = trace.group(`Handle Navigation Fetch ${e.request.url}`);
    // we need to see which cache has this url stored it it's cache
    const scope = getScopeFromUrl(url);
    const ignoredSearchParams = getIgnoredSearchParams(url.search);
    if (scope && !ignoredSearchParams) {
        if (isSwFeatureEnabled('presd')) {
            preloadStartupData(scope, url);
        }
        const hxVersion = url.search?.split('hxVersion=')[1]?.split('&')[0];
        const rootUrl = getRootKey(scope, hxVersion);
        const cacheWrapper = getCacheWrapperSync(scope);
        const extractedVersion = extractVersion(url);

        // if the url has a version parameter, then let's see if it
        // matches the version in the cache. If it does, then let's
        // return the root in cache. If not, let's skip the cache
        if (extractedVersion) {
            trace.log(`Found version override ${extractedVersion}`);
            if (cacheWrapper && cacheWrapper.version == extractedVersion) {
                trace.log(`Matching with ${cacheWrapper.name} cache`);
                endGroupTrace();
                return cacheWrapper.cache.match(rootUrl);
            }
            trace.log('Version is not in cache');
            endGroupTrace();
            return Promise.resolve(undefined);
        }
        trace.log(
            `Matching navigate on ${
                cacheWrapper ? cacheWrapper.name : 'global'
            } cache with ${rootUrl}`
        );
        endGroupTrace();
        return cacheWrapper ? cacheWrapper.cache.match(rootUrl) : self.caches.match(rootUrl);
    }
    trace.log(`No request found:scope=${scope},ignoreSearch=${ignoredSearchParams}`);
    endGroupTrace();
    return Promise.resolve(undefined);
}
