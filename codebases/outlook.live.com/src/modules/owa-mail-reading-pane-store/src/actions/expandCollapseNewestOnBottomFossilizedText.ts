import { unselectItemParts } from './toggleSelectItemPart';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { action } from 'satcheljs/lib/legacy';

export interface ExpandCollapseNewestOnBottomFossilizedTextState {
    itemPartViewState: ItemPartViewState;
    conversationReadingPaneState: ConversationReadingPaneViewState;
}

export default action('expandCollapseNewestOnBottomFossilizedText')(
    function expandCollapseNewestOnBottomFossilizedText(
        conversationId: string,
        nodeId: string,
        isFossilizedTextExpanded: boolean,
        state: ExpandCollapseNewestOnBottomFossilizedTextState = {
            itemPartViewState: getConversationReadingPaneViewState(conversationId).itemPartsMap.get(
                nodeId
            ),
            conversationReadingPaneState: getConversationReadingPaneViewState(conversationId),
        }
    ) {
        state.itemPartViewState.isFossilizedTextExpanded = !isFossilizedTextExpanded;
        const canFocus = !findInlineComposeViewState(
            state.conversationReadingPaneState.conversationId.Id
        );
        if (canFocus) {
            unselectItemParts(conversationId, {
                conversationReadingPaneState: state.conversationReadingPaneState,
            });
            state.conversationReadingPaneState.focusedItemPart = {
                itemPart: state.itemPartViewState,
                focusedItemArea: FocusedItemArea.FossilizedText,
            };
        }
    }
);
