import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TokenProviderAsync" */ './lazyIndex')
);

export let lazyGetAccessTokenforResource = new LazyAction(
    lazyModule,
    m => m.getAccessTokenforResource
);
