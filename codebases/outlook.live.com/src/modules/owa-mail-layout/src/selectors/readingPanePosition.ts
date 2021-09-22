import ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getStore } from '../store/Store';

/**
 * Returns a flag indicating whether reading pane is positioned BOTTOM
 */
export function isReadingPanePositionBottom() {
    return isCurrentReadingPanePositionEqual(ReadingPanePosition.Bottom);
}

/**
 * Returns a flag indicating whether reading pane is OFF
 * ReadingPane off does not mean that reading pane is not visible in view.
 * This is a default setting which user has chosen which means that when Listview is shown reading pane
 * will not be visible.
 */
export function isReadingPanePositionOff() {
    return isCurrentReadingPanePositionEqual(ReadingPanePosition.Off);
}

/**
 * Returns a flag indicating whether reading pane is positioned RIGHT
 */
export function isReadingPanePositionRight() {
    return isCurrentReadingPanePositionEqual(ReadingPanePosition.Right);
}

/**
 * The clientReadingPane position is the position that the owa-mail-layout has determined best depending
 * on the current browser window size. This position will be used when its set, which means it will
 * override user's persisted readingPanePosition in settings
 * @param readingPanePosition the readingPanePosition value to be compared with the client-side
 * readingPanePosition value
 */
function isCurrentReadingPanePositionEqual(readingPanePosition: ReadingPanePosition) {
    const store = getStore();
    if (store.clientReadingPanePosition !== null) {
        return store.clientReadingPanePosition === readingPanePosition;
    }

    return getGlobalReadingPanePositionReact() == readingPanePosition;
}

/**
 * Gets the flag indicating whether user has ReadingPane Off or Bottom settings.
 * This does not consider the client overrides.
 */
export function isRPHiddenOrBottomByDefault() {
    const globalRPPosition = getGlobalReadingPanePositionReact();
    return (
        globalRPPosition == ReadingPanePosition.Off ||
        globalRPPosition == ReadingPanePosition.Bottom
    );
}

export function getGlobalReadingPanePositionReact() {
    return (
        getUserConfiguration().UserOptions?.GlobalReadingPanePositionReact ||
        ReadingPanePosition.Off
    );
}
