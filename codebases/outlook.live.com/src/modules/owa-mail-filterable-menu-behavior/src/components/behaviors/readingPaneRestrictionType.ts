import { ReadingPaneRestrictionType } from '../Behaviors.types';
import { assertNever } from 'owa-assert';
import {
    isReadingPanePositionOff,
    isReadingPanePositionRight,
    shouldShowReadingPane,
} from 'owa-mail-layout';

export const readingPaneRestrictionType = (
    readingPaneRestrictionType: ReadingPaneRestrictionType
) => () => {
    const showReadingPane = shouldShowReadingPane();
    switch (readingPaneRestrictionType) {
        case ReadingPaneRestrictionType.Immersive:
            return showReadingPane && isReadingPanePositionOff();

        case ReadingPaneRestrictionType.Right:
            return isReadingPanePositionRight();

        case ReadingPaneRestrictionType.Hidden:
            return !showReadingPane;

        default:
            throw assertNever(readingPaneRestrictionType);
    }
};
