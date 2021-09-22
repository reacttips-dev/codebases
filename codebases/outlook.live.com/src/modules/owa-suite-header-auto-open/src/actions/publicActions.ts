import type { AutoOpenPaneId } from '../constants';
import type { AutoOpenRegistration } from '../store/store';
import { addDatapointConfig } from 'owa-analytics-actions';
import { action } from 'satcheljs';

/**
 * All auto open scenarios need to call this.
 * Scenarios are auto-opened based on pane priority, and a scenario can not auto open until
 * all higher priority scenarios have loaded/ called `updateAutoOpenRegistration`.
 */
export const updateAutoOpenRegistration = action(
    'updateAutoOpenRegistration',
    (autoOpenPaneId: AutoOpenPaneId, autoOpenRegistration: AutoOpenRegistration) => ({
        autoOpenPaneId,
        autoOpenRegistration,
    })
);

export const flexPaneAutoOpened = action('flexPaneAutoOpened', (autoOpenPaneId: AutoOpenPaneId) =>
    addDatapointConfig(
        {
            name: 'flexPaneAutoOpened',
            customData: {
                autoOpenPaneId: autoOpenPaneId,
            },
        },
        {
            autoOpenPaneId: autoOpenPaneId,
        }
    )
);
