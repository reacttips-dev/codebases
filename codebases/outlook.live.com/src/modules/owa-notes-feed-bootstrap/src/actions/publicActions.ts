import type { OneNoteFeedPanelSource } from '../OneNoteFeedPanelSource';
import { action } from 'satcheljs';

/**
 * Opens OneNote Feed Panel
 */
export const openOneNoteFeedPanel = action(
    'openOneNoteFeedPanel',
    (source: OneNoteFeedPanelSource) => ({
        source,
    })
);

/**
 * Provides an action that can be used to listen for panel-close events and optionally take action,
 * e.g. restore focus to the element or region that previously had focus
 *
 * NOTE: Consumers should use the information provided in the action message to determine whether
 *       the panel scenario is relevant to their workflow before deciding to take action.
 */
export const handleOneNoteFeedPanelClosed = action(
    'handleOneNoteFeedPanelClosed',
    (source: OneNoteFeedPanelSource, sessionDuration?: number) => ({
        source,
        sessionDuration,
    })
);
