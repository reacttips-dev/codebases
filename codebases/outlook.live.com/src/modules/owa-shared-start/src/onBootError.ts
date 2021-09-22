import { getRetryStrategyFromError } from './getRetryStrategyFromError';
import { createBootReliabilityAriaEvent } from './createBootReliabilityAriaEvent';
import * as AriaUtils from './ariaUtils';
import type BootError from './interfaces/BootError';
import type StartConfig from './interfaces/StartConfig';
import type RetryStrategy from './interfaces/RetryStrategy';
import { TEN_SECONDS_IN_MS } from './timeConstants';
import calculateBootResult from './calculateBootResult';
import { getServerErrorDiagnostics } from './getServerErrorDiagnostics';
import { handleBootError } from './handleBootError';
import { doErrorRetryRedirect } from './doErrorRetryRedirect';

export function onBootError(error: BootError, config: StartConfig): Promise<any> {
    const errorDiagnostics = getServerErrorDiagnostics(error);
    let bootResult = calculateBootResult(error, errorDiagnostics, config);
    const retryStrategy: RetryStrategy | null = getRetryStrategyFromError(
        bootResult,
        errorDiagnostics.esrc,
        true /* retryWholeApp */
    );
    if (retryStrategy) {
        bootResult = 'retry';
    }
    // if we are not retrying, let's do the default time out. If not, let's extend the time out to 10 seconds
    return AriaUtils.postSignal(
        createBootReliabilityAriaEvent(bootResult, errorDiagnostics, undefined, error),
        retryStrategy ? undefined : TEN_SECONDS_IN_MS
    ).then(() => {
        const didRetry = retryStrategy && doErrorRetryRedirect(retryStrategy, config.retryQsp);
        if (!didRetry) {
            (config.handleBootError || handleBootError)(
                bootResult,
                error,
                errorDiagnostics,
                config.onFatalBootError
            );
        }
    });
}
