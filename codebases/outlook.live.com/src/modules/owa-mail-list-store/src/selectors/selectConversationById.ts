import listViewStore from '../store/Store';
import type ConversationItem from '../store/schema/ConversationItem';

export default function selectConversationById(conversationId: string): ConversationItem {
    return listViewStore.conversationItems.get(conversationId);
}
