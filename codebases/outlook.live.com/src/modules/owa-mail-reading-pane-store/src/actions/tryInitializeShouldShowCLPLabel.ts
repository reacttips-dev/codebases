import { action } from 'satcheljs';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';

export default action(
    'tryInitializeShouldShowCLPLabel',
    (conversationViewState: ConversationReadingPaneViewState) => ({
        conversationViewState,
    })
);
