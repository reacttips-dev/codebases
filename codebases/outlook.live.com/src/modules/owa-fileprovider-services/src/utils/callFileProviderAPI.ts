import { getFileProviderAuthHeaderValue } from 'owa-fileprovider-accesstoken-service';
import type AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

/*
Because of the security policies with different organizations, it's not allowed to send ODB client token to those users.
Without client token, the following call will fail.
Please use fetchService for ODB provider as it provides server fallback when the client token is not available.
*/
export default async function callFileProviderAPI(
    url: string,
    providerType: AttachmentDataProviderType,
    optionalParams: {
        forceTokenRefresh?: boolean;
        requestInit?: RequestInit;
    } = { forceTokenRefresh: false, requestInit: {} }
): Promise<Response> {
    const forceTokenRefresh = optionalParams.forceTokenRefresh;
    const requestInit = optionalParams.requestInit || {};
    const authHeader = await getFileProviderAuthHeaderValue(providerType, forceTokenRefresh, url);

    if (!requestInit.headers) {
        requestInit.headers = new Headers();
    }

    (<Headers>requestInit.headers).set('Authorization', authHeader);

    const response: Response = await fetch(url, requestInit);

    return response;
}
