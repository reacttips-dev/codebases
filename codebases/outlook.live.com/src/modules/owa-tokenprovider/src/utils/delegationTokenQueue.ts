import { TaskQueue } from 'owa-task-queue';
import type TokenResponse from 'owa-service/lib/contract/TokenResponse';
import { Options, fetchDelegationAccessTokenFromMsa } from '../fetchDelegationAccessTokenFromMsa';

const MAX_NUM_OF_GET_DELEGATION_TOKEN_REQUESTS = 3;
const DELAY_FOR_GET_DELEGATION_TOKEN_REQUESTS = 1500; /* Task Delay */

let delegationTokenQueue: TaskQueue<QueueEntry>;

export interface QueueEntry {
    onFulfilled: Function;
    onRejected: Function;
    options: Options;
}

/**
 * This throttles getDelegationTokenForOwa requests
 * by adding a delay of 500 ms
 */
function getDelegationTokenQueue(): TaskQueue<QueueEntry> {
    if (delegationTokenQueue == null) {
        delegationTokenQueue = new TaskQueue<QueueEntry>(
            MAX_NUM_OF_GET_DELEGATION_TOKEN_REQUESTS,
            getDelegationTokenTask,
            DELAY_FOR_GET_DELEGATION_TOKEN_REQUESTS
        );
    }
    return delegationTokenQueue;
}

/**
 * enqueue these options
 * along with a success and an error callback to TaskQueue
 */
export function enqueue(opts: Options): Promise<TokenResponse> {
    /* tslint:disable-next-line:promise-must-complete */
    return new Promise<TokenResponse>((resolve, reject) => {
        getDelegationTokenQueue().add({
            onFulfilled: resolve,
            onRejected: reject,
            options: opts,
        });
    });
}

export function getDelegationTokenTask(entry: QueueEntry) {
    fetchDelegationAccessTokenFromMsa(entry.options)
        .then((tokenResponse: TokenResponse) => {
            entry.onFulfilled(tokenResponse);
        })
        .catch(error => {
            entry.onRejected(error);
        });
    return Promise.resolve();
}
