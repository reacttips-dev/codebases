import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "UserActivityManager" */ './lazyIndex')
);

export let lazyIsUserIdle = new LazyAction(lazyModule, m => m.isUserIdle);
export let lazyRegisterClickLagReport = new LazyAction(lazyModule, m => m.registerClickLagReport);
export let lazyGetClickReport = new LazyAction(lazyModule, m => m.getClickReport);
export type { ClickReport } from './userActivityManager';
