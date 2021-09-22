import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "DocLinkHandler" */ './lazyIndex')
);

export const lazyTryProcessOneDriveLink = new LazyImport(lazyModule, m => m.tryProcessOneDriveLink);

export const lazyTryUndoProcessOneDriveLink = new LazyImport(
    lazyModule,
    m => m.tryUndoProcessOneDriveLink
);

export const lazyTryManageOneDriveLinksState = new LazyImport(
    lazyModule,
    m => m.tryManageOneDriveLinksState
);

export const lazyDocLinkHadPreviewInfo = new LazyImport(lazyModule, m => m.docLinkHadPreviewInfo);
export const lazyForceGetWacInfoOperation = new LazyImport(
    lazyModule,
    m => m.forceGetWacInfoOperation
);

export const lazyGetValidDocLinkPreviewInfo = new LazyImport(
    lazyModule,
    m => m.getValidDocLinkPreviewInfo
);

export const lazyForceGetValidDocLinkPreviewInfo = new LazyImport(
    lazyModule,
    m => m.forceGetValidDocLinkPreviewInfo
);

export const lazyCheckSafelinkAndOpenLinkInSxS = new LazyImport(
    lazyModule,
    m => m.checkSafelinkAndOpenLinkInSxS
);
export {
    previewLinkInSxS,
    previewBeautifulLinkImageInSxSFromReadingPane,
    verifyLinkData,
} from './actions/publicActions';
