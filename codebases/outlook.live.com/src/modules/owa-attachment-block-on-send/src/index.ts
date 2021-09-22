import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentBlockSend"*/ './lazyIndex')
);

// Delay loaded Imports

export const lazyGetHasSharingIssues = new LazyImport(lazyModule, m => m.getHasSharingIssues);
export const lazyGetSharingLinkCountInBody = new LazyImport(
    lazyModule,
    m => m.getSharingLinkCountInBody
);
export const lazyGetPendingAttachmentString = new LazyImport(
    lazyModule,
    m => m.getPendingAttachmentString
);
export const lazyGetSharingIssuesString = new LazyImport(lazyModule, m => m.getSharingIssuesString);
export const lazyGetPendingPermissionErrorCode = new LazyImport(
    lazyModule,
    m => m.getPendingPermissionErrorCode
);

export const LazyPendingPermissionsDialog = createLazyComponent(
    lazyModule,
    m => m.PendingPermissionsDialog
);

export const LazySharingIssueBlockDialog = createLazyComponent(
    lazyModule,
    m => m.SharingIssueBlockDialog
);

// Preload
export { lazyModule as preloadAttachmentBlockOnSend };

export { setTelemetrySharingIssueState } from './actions/publicActions';
