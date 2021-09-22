import { orchestrator } from 'satcheljs';
import { removeCloudCacheAccount as removeCloudCacheAccountAction } from '../actions/removeCloudCacheAccount';
import { removeCloudCacheAccount } from '../services/removeCloudCacheAccount';
import { getCloudCacheAccount } from '../actions/getCloudCacheAccount';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { store } from '../store/store';
import { logUsage } from 'owa-analytics';

orchestrator(removeCloudCacheAccountAction, async function getCloudCacheAccountAction() {
    await removeCloudCacheAccount();

    logUsage(
        'RemoveCloudCacheConfig',
        [
            store.cloudCacheConfigItem.accountType,
            store.cloudCacheConfigItem.shadowMailboxPuid,
            store.cloudCacheConfigItem.exchangeMailboxPuid,
        ],
        { isCore: true }
    );

    getCloudCacheAccount(getUserConfiguration().SessionSettings.WebSessionType);
});
