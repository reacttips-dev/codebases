import type InitialData from './getInitialData/InitialData';
import type { ApiErrorCode } from './ApiErrorCode';
import type { CustomPropertiesResult } from './customProperties/CustomPropertiesResult';
import type { EwsProxyAsyncResult } from './ews/EwsProxyAsyncResult';
import type { SsoErrorCode } from 'owa-addins-sso';
import type { TokenAsyncResult } from './token/TokenAsyncResult';

export enum ApiMethodResultStatus {
    Success = 0,
    Failed = 1,
}

export interface ApiMethodCallback {
    (asyncResult: ApiMethodResponse): void;
}

export type ApiMethodResponse =
    | ApiMethodResult
    | EwsProxyAsyncResult
    | InitialData
    | TokenAsyncResult
    | CustomPropertiesResult;

export interface ApiMethodResult {
    error: ApiMethodResultStatus;
    data?: any;
    errorCode?: ApiErrorCode | SsoErrorCode;
}
