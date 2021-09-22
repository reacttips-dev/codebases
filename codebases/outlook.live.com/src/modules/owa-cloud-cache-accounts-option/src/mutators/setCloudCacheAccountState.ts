import { store } from '../store/store';
import { mutatorAction } from 'satcheljs';
import type { CloudCacheConfigItem } from '../contracts/cloudCacheConfigItem';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';

export default mutatorAction(
    'setCloudCacheAccountState',
    function setCloudCacheAccountState(item: CloudCacheConfigItem) {
        if (!item) {
            store.cloudCacheConfigItem.accountType = WebSessionType.Business;
            store.cloudCacheConfigItem.emailAddress = null;
            store.cloudCacheConfigItem.shadowMailboxPuid = null;
            store.cloudCacheConfigItem.exchangeSmtpAddress = null;
            store.cloudCacheConfigItem.exchangeMailboxPuid = null;
            store.cloudCacheConfigItem.id = null;
        } else {
            if (item.accountType == WebSessionType.GMail) {
                store.cloudCacheConfigItem.accountType = item.accountType;
                store.cloudCacheConfigItem.emailAddress = item.emailAddress;
                store.cloudCacheConfigItem.shadowMailboxPuid = item.shadowMailboxPuid;
                store.cloudCacheConfigItem.exchangeSmtpAddress = item.exchangeSmtpAddress;
                store.cloudCacheConfigItem.exchangeMailboxPuid = item.exchangeMailboxPuid;
                store.cloudCacheConfigItem.id = item.id;
            }
        }
    }
);
