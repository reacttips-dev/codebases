import { makePostRequest } from 'owa-ows-gateway';

const addCloudCacheAccountUrl: string = 'ows/api/v1/CloudCacheConfig/';

export async function addCloudCacheAccount() {
    let response = await makePostRequest(
        addCloudCacheAccountUrl /*requestUrl*/,
        undefined /*requestObject*/,
        undefined /*correlationId*/,
        false /*returnFullResponse*/,
        undefined /*customHeaders*/,
        false /*throwServiceError*/,
        false /*sendPayloadAsBody*/,
        true /*includeCredentials*/
    );

    return response;
}
