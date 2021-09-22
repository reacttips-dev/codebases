import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getRequestOptionsOrDefault } from 'owa-headers-core';

export function getRequestOptionsOrDefaultV2(requestOptions?: RequestOptions): RequestOptions {
    return getRequestOptionsOrDefault(requestOptions);
}
