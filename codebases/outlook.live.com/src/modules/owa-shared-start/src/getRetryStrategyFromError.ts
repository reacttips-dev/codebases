import type { ErrorSource } from './interfaces/ErrorSource';
import type { BootResult } from './interfaces/BootResult';
import { ErrorRetryStrategy } from './interfaces/ErrorRetryStrategy';
import type RetryStrategy from './interfaces/RetryStrategy';
import { getQueryStringParameter } from 'owa-querystring';
import { TEN_SECONDS_IN_MS } from './timeConstants';
import { languagePostOnBootError } from './languagePostOnBootError';
import { getConfig } from 'owa-service/lib/config';

export function getRetryStrategyFromError(
    bootResult: BootResult,
    source: ErrorSource | undefined,
    retryWholeApp?: boolean
): RetryStrategy | null {
    const currentRetryStrategy = getQueryStringParameter('bO');

    // we shouldn't try if we already have retried
    if (currentRetryStrategy !== undefined && currentRetryStrategy !== '4') {
        return null;
    }

    if (retryWholeApp && source == 'StartupData') {
        return null;
    }

    switch (bootResult) {
        case 'langtz':
            return {
                strategy: ErrorRetryStrategy.ServerNoCache,
                waitFor: languagePostOnBootError(),
            };
        case 'auth':
            // if we are in token based auth and we are not doing a full refresh
            // we want StartupData to retry individually. Otherwise, we don't want any retries
            return getConfig().getAuthToken && !retryWholeApp
                ? { strategy: ErrorRetryStrategy.ServerNoCache }
                : null;
        case 'throttle': // If the user is being throttled so we will not retry to help with the throttling
        case 'errorfe': // If there is a redirect url, we  will redirect instead of retrying
        case 'optin': // If there an optin, we should redirect to owa instead of retrying
        case 'accessDenied': // If the user does not have access to this mailbox, he will not be able to try later
        case 'configuration': // If the user has a configuration problem, then retrying won't help
            // if the user returned an error we know, we don't need to retry
            return null;
        case 'ExpiredBuild':
        case 'PoisonedBuild':
            // if the build is bad, then let's skip the service worker
            // if we have already tried 4 then let's not keep trying it to get stuck in an infinite loop
            return currentRetryStrategy === '4'
                ? null
                : { strategy: ErrorRetryStrategy.SkipClientCache };
        case 'transient':
            return {
                strategy: ErrorRetryStrategy.ServerNoCache,
                timeout: TEN_SECONDS_IN_MS,
            };
        default:
            // If the strings failed to load, we should try from the backup CDN becasue the loc strings do not automatically
            // try from the backup CDN during boot.
            // In any other case, we should do a simple retry without the cache.
            return {
                strategy:
                    source == 'InitLoc'
                        ? ErrorRetryStrategy.ResourceUrlFallback
                        : ErrorRetryStrategy.ServerNoCache,
            };
    }
}
