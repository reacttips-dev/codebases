import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/Store';
import type ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';

/**
 * Sets client-side readingPane position
 * @param clientReadingPanePosition Client-side reading pane position
 */
export default mutatorAction(
    'setCurrentClientReadingPanePosition',
    (clientReadingPanePosition: ReadingPanePosition | null) => {
        getStore().clientReadingPanePosition = clientReadingPanePosition;
    }
);
