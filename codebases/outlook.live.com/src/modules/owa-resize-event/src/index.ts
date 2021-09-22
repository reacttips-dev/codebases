import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ResizeEvent" */ './lazyIndex')
);

export let lazySubscribeToResizeEvent = new LazyAction(lazyModule, m => m.subscribe);
export let lazyUnsubscribeFromResizeEvent = new LazyAction(lazyModule, m => m.unsubscribe);
export let lazyTriggerResizeEvent = new LazyAction(lazyModule, m => m.trigger);
export let lazyRemoveResizeEventEmitter = new LazyAction(
    lazyModule,
    m => m.removeResizeEventEmitter
);
