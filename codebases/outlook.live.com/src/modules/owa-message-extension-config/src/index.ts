import { LazyModule, LazyAction } from 'owa-bundling';

// lazy loaded modules
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MessageExtensionConfig"*/ './lazyIndex')
);

export const lazyInitializeMessageExtension = new LazyAction(
    lazyModule,
    m => m.initializeMessageExtension
);

export { default as isSearchMessageExtensionEnabled } from './utils/isSearchMessageExtensionEnabled';
