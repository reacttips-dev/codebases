import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "immersiveReaderStore" */ './lazyIndex')
);

export let lazyShowInImmersiveReader = new LazyAction(lazyModule, m => m.showInImmersiveReader);
export let lazyCloseImmersiveReader = new LazyAction(lazyModule, m => m.closeImmersiveReader);
export let lazySetImmersiveReaderFrameReady = new LazyAction(
    lazyModule,
    m => m.setImmersiveReaderFrameReady
);

// Non-delayed loaded exports
export { default as store, getStore } from './store/Store';
export { default as ImmersiveReaderFrameState } from './store/schema/ImmersiveReaderFrameState';
