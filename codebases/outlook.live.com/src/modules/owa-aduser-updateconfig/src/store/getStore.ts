import type UserAdConfigStoreOption from './UserAdConfigStoreOption';

import { createStore } from 'satcheljs';

export default createStore<UserAdConfigStoreOption>('userAdConfigStore', {
    nativeAdsClickedRunningSum: null,
    nativeAdsSeenRunningSum: null,
    nativeCPMRunningSum: null,
    wasAdLastSeenInLastSession: null,
    wasAdLastSeenInLastSessionValue: null,
});
