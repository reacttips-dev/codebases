import { orchestrator } from 'satcheljs';
import { addCloudCacheAccount as addCloudCacheAccountAction } from '../actions/addCloudCacheAccount';
import { addCloudCacheAccount } from '../services/addCloudCacheAccount';
import setCloudCacheAccountState from '../mutators/setCloudCacheAccountState';
import { store } from '../store/store';
import { logUsage } from 'owa-analytics';

orchestrator(addCloudCacheAccountAction, async function addCloudCacheAccountAction() {
    const response = await addCloudCacheAccount();
    setCloudCacheAccountState(response);

    logUsage(
        'AddCloudCacheConfig',
        [
            store.cloudCacheConfigItem.accountType,
            store.cloudCacheConfigItem.shadowMailboxPuid,
            store.cloudCacheConfigItem.exchangeMailboxPuid,
        ],
        { isCore: true }
    );
});
