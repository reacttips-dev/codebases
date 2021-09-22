import { LazyImport, LazyModule } from 'owa-bundling';

/**
 * Makes a service call to fetch the primary mail folders.
 */
export const lazyFetchPrimaryMailFolders = new LazyImport(
    new LazyModule(() => import(/* webpackChunkName: "FetchFolders" */ './lazyIndex')),
    m => m.fetchPrimaryMailFolders
);
