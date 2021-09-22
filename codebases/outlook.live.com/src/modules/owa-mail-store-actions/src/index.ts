import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailStoreActions" */ './lazyIndex')
);

export const lazyLoadAllRecipientsForItem = new LazyAction(
    lazyModule,
    m => m.loadAllRecipientsForItem
);
export const lazyLoadItem = new LazyAction(lazyModule, m => m.loadItem);
export const lazyLoadConversation = new LazyAction(lazyModule, m => m.loadConversation);

export { default as deleteConversationItemParts } from './actions/deleteConversationItemParts';
export { default as setIsPendingDeleteConversationItemParts } from './actions/setIsPendingDeleteConversationItemParts';

export {
    INITIAL_MAX_ITEMS_TO_RETURN,
    LOAD_MORE_INCREMENT,
    MAX_ITEMS_ALLOWED_TO_RETRIEVE,
} from './constants';
