import { LazyModule, LazyAction, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "IrisAsync" */ './lazyIndex'));
export let lazyInitializeBizBarIrisState = new LazyAction(
    lazyModule,
    m => m.initializeUpsellBarState
);
export let lazyInitializeLeftNavUpsellState = new LazyAction(
    lazyModule,
    m => m.initializeLeftNavUpsellState
);
export let lazyArcStore = new LazyImport(lazyModule, m => m.ArcStore);
export let lazyBizBarArcStore = new LazyImport(lazyModule, m => m.BizBarArcStore);
export let lazyLogImpressionCall = new LazyAction(lazyModule, m => m.makeImpressionCall);
export let lazyLogBeaconCall = new LazyAction(lazyModule, m => m.makeBeaconCall);
