import { mutatorAction } from 'satcheljs';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type ExtendedCardViewState from '../store/schema/ExtendedCardViewState';

export default mutatorAction(
    'setExtendedCardViewState',
    (
        readingPaneViewState: ConversationReadingPaneViewState | ItemReadingPaneViewState,
        extendedCardViewState: ExtendedCardViewState
    ) => {
        readingPaneViewState.extendedCardViewState = extendedCardViewState;
    }
);
