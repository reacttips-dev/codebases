import { action } from 'satcheljs';
import type WebSessionType from 'owa-service/lib/contract/WebSessionType';

export const getCloudCacheAccount = action(
    'getCloudCacheAccount',
    (webSessionType: WebSessionType) => ({
        webSessionType,
    })
);
