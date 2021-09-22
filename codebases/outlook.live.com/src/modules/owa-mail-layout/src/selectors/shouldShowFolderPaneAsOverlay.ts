import { getBrowserWidthBucket } from 'owa-layout';
import BrowserWidthBucket from 'owa-layout/lib/store/schema/BrowserWidthBucket';
import { isRPHiddenOrBottomByDefault } from './readingPanePosition';

/**
 * Returns a flag indicating whether to show folder pane as an overlay or not
 */
export function shouldShowFolderPaneAsOverlay() {
    const browserWidthBucket = getBrowserWidthBucket();
    const isRPHiddenORBottom = isRPHiddenOrBottomByDefault();

    /**
     * When reading pane is hidden, we want to collapse the left nav as late as possible
     * as there are only two columns to share the space. This is so as to continue offering
     * the default layout of the user as much as we can.
     */
    if (isRPHiddenORBottom) {
        return browserWidthBucket <= BrowserWidthBucket.From500_To541;
    }

    /**
     * When reading pane is not hidden, there are three columns which share the space (LeftNav, ListView, RP)
     * In this case we are more aggressive on collapsing the left nav and showing it as overlay.
     */
    return browserWidthBucket <= BrowserWidthBucket.From900_To918;
}
