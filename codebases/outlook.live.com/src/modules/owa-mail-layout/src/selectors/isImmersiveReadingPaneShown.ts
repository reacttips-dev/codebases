import { isReadingPanePositionOff } from './readingPanePosition';
import { shouldShowReadingPane } from './shouldShowReadingPane';

/**
 * Returns a flag indicating whether reading pane is currently shown in immersive view
 * (i.e user is reading a message in RP while LV is hidden)
 */
export function isImmersiveReadingPaneShown() {
    return isReadingPanePositionOff() && shouldShowReadingPane();
}
