import type { TraceableError } from 'owa-trace';
import { addBottleneck, markEnd, markStart } from 'owa-performance';

const stringFetchPromises: { [url: string]: Promise<Record<string, string>> } = {};
const timingName = 'locales';

export function fetchLocstrings(
    url: string,
    cacheSource?: string,
    trackTiming?: boolean
): Promise<Record<string, string>> {
    if (trackTiming) {
        markStart(timingName);
    }
    let resourcePromise = stringFetchPromises[url];
    if (!resourcePromise) {
        addBottleneck('lc_s', cacheSource || 'wp');
        resourcePromise = fetchAndLoad(url);
        if (trackTiming) {
            resourcePromise.then(() => {
                markEnd(timingName);
            });
        }
        if (cacheSource) {
            stringFetchPromises[url] = resourcePromise;
            // if the promise fails, then let's delete it from the cache
            resourcePromise.catch(() => {
                delete stringFetchPromises[url];
            });
        }
    } else if (trackTiming) {
        markEnd(timingName);
    }
    return resourcePromise;
}

async function fetchAndLoad(url: string) {
    // Request the strings
    let response: Response | undefined = undefined;
    try {
        response = await fetch(url);
    } catch (err) {
        throwError(err, url, true, 0); // Network error
    }

    // Handle error statuses
    const status = (<Response>response).status;
    if (status != 200) {
        throwError(null, url, false, status); // Not a network error
    }

    // Parse the response
    try {
        // disabling tslint rule as we need to await here
        // for the catch block to work properly
        // https://github.com/palantir/tslint/issues/3933
        // tslint:disable-next-line:no-return-await
        return await (<Response>response).json();
    } catch (err) {
        throwError(err, url, false); // Not a network error
    }

    // To make TypeScript happy
    return null;
}

function throwError(innerError: Error | null, url: string, networkError: boolean, status?: number) {
    const error: TraceableError = new Error('Failed to load localized strings');

    error.diagnosticInfo = JSON.stringify({
        url,
        status,
        innerError: innerError?.message,
    });

    // Webpack adds the `request` property to errors that arise due to network issues.  We
    // do the same thing here so that LazyModule knows that it can retry this import.
    error.request = url;

    if (networkError) {
        error.networkError = true;
    }

    error.httpStatus = status;
    throw error;
}
