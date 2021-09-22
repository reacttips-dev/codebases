import { format } from 'owa-localize';
import { makeGetRequest } from 'owa-ows-gateway';
import type { CloudCacheConfigItem } from '../contracts/cloudCacheConfigItem';

import type WebSessionType from 'owa-service/lib/contract/WebSessionType';

const getCloudCacheAccountUrl: string = 'ows/api/v1/CloudCacheConfig?webSessionType={0}';

export async function getCloudCacheAccount(
    webSessionType: WebSessionType
): Promise<CloudCacheConfigItem> {
    let response = await makeGetRequest(
        format(getCloudCacheAccountUrl, webSessionType) /*requestUrl*/,
        undefined /*correlationId*/,
        false /*returnFullResponse*/,
        undefined /*customHeaders*/,
        false /*throwServiceError*/,
        true /*includeCredentials*/
    );

    if (response) {
        return response[0];
    }

    return null;
}
