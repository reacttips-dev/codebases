import extractConfig, { DatapointConfigWithFunctions } from './utils/extractConfig';
import { PerformanceDatapoint } from './datapoints/PerformanceDatapoint';
import type { ActionMessage, DispatchFunction } from 'satcheljs';
import { DatapointStatus } from './types/DatapointEnums';
import { safeRequestAnimationFrame } from 'owa-performance';
import { registerCreateServiceResponseCallback as registerOwsCreateServiceResponseCallback } from 'owa-service/lib/fetchWithRetry';
import { registerCreateServiceResponseCallback as registerOwsPrimeCreateServiceResponseCallback } from 'owa-ows-gateway/lib/registerCreateServiceResponseCallback';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import type { DatapointConfig } from 'owa-analytics-types';
import { lazyTrackNetworkResponse } from './lazyFunctions';

const actionStack: string[] = [];

export function getActionStack(): string[] {
    return actionStack;
}

const MAX_ACTIONS_TO_KEEP = 7;
let actionQueue: string[] = [];
export function getActionQueue() {
    return actionQueue;
}

let actionDatapointStack: PerformanceDatapoint[] = [];
export function getActionDatapointStack() {
    return actionDatapointStack;
}

export function clearActionDatapointStack() {
    actionDatapointStack = [];
}

export function returnTopExecutingActionDatapoint(
    filterFunction?: (dp: PerformanceDatapoint) => boolean
) {
    if (filterFunction) {
        return actionDatapointStack.filter(filterFunction)[0];
    }

    return actionDatapointStack[0];
}

function trackServiceResponses(
    responsePromise: Promise<Response>,
    actionName: string,
    url: string,
    attemptCount: number,
    optionsPromise: Promise<RequestOptions>
) {
    var datapoint = returnTopExecutingActionDatapoint();
    if (datapoint) {
        lazyTrackNetworkResponse.importAndExecute(
            datapoint,
            responsePromise,
            actionName,
            optionsPromise
        );
    }
}

registerOwsCreateServiceResponseCallback(trackServiceResponses);
registerOwsPrimeCreateServiceResponseCallback(trackServiceResponses);

export function addDatapointMiddleware(next: DispatchFunction, actionMessage: ActionMessage) {
    if (actionMessage.type) {
        actionStack.push(actionMessage.type);
    }
    while (actionQueue.length >= MAX_ACTIONS_TO_KEEP) {
        actionQueue = actionQueue.slice(1);
    }
    if (actionMessage.type) {
        actionQueue.push(actionMessage.type);
    }
    return addDataPointInternal(next.bind(null, actionMessage), actionMessage.dp, actionMessage);
}

export function wrapFunctionForDatapoint<U extends any[], R>(
    config: DatapointConfigWithFunctions<U>,
    funcToWrap: (...args: U) => R
): (...args: U) => R {
    return function () {
        const args = (arguments as unknown) as U;
        return addDataPointInternal(
            () => funcToWrap.apply(null, args),
            extractConfig(config, args)
        );
    };
}

function addDataPointInternal(
    executeNext: () => any,
    config: DatapointConfig | undefined,
    actionMessage?: ActionMessage & { lazyOrchestrator?: boolean }
) {
    let datapoint: PerformanceDatapoint | null = null;
    if (actionMessage?.actionDatapoint) {
        datapoint = actionMessage.actionDatapoint;
    } else if (config?.name) {
        datapoint = new PerformanceDatapoint(config.name, config.options);
        // only push the datapoint on the stack if it has just been created
        actionDatapointStack.push(datapoint);
    }

    var returnValue: any = null;
    try {
        if (datapoint && config) {
            if (config.customData) {
                datapoint.addCustomData(config.customData);
            }
            if (config.cosmosOnlyData) {
                datapoint.addCosmosOnlyData(config.cosmosOnlyData);
            }
            if (config.actionSource) {
                datapoint.addActionSource(config.actionSource);
            }
        }

        returnValue = executeNext();
    } catch (error) {
        if (datapoint) {
            datapoint.endAction(undefined, error);
            actionDatapointStack.pop();
        }

        throw error;
    } finally {
        actionStack.pop();
    }

    // if it is a lazy orchestrator, we want the clone of the action to log it,
    // not the initial action that imports the bundle
    if (datapoint && actionMessage && actionMessage.lazyOrchestrator) {
        actionMessage.actionDatapoint = datapoint;
        datapoint = null;
    }

    if (datapoint) {
        const dp = datapoint;
        // if the return value is not a promise, then let's create a promise and resolve it right away
        // this will capture all of the javascript in the call stack
        const returnPromise = returnValue?.then ? returnValue : Promise.resolve();
        returnPromise
            .then(() => {
                dp.addCheckpoint('dm_promise');
                safeRequestAnimationFrame(isVisible => {
                    dp.addCheckpoint('dm_raf');
                    setTimeout(() => {
                        dp.addCheckpoint('dm_timeout');
                        dp.endAction(
                            isVisible ? DatapointStatus.Success : DatapointStatus.BackgroundSuccess
                        );
                    });
                });
            })
            .catch((error: Error) => {
                dp.endAction(undefined, error);
            });
        actionDatapointStack.pop();
    }

    return returnValue;
}
