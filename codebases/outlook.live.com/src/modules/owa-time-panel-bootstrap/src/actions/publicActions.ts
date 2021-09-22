import type { TimePanelSource } from '../TimePanelSource';
import type { ClientItemId } from 'owa-client-ids';
import type { PanelView } from 'owa-time-panel-settings';
import { action } from 'satcheljs';

/**
 * Opens Time Panel
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. opening deep-link to equivalent workflow in new tab, or else feature should be hidden/disabled
 */
export const openTimePanel = action('openTimePanel', (source: TimePanelSource) => ({ source }));

/**
 * Provides an action that can be used to listen for panel-close events and optionally take action,
 * e.g. restore focus to the element or region that previously had focus
 *
 * NOTE: Consumers should use the information provided in the action message to determine whether
 *       the panel scenario is relevant to their workflow before deciding to take action.
 *
 * EXAMPLE: If the panel is invoked from Mail UpNext and later closed with UpNext source and either
 *          Calendar view (if multiple up-next events) or EventDetails view + matching clientItemId
 *          (if single up-next event), then Mail UpNext should consider restoring focus to itself
 *          when the panel is closed.
 */
export const handleTimePanelClosed = action(
    'handleTimePanelClosed',
    (
        source: TimePanelSource,
        sessionDuration: number,
        lastView: PanelView,
        clientItemId?: ClientItemId
    ) => ({
        source,
        sessionDuration,
        lastView,
        clientItemId,
    })
);

/**
 * WARNING: Undocumented API, use with caution!
 *
 * Discuss scenario with Time Panel feature crew before using
 */
export const popView = action('popView');
