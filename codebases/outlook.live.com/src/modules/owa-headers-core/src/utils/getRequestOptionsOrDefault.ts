import type RequestOptions from 'owa-service/lib/RequestOptions';

export function getRequestOptionsOrDefault(requestOptions?: RequestOptions): RequestOptions {
    let defaultRequestOptions: RequestOptions = requestOptions ?? {
        headers: new Headers(),
    };
    defaultRequestOptions.datapoint = defaultRequestOptions.datapoint || {};
    defaultRequestOptions.datapoint.mailbox = 'Default';
    return defaultRequestOptions;
}
