import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFilterActions"*/ './lazyIndex')
);

export let lazySelectFilter = new LazyAction(lazyModule, m => m.selectFilter);
export let lazySelectSort = new LazyAction(lazyModule, m => m.selectSort);
export let lazyTogglePauseInbox = new LazyAction(lazyModule, m => m.togglePauseInbox);
export let lazyClearFilter = new LazyAction(lazyModule, m => m.clearFilter);
export let lazyLoadSpotlightFilter = new LazyAction(lazyModule, m => m.loadSpotlightFilter);
export let lazyClearSpotlightFilter = new LazyAction(lazyModule, m => m.clearSpotlightFilter);
