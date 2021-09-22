import type ApiErrorCode from './ApiErrorCode';
import { ApiMethodResponse, ApiMethodResultStatus } from './ApiMethod';
import type { SsoErrorCode } from 'owa-addins-sso';

export function createSuccessResult(response: any = null): ApiMethodResponse {
    return {
        error: ApiMethodResultStatus.Success,
        data: response,
    };
}

export function createErrorResult(response?: ApiErrorCode | SsoErrorCode): ApiMethodResponse {
    return {
        error: ApiMethodResultStatus.Failed,
        errorCode: response,
    };
}
