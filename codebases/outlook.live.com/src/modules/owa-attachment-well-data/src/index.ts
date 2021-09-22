import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

export { default as onAttachmentCreated } from './actions/onAttachmentCreated';
export { default as onAttachmentDeleted } from './actions/onAttachmentDeleted';
export type { default as AttachmentWellViewState } from './schema/AttachmentWellViewState';
export type { default as ConversationAttachmentWellViewState } from './schema/ConversationAttachmentWellViewState';
export { default as ImageLoadState } from 'owa-attachment-data/lib/schema/ImageLoadState';
export type { default as AttachmentFullViewState } from 'owa-attachment-full-data/lib/schema/AttachmentFullViewState';
export type { default as AttachmentState } from 'owa-attachment-full-data/lib/schema/AttachmentState';
export { default as AttachmentStateType } from 'owa-attachment-full-data/lib/schema/AttachmentStateType';
export { default as InlineAttachmentStatus } from 'owa-attachment-full-data/lib/schema/InlineAttachmentStatus';
export type { default as AttachmentId } from 'owa-service/lib/contract/AttachmentId';
export type { default as AttachmentType } from 'owa-service/lib/contract/AttachmentType';

export type {
    CreateAttachmentsProperties,
    ShareAttachmentProperties,
    ShouldShareAttachment,
} from './types/CreateAttachmentsProperties';
export type { AttachmentFileList } from 'owa-attachment-file-types';
export type { AttachmentFile } from 'owa-attachment-file-types';

export type {
    OnAttachmentCreatedCallback,
    OnAttachmentCanceledOrFailedCallback,
} from './types/AttachmentUploadQueueItem';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Attachments"*/ './lazyIndex'));

// Delayed Loaded Actions
export const lazyInitializeAttachments = new LazyAction(lazyModule, m => m.initializeAttachments);

export const lazyReinitializeAttachments = new LazyAction(
    lazyModule,
    m => m.reinitializeAttachments
);

export const lazySetInlineAttachmentStatus = new LazyAction(
    lazyModule,
    m => m.setInlineAttachmentStatus
);

export const lazyAddAttachmentIntoWellBeforeUpload = new LazyAction(
    lazyModule,
    m => m.addAttachmentIntoWellBeforeUpload
);

export const lazyRefreshSharingTipsAttachmentWell = new LazyImport(
    lazyModule,
    m => m.refreshSharingTipsAttachmentWell
);

// Delay Loaded utils
export const lazyCreateAttachmentsViaQueueManager = new LazyImport(
    lazyModule,
    m => m.createAttachmentsViaQueueManager
);

export const lazycreateAttachmentsFromRecentAttachments = new LazyImport(
    lazyModule,
    m => m.createAttachmentsFromRecentAttachments
);

export const lazyDeleteAttachmentsViaQueueManager = new LazyAction(
    lazyModule,
    m => m.deleteAttachmentViaQueueManager
);

export const lazyCreateAttachmentFullViewStateAndStoreBackingModel = new LazyImport(
    lazyModule,
    m => m.createAttachmentFullViewStateAndStoreBackingModel
);

export const lazyCreateAttachmentViewState = new LazyImport(
    lazyModule,
    m => m.createAttachmentFullViewState
);

export const lazyGetAttachmentWellInitialValue = new LazyImport(
    lazyModule,
    m => m.getAttachmentWellInitialValue
);

export const lazyGetAttachmentWellForCompose = new LazyImport(
    lazyModule,
    m => m.getAttachmentWellForCompose
);

export const lazyGetConversationAttachmentWellInitialValue = new LazyImport(
    lazyModule,
    m => m.getConversationAttachmentWellInitialValue
);

export const lazyGetMaxClassicAttachmentsSize = new LazyImport(
    lazyModule,
    m => m.getMaxClassicAttachmentsSize
);

export const lazyGetAvailableLocalAttachmentSize = new LazyImport(
    lazyModule,
    m => m.getAvailableLocalAttachmentSize
);

export const lazyCreateAttachmentFileFromExistingMailboxAttachment = new LazyImport(
    lazyModule,
    m => m.createAttachmentFileFromExistingMailboxAttachment
);

export const lazyMergeToConversationAttachmentWell = new LazyAction(
    lazyModule,
    m => m.mergeToConversationAttachmentWell
);

export const lazySortConversationAttachmentWell = new LazyAction(
    lazyModule,
    m => m.sortConversationAttachmentWell
);

export const lazyConvertImageViewAttachmentToInlineAttachment = new LazyAction(
    lazyModule,
    m => m.convertImageViewAttachmentToInlineAttachment
);

export const lazyGetLastCloudyAttachmentsSharingIssueForBlockOnSend = new LazyImport(
    lazyModule,
    m => m.getLastCloudyAttachmentsSharingIssueForBlockOnSend
);

export const lazyGetAllValidAttachments = new LazyImport(lazyModule, m => m.getAllValidAttachments);

export const lazyUploadLocalFile = new LazyImport(lazyModule, m => m.uploadLocalFile);
