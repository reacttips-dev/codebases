import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MessageOptions"*/ './lazyIndex')
);

export let lazyLoadSignatureInUserOptions = new LazyAction(
    lazyModule,
    m => m.loadSignatureInUserOptions
);
