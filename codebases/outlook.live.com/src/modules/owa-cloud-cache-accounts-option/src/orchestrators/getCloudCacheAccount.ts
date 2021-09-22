import { orchestrator } from 'satcheljs';
import { getCloudCacheAccount as getCloudCacheAccountAction } from '../actions/getCloudCacheAccount';
import { getCloudCacheAccount } from '../services/getCloudCacheAccount';
import setCloudCacheAccountState from '../mutators/setCloudCacheAccountState';

orchestrator(getCloudCacheAccountAction, async getCloudCacheAccountActionMessage => {
    const { webSessionType } = getCloudCacheAccountActionMessage;
    const response = await getCloudCacheAccount(webSessionType);
    setCloudCacheAccountState(response);
});
