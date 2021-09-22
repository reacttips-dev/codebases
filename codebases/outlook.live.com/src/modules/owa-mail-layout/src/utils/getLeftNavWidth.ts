import { getFolderPaneWidth } from './getFolderPaneWidth';
import { getLeftRailWidth } from './getLeftRailWidth';
import { getLeftNavMaxWidth } from './getMaxWidths';
import { LEFT_RAIL_STATIC_WIDTH } from 'owa-layout';
import { Module } from 'owa-workloads';
import isOfficeRailEnabled from 'owa-left-rail-utils/lib/isOfficeRailEnabled';

/**
 * Gets the current left nav width (folder pane width + left rail width).
 * This width is used to set the width on the div, so the value of this can be 0 depending on if the
 * components are being shown or hidden
 * @returns width in pixels
 */
export function getLeftNavWidth(): number {
    // Combine the folder width with the left rail width.  Unless when officeRail is enabled since we don't render the left rail in this container
    const totalWidth =
        getFolderPaneWidth() + (isOfficeRailEnabled(Module.Mail) ? 0 : getLeftRailWidth());

    /**
     * If totalWidth is 0, the pane is in collapsed state
     */
    if (totalWidth == 0) {
        // We normally apply a min with of 48px for MailLeftPane.tsx container when the folder pane is collapsed because it usually hosts the left rail.
        // But when officeRail is enabled we don't render the left rail in that container and it should have no width
        return isOfficeRailEnabled(Module.Mail) ? 0 : LEFT_RAIL_STATIC_WIDTH;
    } else {
        const leftNavMaxWidth = getLeftNavMaxWidth();

        // If the current stored width is > than the MAX width allowed for current window size
        // use the MAX width
        if (totalWidth > leftNavMaxWidth) {
            return leftNavMaxWidth;
        }
    }

    return totalWidth;
}
