import getConversationReadingPaneViewState from './getConversationReadingPaneViewState';

export default function getConversationSubject(conversationId: string): string {
    const conversationReadingPaneViewState = getConversationReadingPaneViewState(conversationId);
    if (!!conversationReadingPaneViewState) {
        return conversationReadingPaneViewState.conversationSubject;
    } else {
        return null;
    }
}
