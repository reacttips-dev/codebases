import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "owa-headers-refresh-token"*/ './lazyIndex')
);

export const lazyGetAndUpdateAccessToken = new LazyAction(
    lazyModule,
    m => m.getAndUpdateAccessToken
);

export { triggerReInitializeAccount } from './publicActions';
