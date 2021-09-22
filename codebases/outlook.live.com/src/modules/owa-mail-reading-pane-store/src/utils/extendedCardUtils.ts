import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type { ExtendedCardType, CardViewState } from '../store/schema/ExtendedCardViewState';

/**
 * Returns true if there is an extended card of the given type, false otherwise
 * @param viewState Extended card view state
 * @param cardType Card type
 */
export function hasExtendedCard(
    viewState: ConversationReadingPaneViewState | ItemReadingPaneViewState,
    cardType: ExtendedCardType
): boolean {
    return viewState?.extendedCardViewState && viewState.extendedCardViewState.cardType == cardType;
}

/**
 * Returns true if there is an extended card and the card is covering original content, false otherwise
 * @param viewState Extended card view state
 */
export function isExtendedCardCoveringOriginalContent(
    viewState: ConversationReadingPaneViewState | ItemReadingPaneViewState
): boolean {
    return viewState?.extendedCardViewState?.coverOriginalContent;
}

/**
 * Gets the card view state of the extended card of the given type, if it exists
 * @param viewState Extended card view state
 * @param cardType Card type
 */
export function getExtendedCardViewState(
    viewState: ConversationReadingPaneViewState | ItemReadingPaneViewState,
    cardType: ExtendedCardType
): CardViewState {
    if (hasExtendedCard(viewState, cardType)) {
        return viewState.extendedCardViewState.cardViewState;
    }
    return null;
}
