export {
    default as getFileProviderAuthHeaderValue,
    getFileProviderAccessToken,
    getOneDriveProAccessTokenForResource,
    clearToken as clearFileProviderToken,
    isTokenRetrievalError,
} from './getAuthToken/getFileProviderAuthHeaderValue';
export type { TokenRetrievalError } from './getAuthToken/getFileProviderAuthHeaderValue';

export { BEARER_TOKEN_HEADER_PREFIX } from './constants';
