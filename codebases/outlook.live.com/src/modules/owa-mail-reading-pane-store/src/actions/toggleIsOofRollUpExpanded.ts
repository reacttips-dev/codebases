import { unselectItemParts } from './toggleSelectItemPart';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { action } from 'satcheljs/lib/legacy';

export interface ToggleIsOofRollUpExpandedState {
    conversationReadingPaneState: ConversationReadingPaneViewState;
}

export default action('toggleIsOofRollUpExpanded')(function toggleIsOofRollUpExpanded(
    conversationId: string,
    viewState: ItemPartViewState,
    state: ToggleIsOofRollUpExpandedState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
    }
) {
    viewState.oofRollUpViewState.isOofRollUpExpanded = !viewState.oofRollUpViewState
        .isOofRollUpExpanded;
    const canFocus = !findInlineComposeViewState(conversationId);
    if (canFocus) {
        unselectItemParts(conversationId, {
            conversationReadingPaneState: state.conversationReadingPaneState,
        });
        state.conversationReadingPaneState.focusedItemPart = {
            itemPart: viewState,
            focusedItemArea: FocusedItemArea.Oof,
        };
    }
});
