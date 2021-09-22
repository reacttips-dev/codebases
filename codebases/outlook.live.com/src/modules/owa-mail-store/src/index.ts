import { LazyAction, LazyModule } from 'owa-bundling';
// export action names and types
export { default as mailStore, getStore } from './store/Store';
export type { default as FrequentlyUsedFolder } from './store/schema/FrequentlyUsedFolder';
export type { default as ActionSource } from './store/schema/ActionSource';
export type { default as ConversationItemParts } from './store/schema/ConversationItemParts';
export type { default as ConversationReadingPaneNode } from './store/schema/ConversationReadingPaneNode';
export type { default as SmartReplyData } from './store/schema/SmartReplyData';
export type { SmartReplySuggestion } from './store/schema/SmartReplySuggestion';
export { SmartReplySuggestionType } from './store/schema/SmartReplySuggestionType';
export type { default as SmartDocData } from './store/schema/SmartDocData';
export type { default as TailoredXpData } from './store/schema/TailoredXpData';
export type { default as CollectionChange } from './store/schema/CollectionChange';
export { LocalLieState } from './store/schema/LocalLieState';
export type { default as ExtractedUrl } from './store/schema/ExtractedUrl';
export { default as MailListItemSelectionSource } from './store/schema/MailListItemSelectionSource';
export { default as getItem } from './services/getItem';
export { default as getConversationFromNodes } from './utils/getConversationFromNodes';
export { default as loadTailoredXpData } from './services/loadTailoredXpData';
export { default as selectMailStoreItemById } from './selectors/selectMailStoreItemById';
export { default as isValidConversationCache } from './selectors/isValidConversationCache';
export { default as conversationCache } from './store/conversationCache';
export { default as isValidMailFolder } from './utils/isValidMailFolder';
export type { default as ClientItem } from './store/schema/ClientItem';
export type { default as ClientMessage } from './store/schema/ClientMessage';
export type { default as SmartTimeSuggestion } from './store/schema/SmartTimeSuggestion';

export type {
    default as SmartTimeExtendedProperty,
    SmartTimeTrigger,
} from './store/schema/SmartTimeExtendedProperty';
export { default as isFolderUnderArchiveRoot } from './utils/isFolderUnderArchiveRoot';
export { isFolderOrSubFolderOfArchiveRoot } from './utils/isFolderUnderArchiveRoot';
export { default as isFolderUnderDeletedItemsFolder } from './utils/isFolderUnderDeletedItemsFolder';
export { default as isDeletedItemsFolderFromAnyMailbox } from './utils/isDeletedItemsFolderFromAnyMailbox';
export { default as isDumpsterFolderFromAnyMailbox } from './utils/isDumpsterFolderFromAnyMailbox';
export { default as isUnderDeletedItemsFolderFromAnyMailbox } from './utils/isUnderDeletedItemsFolderFromAnyMailbox';
export { default as getSelectedFolder } from './utils/getSelectedFolder';
export {
    getUserPermissionForFolderId,
    getUserPermissionForFolderIdWithErr,
} from './utils/getUserPermissionForFolderId';
export type { default as StampedLanguage } from './store/schema/StampedLanguage';
export { default as isShowFullEmailForEnterprise } from './utils/isShowFullEmailForEnterprise';
export type { default as PendingConversationRequestState } from './store/schema/PendingConversationRequestState';
export type { default as LoadConversationItemActionSource } from './store/schema/LoadConversationItemActionSource';
export { default as setIsDraftQueuedForSubmission } from './actions/setIsDraftQueuedForSubmission';
export { default as shouldShowUnstackedReadingPane } from './utils/shouldShowUnstackedReadingPane';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "mailStore" */ './lazyIndex'));

export const lazySetTriageActionAnnouncement = new LazyAction(
    lazyModule,
    m => m.setTriageActionAnnouncement
);
