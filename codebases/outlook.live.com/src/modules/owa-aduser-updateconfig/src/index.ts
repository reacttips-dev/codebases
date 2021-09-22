import './orchestrators/updateUserAdConfigOrchestrators';
import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaAdUserUpdateConfig" */ './lazyIndex')
);

export const increaseNativeAdsClickedRunningSumLazy = new LazyAction(
    lazyModule,
    m => m.increaseNativeAdsClickedRunningSum
);
export const increaseNativeAdsSeenRunningSumLazy = new LazyAction(
    lazyModule,
    m => m.increaseNativeAdsSeenRunningSum
);
export const updateNativeCPMRunningSumLazy = new LazyAction(
    lazyModule,
    m => m.updateNativeCPMRunningSum
);
export const updateWasAdLastSeenInLastSessionLazy = new LazyAction(
    lazyModule,
    m => m.updateWasAdLastSeenInLastSession
);
