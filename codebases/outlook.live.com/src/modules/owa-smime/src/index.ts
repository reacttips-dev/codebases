import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "smime" */ './lazyIndex'));

// Actions
export const lazyOnSmimeItemAttachmentOpened = new LazyAction(
    lazyModule,
    m => m.onSmimeItemAttachmentOpened
);
export const lazyMergeSmimeDecodedMessageProperties = new LazyAction(
    lazyModule,
    m => m.mergeSmimeDecodedMessageProperties
);

// Utils
export const lazyFetchAndDecodeSmimeMessage = new LazyImport(
    lazyModule,
    m => m.fetchAndDecodeSmimeMessage
);
export const lazySetSmimePropertiesInDraftMessage = new LazyImport(
    lazyModule,
    m => m.setSmimePropertiesInDraftMessage
);
export const lazyTrySetSmimeProperties = new LazyImport(lazyModule, m => m.trySetSmimeProperties);
export const lazyTryAddSmimeProperties = new LazyImport(lazyModule, m => m.tryAddSmimeProperties);
export const lazyCreateMailResponseBodyContent = new LazyImport(
    lazyModule,
    m => m.createMailResponseBodyContent
);
export const lazyDownloadSmimeAttachment = new LazyImport(
    lazyModule,
    m => m.downloadSmimeAttachment
);
export const lazyGetMergedSmimeViewState = new LazyImport(
    lazyModule,
    m => m.getMergedSmimeViewState
);
export const lazyGetMergedSmimeViewStateForDraft = new LazyImport(
    lazyModule,
    m => m.getMergedSmimeViewStateForDraft
);
export const lazyIsSmimeItemDecoding = new LazyImport(lazyModule, m => m.isSmimeItemDecoding);
export const lazyPreviewSmimeAttachment = new LazyImport(lazyModule, m => m.previewSmimeAttachment);
export const lazyUpdateSmimeAttachmentIds = new LazyImport(
    lazyModule,
    m => m.updateSmimeAttachmentIds
);
export const lazyCreateSmimeAttachmentsFromFiles = new LazyImport(
    lazyModule,
    m => m.createSmimeAttachmentsFromFiles
);

export const lazyCreateSmimeAttachmentsViaSmimeQueueManager = new LazyImport(
    lazyModule,
    m => m.createSmimeAttachmentsViaSmimeQueueManager
);

export const lazyInitializeAttachmentStateForSmimeAttachments = new LazyImport(
    lazyModule,
    m => m.initializeAttachmentStateForSmimeAttachments
);

export const lazyGetAttachmentsForSmimeResponse = new LazyImport(
    lazyModule,
    m => m.getAttachmentsForSmimeResponse
);

export const lazyGetSmimeAttachmentsForRequest = new LazyImport(
    lazyModule,
    m => m.getSmimeAttachmentsForRequest
);

// Components
export const SignatureDetails = createLazyComponent(lazyModule, m => m.SignatureDetails);
