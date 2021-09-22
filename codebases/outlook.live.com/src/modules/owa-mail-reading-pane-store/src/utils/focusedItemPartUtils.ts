import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { FocusedItemArea } from '../store/schema/FocusedItemPart';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';

export interface FocusedItemPartState {
    conversationReadingPaneState: ConversationReadingPaneViewState;
}

export const getFocusedItemPart = function getFocusedItemPart(
    state: FocusedItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(),
    }
): ItemPartViewState {
    return state.conversationReadingPaneState?.focusedItemPart
        ? state.conversationReadingPaneState.focusedItemPart.itemPart
        : null;
};

export const getFocusedItemArea = function getFocusedItemPart(
    state: FocusedItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(),
    }
): FocusedItemArea {
    return state.conversationReadingPaneState?.focusedItemPart
        ? state.conversationReadingPaneState.focusedItemPart.focusedItemArea
        : null;
};

export const getInitiallySelectedItemPart = function getInitiallySelectedItemPart(
    state: FocusedItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(),
    }
): ItemPartViewState {
    return state.conversationReadingPaneState?.initiallySelectedItemPart
        ? state.conversationReadingPaneState.initiallySelectedItemPart.itemPart
        : null;
};

export const isItemPartSelected = function isItemPartSelected(
    itemPart: ItemPartViewState,
    state: FocusedItemPartState = {
        conversationReadingPaneState: getConversationReadingPaneViewState(),
    }
): boolean {
    const selectedItemPart = getFocusedItemPart(state);
    const selectedItemArea = getFocusedItemArea(state);
    return selectedItemPart == itemPart && selectedItemArea == FocusedItemArea.Item;
};
