import type { BaseRequestOptions } from 'owa-analytics-types/lib/types/BaseRequestOptions';

export enum CustomBaseUrl {
    AnonymousCalendar = '/owa/calendar',
}

// We can not use for..of or any other iterator for headers
// as it is not supported on some older version of Edge e.g. 15.15063, 14.14393.
// We also can't use forEach to iterate over headers as it is also not supported
// in all browsers e.g. Firefox. Hence we create this type without iterators.
export type HeadersWithoutIterator = Omit<Headers, 'entries' | 'keys' | 'values' | 'forEach'>;

export type OnBeforeRetry = (
    r: Response
) => Promise<{ endpoint?: string; delay?: number } | undefined>;

export interface RequestOptions extends BaseRequestOptions {
    headers?: HeadersWithoutIterator;
    method?: string;
    returnFullResponseOnSuccess?: boolean;
    isUserActivity?: boolean;
    noEmptyPost?: boolean;
    authNeededOnUnAuthorized?: boolean;
    customBaseUrl?: CustomBaseUrl;
    customBaseUrlSubPath?: string;
    priority?: number;
    timeoutMS?: number;
    endpoint?: string;
    shouldRetry?: (status: number) => boolean;
    onBeforeRetry?: OnBeforeRetry;
    retryCount?: number;
    returnResponseHeaders?: boolean;
    sourceId?: string; // The sourceId of the account for which the request is being made. Will be set by web resolvers.
}

export interface InternalRequestOptions extends Omit<RequestOptions, 'headers'> {
    headers: Exclude<RequestOptions['headers'], undefined>; // headers are not optional
    credentials?: RequestCredentials;
    body?: string;
}

export default RequestOptions;
