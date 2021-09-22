import { getStore } from '../store/Store';

export default function isConversationReadingPaneViewStateLoaded(conversationId: string): boolean {
    return getStore().loadedConversationReadingPaneViewStates.has(conversationId);
}
