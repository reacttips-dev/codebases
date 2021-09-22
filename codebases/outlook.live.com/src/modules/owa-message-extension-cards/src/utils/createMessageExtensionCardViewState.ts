import type { MessageExtensionCardViewState } from '../store/schema/MessageExtensionCardViewState';

/**
 * Method for initializing message extension card view state.
 * @returns MessageExtensionCardViewState
 */
export default function createMessageExtensionCardViewState(): MessageExtensionCardViewState {
    return {
        cardsCount: 0,
        quotedBody: null,
        parsedQuotedBody: false,
    };
}
