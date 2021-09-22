import type * as imports from './lazyIndex';
import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';
import type { SxSViewState } from 'owa-sxsdata';

const lazyModule = new LazyModule<typeof imports>(
    () => import(/* webpackChunkName: "GroupFilesHubStore" */ './lazyIndex')
);

export const lazyGetSxSStoreViewState = new LazyImport<
    () => SxSViewState,
    LazyModule<typeof imports>
>(lazyModule, m => m.getSxSStoreViewState);

export const lazyResetSxSViewStoreAction = new LazyAction(
    lazyModule,
    m => m.resetSxSViewStoreAction
);
