import { ApiMethodResultStatus } from '../ApiMethod';
import type { SsoErrorCode } from 'owa-addins-sso';

const OSF_ERROR_KEY = 'Error';
const ACCESS_TOKEN_KEY = 'accessToken';

export function createOsfErrorResult(error: SsoErrorCode): any {
    return {
        [OSF_ERROR_KEY]: error,
    };
}

export function createOsfSuccessResult(data: string): any {
    return {
        [OSF_ERROR_KEY]: ApiMethodResultStatus.Success,
        [ACCESS_TOKEN_KEY]: data,
    };
}
