import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "AdalAuth"*/ './lazyIndex'));

export const lazyCreateAdalAuthenticationContext = new LazyAction(
    lazyModule,
    m => m.createAdalAuthenticationContext
);
