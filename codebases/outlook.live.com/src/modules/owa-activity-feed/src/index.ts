import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ActivityFeedAsync" */ './lazyIndex')
);

export let ActivityFeed = createLazyComponent(lazyModule, m => m.ActivityFeed);
export let lazyInitializeActivityFeed = new LazyAction(lazyModule, m => m.initializeActivityFeed);
export { ActivityType } from './service/ActivityFeedStorageItem';
export let ActivityFeedTitle = createLazyComponent(lazyModule, m => m.ActivityFeedTitle);
export let lazyInitializePostWeveSignal = new LazyAction(lazyModule, m => m.postWeveSignal);
export let lazyLoadActivityFeed = new LazyAction(lazyModule, m => m.loadActivityFeed);
