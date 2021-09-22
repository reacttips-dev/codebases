import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FileProviderLink"*/ './lazyIndex')
);

export const lazyCreateGetSharingInfoResponse = new LazyImport(
    lazyModule,
    m => m.createGetSharingInfoResponse
);

export const lazyCheckSharingLinkUrlDomain = new LazyImport(
    lazyModule,
    m => m.checkSharingLinkUrlDomain
);

export const lazyGetLinkProviderType = new LazyImport(lazyModule, m => m.getLinkProviderType);

export const lazyIsOneDriveProRelatedLink = new LazyImport(
    lazyModule,
    m => m.isOneDriveProRelatedLink
);

export const lazyConvertToAttachmentDataProviderType = new LazyImport(
    lazyModule,
    m => m.convertToAttachmentDataProviderType
);

export const lazyConvertToLinkProviderType = new LazyImport(
    lazyModule,
    m => m.convertToLinkProviderType
);

export { LinkProviderType } from './types/LinkProviderType';
