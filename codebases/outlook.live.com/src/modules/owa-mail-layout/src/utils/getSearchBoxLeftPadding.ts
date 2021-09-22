import { LEFT_RAIL_STATIC_WIDTH } from 'owa-layout';
import { DEFAULT_FOLDER_PANE_WIDTH } from '../internalConstants';
import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { Module } from 'owa-workloads';

/**
 * Gets the current padding left of search box.
 * @returns the number of pixels
 */
export default function getSearchBoxLeftPadding(): number {
    const navBarWidth =
        getUserConfiguration().UserOptions?.NavigationBarWidth || DEFAULT_FOLDER_PANE_WIDTH;

    // If left rail is visible, align to nav bar width, otherwise align to nav bar width + left rail
    return !isLeftRailVisible(Module.Mail) ? navBarWidth : navBarWidth + LEFT_RAIL_STATIC_WIDTH;
}
