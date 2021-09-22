import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';
import type { LazyActionOptions } from 'owa-bundling-light';

// import owa-options-message-options to load the message options not included in sessionData
// import owa-recipient-cache to kick off the cache preload

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailComposeActions"*/ './lazyIndex')
);

const options: LazyActionOptions = {
    captureBundleTime: true,
};

export type { ReplyToMessageAndCreateViewStateOptions } from './actions/replyToMessage';

export let lazyReplyToMessage = new LazyAction(lazyModule, m => m.replyToMessage, options);
export let lazyForwardMessage = new LazyAction(lazyModule, m => m.forwardMessage, options);
export let lazyCloseCompose = new LazyAction(lazyModule, m => m.closeCompose);
export let lazyDiscardCompose = new LazyAction(lazyModule, m => m.discardCompose);
export let lazyLoadDraftToCompose = new LazyAction(lazyModule, m => m.loadDraftToCompose);
export let lazyOpenCompose = new LazyAction(lazyModule, m => m.openCompose);
export let lazyTrySaveAndCloseCompose = new LazyAction(lazyModule, m => m.trySaveAndCloseCompose);
export let lazyMoveComposeToTab = new LazyAction(lazyModule, m => m.moveComposeToTab);
export let lazyTryCreateResendDraft = new LazyAction(lazyModule, m => m.tryCreateResendDraft);
export let lazyReplyToApprovalMessage = new LazyAction(lazyModule, m => m.replyToApprovalMessage);
export const lazyOnEditDraftButtonClicked = new LazyAction(
    lazyModule,
    m => m.onEditDraftButtonClicked
);

// Delay loaded utilities
export let lazyCreateReply = new LazyImport(lazyModule, m => m.createReply);
export let lazyGetToCcRecipientsForReply = new LazyImport(
    lazyModule,
    m => m.getToCcRecipientsForReply
);
export let lazyReplyToMessageAndCreateViewState = new LazyImport(
    lazyModule,
    m => m.replyToMessageAndCreateViewState
);
export let lazyCreateAttachments = new LazyImport(lazyModule, m => m.createAttachments);
export let lazyExtractComposePopoutData = new LazyImport(
    lazyModule,
    m => m.extractComposePopoutData
);
