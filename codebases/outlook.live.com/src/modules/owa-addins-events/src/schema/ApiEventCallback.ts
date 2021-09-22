import type ApiEventResponseCode from './ApiEventResponseCode';

/**
 * Event Callback for ApiEvents
 */
export interface ApiEventCallback {
    /**
     * Event Handler Function Definition
     * @param {ApiEventCallbackArgs} args Indicates the status code for the callback
     */
    (args: ApiEventCallbackArgs): void;
}

/**
 * Represents the response args returned in an Api Event Callback
 *
 * @interface ApiEventResponseArgs
 */
export interface ApiEventCallbackArgs {
    /**
     * Dictionary of response args
     *
     * @type {Dictionary}
     */
    [index: string]: ApiEventResponseCode;
}

/**
 * Creates an ApiEventCallbackArgs object to pass to a callback with the specified error code
 * @param {string} errorCode The error code to pass back to the client
 */
export function createApiEventCallbackArgs(errorCode: ApiEventResponseCode): ApiEventCallbackArgs {
    const apiEventCallbackArgs: {
        [index: string]: ApiEventResponseCode;
    } = {};
    const key = 'Error';
    apiEventCallbackArgs[key] = errorCode;
    return apiEventCallbackArgs;
}
