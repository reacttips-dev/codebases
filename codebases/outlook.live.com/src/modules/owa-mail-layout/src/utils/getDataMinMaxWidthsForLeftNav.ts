import { MIN_FOLDER_PANE_WIDTH } from '../internalConstants';
import { LEFT_RAIL_STATIC_WIDTH } from 'owa-layout';
import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import { getLeftNavMaxWidth } from './getMaxWidths';
import { Module } from 'owa-workloads';

interface LeftNavMinMaxWidths {
    dataMin: number;
    dataMax: number;
}

/**
 * Gets the min and max values for the left navigation pane widths for resize purposes
 * User can resize the left nav widths within these bounds.
 */
export function getDataMinMaxWidthsForLeftNav(): LeftNavMinMaxWidths {
    const maxLeftNavWidth = getLeftNavMaxWidth();

    /**
     * Case 1: When left rail is visible add the left rail widths when determining
     * the bounds for resizing the left nav
     */
    if (isLeftRailVisible(Module.Mail)) {
        return {
            dataMin: MIN_FOLDER_PANE_WIDTH + LEFT_RAIL_STATIC_WIDTH,
            dataMax: maxLeftNavWidth,
        };
    }

    /**
     * Case 2: Left rail is not visible only consider folder pane widths
     */
    return {
        dataMin: MIN_FOLDER_PANE_WIDTH,
        dataMax: maxLeftNavWidth,
    };
}
