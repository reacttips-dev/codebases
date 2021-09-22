import ChatProvider from '../store/schema/ChatProvider';
import { getStore } from '../store/chatStore';
import { getUnreadChatsCount as getUcmaUnreadChatsCount } from '../ucma/chatManager/chatFilters';
import { default as getUcwaUnreadChatsCount } from '../ucwa/chatManager/getUnreadChatsCount';

export default function getUnreadChatCounts() {
    switch (getStore().chatProvider) {
        case ChatProvider.UCMA:
            return getUcmaUnreadChatsCount();

        case ChatProvider.UCWA:
            return getUcwaUnreadChatsCount();

        default:
            return 0;
    }
}
