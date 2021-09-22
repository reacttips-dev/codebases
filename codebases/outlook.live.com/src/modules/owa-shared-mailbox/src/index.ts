import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SharedMailbox"*/ './lazyIndex')
);

export const lazyGetIsSharedMailbox = new LazyAction(lazyModule, m => m.getIsSharedMailbox);
export { default as isSharedMailbox } from './utils/isSharedMailbox';
