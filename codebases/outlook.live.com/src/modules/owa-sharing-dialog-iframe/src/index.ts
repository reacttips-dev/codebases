import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OWASharingDialogIframe" */ './lazyIndex')
);

// Delay loaded imports
export const lazyOpenSharingDialogIframe = new LazyImport(lazyModule, m => m.sharingDialog);
export const lazyPreloadIframeSharingDialogUrl = new LazyImport(
    lazyModule,
    m => m.preloadIframeSharingDialogUrl
);

export type { SharingDialogResponse } from './types/SharingDialogResponse';
