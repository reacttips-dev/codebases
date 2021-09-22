import clearReadingPaneStore from '../actions/clearReadingPaneStore';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export default function handleCurrentlyOpenInlineCompose(conversationId: string) {
    const conversationReadingPaneState = getConversationReadingPaneViewState(conversationId);
    if (conversationReadingPaneState) {
        const composeViewState = findInlineComposeViewState(
            conversationReadingPaneState.conversationId.Id
        );
        if (composeViewState) {
            clearReadingPaneStore(ReactListViewType.Conversation);
        }
    }
}
