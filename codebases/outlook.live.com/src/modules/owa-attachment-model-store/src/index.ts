import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentModelStore"*/ './lazyIndex')
);

// Delay loaded actions
export const lazyAddAndInitializeAttachments = new LazyAction(
    lazyModule,
    m => m.addAndInitializeAttachments
);

export const lazySetPreviewImageUrl = new LazyAction(lazyModule, m => m.setPreviewImageUrl);
export const lazyRefreshDownloadUrl = new LazyAction(lazyModule, m => m.refreshDownloadUrl);
export const lazyCreateAttachmentInfo = new LazyAction(lazyModule, m => m.createAttachmentInfo);
export const lazySetAttachmentInfo = new LazyAction(lazyModule, m => m.setAttachmentInfo);

export const lazyRefreshThumbnailImageUrl = new LazyAction(
    lazyModule,
    m => m.refreshThumbnailImageUrl
);

export const lazyRefreshPreviewImageUrl = new LazyAction(lazyModule, m => m.refreshPreviewImageUrl);

// Delay loaded imports
export const lazyGetAttachment = new LazyImport(lazyModule, m => m.getAttachment);

export const lazyCheckPendingAttachmentOperation = new LazyImport(
    lazyModule,
    m => m.checkPendingAttachmentOperation
);

export const lazyShouldShowImageView = new LazyImport(lazyModule, m => m.shouldShowImageView);

// SatchelV3 actions:
export {
    refreshSharingTipsForAttachment,
    setAttachmentContentId,
    setAttachmentIsInline,
} from './actions/satchelV3Actions/publicActions';

export { default as AttachmentClass } from './store/schema/AttachmentClass';
export { default as attachmentStore } from './store/store';

export type {
    default as AttachmentInitializationParameters,
    AttachmentModelPropertyValues,
} from './store/schema/AttachmentInitializationParameters';
export type { default as AttachmentType } from 'owa-service/lib/contract/AttachmentType';
export type { ClientAttachmentId } from 'owa-client-ids';
export { default as isSmimeAttachmentType, isSmimeAttachment } from './utils/isSmimeAttachmentType';
export type { default as SmimeAttachmentType } from './store/schema/SmimeAttachmentType';

export type {
    default as AttachmentModel,
    ReferenceAttachmentModel,
} from './store/schema/AttachmentModel';
export type { default as AttachmentInfo } from './store/schema/AttachmentInfo';
