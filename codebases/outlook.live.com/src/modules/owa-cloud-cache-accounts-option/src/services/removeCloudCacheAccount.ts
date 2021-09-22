import { makeDeleteRequest } from 'owa-ows-gateway';

const removeCloudCacheAccountUrl: string = 'ows/api/v1/CloudCacheConfig';

export async function removeCloudCacheAccount() {
    await makeDeleteRequest(
        removeCloudCacheAccountUrl /*requestUrl*/,
        undefined /*requestObject*/,
        undefined /*correlationId*/,
        false /*returnFullResponse*/,
        undefined /*customHeaders*/,
        false /*throwServiceError*/,
        true /*includeCredentials*/
    );
}
