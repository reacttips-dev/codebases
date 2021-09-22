import { TaskQueue } from 'owa-task-queue';
import { fetchAndCacheTokenForResource } from '../getAccessTokenforResource';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';

const MAX_NUM_OF_GET_ACCESS_TOKEN_REQUESTS = 3;
const DELAY_FOR_GET_ACCESS_TOKEN_REQUESTS = 500; /* Task Delay */

let getAccessTokenQueue: TaskQueue<QueueEntry>;

export interface QueueEntry {
    onFulfilled: Function;
    onRejected: Function;
    resource: string;
    requestId: string;
    apiName?: string;
    targetTenantId?: string;
    wwwAuthenticateHeader?: string;
    preferIdpToken?: boolean;
}

/**
 * This throttles GetAccessTokenForResource server requests
 * by adding a delay of 500 ms
 */
function getQueue(): TaskQueue<QueueEntry> {
    if (getAccessTokenQueue == null) {
        getAccessTokenQueue = new TaskQueue<QueueEntry>(
            MAX_NUM_OF_GET_ACCESS_TOKEN_REQUESTS,
            getAccessTokenForResourceTask,
            DELAY_FOR_GET_ACCESS_TOKEN_REQUESTS
        );
    }
    return getAccessTokenQueue;
}

/**
 * enqueue this resource string
 * along with a success and an error callback to TaskQueue
 */
export function enqueue(
    res: string,
    requestId: string,
    apiName?: string,
    targetTenantId?: string,
    wwwAuthenticateHeader?: string,
    preferIdpToken?: boolean
): Promise<TokenResponse> {
    /* tslint:disable-next-line:promise-must-complete */
    return new Promise<TokenResponse>((resolve, reject) => {
        getQueue().add({
            onFulfilled: resolve,
            onRejected: reject,
            resource: res,
            requestId: requestId,
            apiName: apiName,
            targetTenantId: targetTenantId,
            wwwAuthenticateHeader: wwwAuthenticateHeader,
            preferIdpToken: preferIdpToken,
        });
    });
}

/**
 * Task callback method to run when it is
 * this entry's turn to process
 */
export function getAccessTokenForResourceTask(entry: QueueEntry) {
    fetchAndCacheTokenForResource(
        entry.resource,
        entry.apiName,
        entry.requestId,
        entry.targetTenantId,
        entry.wwwAuthenticateHeader,
        entry.preferIdpToken
    )
        .then((tokenResponse: TokenResponse) => {
            entry.onFulfilled(tokenResponse);
        })
        .catch(error => {
            entry.onRejected(error);
        });
    return Promise.resolve();
}
