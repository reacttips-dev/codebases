import { createBootReliabilityAriaEvent } from './createBootReliabilityAriaEvent';
import * as AriaUtils from './ariaUtils';
import { getServerErrorDiagnostics } from './getServerErrorDiagnostics';
import { scrubForPii, getApp } from 'owa-config';
import calculateBootResult from './calculateBootResult';
import { getRetryStrategyFromError } from './getRetryStrategyFromError';
import type RetryStrategy from './interfaces/RetryStrategy';
import { appendMiscData } from './miscData';
import sleep from 'owa-sleep';
import createBootError from './createBootError';
import { createStatusErrorMessage } from './createStatusErrorMessage';
import type StartConfig from './interfaces/StartConfig';
import type ErrorDiagnostics from './interfaces/ErrorDiagnostics';
import type { BootResult } from './interfaces/BootResult';

export async function onBeforeRetry(
    config: StartConfig | undefined,
    endpoint: string,
    response: Response
) {
    const error = createBootError(
        createStatusErrorMessage(response),
        'StartupData',
        scrubForPii(response.url)
    );
    const errorDiagnostics = getServerErrorDiagnostics(error);
    const retryStrategy: RetryStrategy | null = getRetryStrategyFromError(
        calculateBootResult(error, errorDiagnostics, config),
        errorDiagnostics.esrc
    );
    if (retryStrategy) {
        await logRetry('serverRetry', error, errorDiagnostics);
        if (retryStrategy.waitFor) {
            // timeout the waitFor by 10 seconds and ignore errors
            await Promise.race([sleep(10000), retryStrategy.waitFor.catch(() => {})]);
        }
        return {
            endpoint: `${endpoint}?bO=1&app=${getApp()}`,
            delay: retryStrategy.timeout,
        };
    }
    return undefined;
}

export function logRetry(eventName: BootResult, error: any, errorDiagnostics?: ErrorDiagnostics) {
    appendMiscData('StartupDidRetry', 't');
    return AriaUtils.postSignal(
        createBootReliabilityAriaEvent(
            eventName,
            errorDiagnostics || getServerErrorDiagnostics(error),
            undefined,
            error
        )
    );
}
