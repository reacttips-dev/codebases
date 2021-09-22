import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReadWriteRecipientZeroQuery" */ './lazyIndex')
);

export let lazyGetZeroQueryResults = new LazyImport(lazyModule, m => m.getZeroQueryResults);
