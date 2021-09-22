import { getLeftNavMaxWidth, getListViewMaxWidth } from '../utils/getMaxWidths';
import { isReadingPanePositionBottom, isReadingPanePositionRight } from './readingPanePosition';
import { mergeStyles } from '@fluentui/merge-styles';
import { MIN_READING_PANE_WIDTH } from '../internalConstants';
import { BrowserWidthBucket, getBrowserWidthBucket } from 'owa-layout';
import { getLeftNavWidth } from '../utils/getLeftNavWidth';
import { getListViewDimensions } from '../utils/getListViewDimensions';

/**
 * Gets the styles to be applied to the Left Pane container
 */
export function getLeftPaneStyles(): string {
    return mergeStyles({
        flex: '0 0 auto',
        width: getLeftNavWidth(),
        maxWidth: getLeftNavMaxWidth(),
    });
}

/**
 * Gets the styles to be applied to the Right Pane container
 */
export function getRightPaneStyles(): string {
    return mergeStyles({
        flex: '1 1 auto',
    });
}

/**
 * Gets the styles to be applied to the list view container
 */
export function getListViewContainerStyles(): string {
    let { listViewWidth, listViewHeight } = getListViewDimensions();
    const isRPositionRight = isReadingPanePositionRight();

    return mergeStyles({
        width: isRPositionRight ? listViewWidth : '',
        maxWidth: isRPositionRight ? getListViewMaxWidth() : '',
        height: isReadingPanePositionBottom() ? listViewHeight : '',
        flex: '0 0 auto',
    });
}

/**
 * Gets the styles to be applied for the reading pane container
 */
export function getReadingPaneContainerStyles(): string {
    let minWidthRP;

    /**
     * Set min width for RP when dynamic layout flight is turned on but not when
     * browser has hit the minimum breakpoint after which we do not want min-width for RP.
     */
    if (getBrowserWidthBucket() != BrowserWidthBucket.From418_Below) {
        minWidthRP = MIN_READING_PANE_WIDTH;
    }

    return mergeStyles({
        minWidth: minWidthRP,
    });
}
