import { mutatorAction } from 'satcheljs';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';

export const saveItemScrollPosition = mutatorAction(
    'saveItemScrollPosition',
    function (itemReadingPaneViewState: ItemReadingPaneViewState, scrollRegionRef: HTMLElement) {
        if (itemReadingPaneViewState) {
            itemReadingPaneViewState.savedScrollPosition = scrollRegionRef.scrollTop;
        }
    }
);

export const saveConversationScrollPosition = mutatorAction(
    'saveConversationScrollPosition',
    function (
        conversationReadingPaneViewState: ConversationReadingPaneViewState,
        scrollRegionRef: HTMLElement
    ) {
        if (conversationReadingPaneViewState) {
            conversationReadingPaneViewState.savedScrollPosition = scrollRegionRef.scrollTop;
        }
    }
);
