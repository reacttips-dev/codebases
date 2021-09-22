import { createStore } from 'satcheljs';
import type { CloudCacheStore } from './cloudCacheStore';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';

const cloudCacheStore: CloudCacheStore = {
    cloudCacheConfigItem: {
        accountType: WebSessionType.Business,
        emailAddress: null,
        shadowMailboxPuid: null,
        exchangeSmtpAddress: null,
        exchangeMailboxPuid: null,
        id: null,
    },
};

export const store = createStore<CloudCacheStore>('cloudCacheStore', cloudCacheStore)();
