import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "AttachmentSuggestions" */ './lazyIndex')
);

// Lazy exports
export const lazyClearCachedAttachmentSuggestions = new LazyImport(
    lazyModule,
    m => m.clearCachedAttachmentSuggestions
);
export const lazyGetAttachmentSuggestionsAction = new LazyImport(
    lazyModule,
    m => m.getAttachmentSuggestionsAction
);

export const lazyCreateCloudFileFromAttachmentData = new LazyImport(
    lazyModule,
    m => m.createCloudFileFromAttachmentData
);

export const lazyGetAttachmentSuggestionsMenuItems = new LazyImport(
    lazyModule,
    m => m.getAttachmentSuggestionsMenuItems
);

export const lazyGetAttachmentSuggestionsTraceId = new LazyImport(
    lazyModule,
    m => m.getAttachmentSuggestionsTraceId
);

export const lazyGetAttachmentSuggestionsTraceIdByComposeId = new LazyImport(
    lazyModule,
    m => m.getAttachmentSuggestionsTraceIdByComposeId
);

export const lazyLogEntitiesFromFilePicker = new LazyAction(
    lazyModule,
    m => m.logEntitiesFromFilePicker
);

// Synchronous exports
export { ReplyWithEndpointType } from './store/schema/AttachmentSuggestions';
export type { ReplyWithAttachmentSuggestion } from './store/schema/AttachmentSuggestions';
export type { default as AttachmentSuggestionsMenuItems } from './utils/AttachmentSuggestionsMenuItems';
export { replyWithMenuHeaderText } from './utils/getAttachmentSuggestionsMenuItems.locstring.json';

export type {
    RecommendationServiceODataMessage,
    RecommendationServiceODataMessageRecipient,
} from './types/RecommendationServiceODataMessage';
