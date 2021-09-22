import { LazyAction, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttPreviews" */ './lazyIndex')
);

export const lazyGetAttachmentPreviews = new LazyAction(lazyModule, m => m.getPreviews);
export const lazyAddAttachmentPreviews = new LazyAction(lazyModule, m => m.add);
export const lazyGetAttachmentsForConversationWell = new LazyAction(
    lazyModule,
    m => m.getAttachmentsForConversationWell
);
export const lazyRemoveAttachmentPreviews = new LazyAction(
    lazyModule,
    m => m.removeAttachmentPreviewsForRow
);

export {
    shouldShowAttachmentPreviewsForConversation,
    shouldShowAttachmentPreviewsForItem,
} from './helpers/shouldShowAttachmentPreviews';
