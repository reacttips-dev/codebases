import { updateAutoOpenRegistrationInStore } from '../actions/internalActions';
import { flexPaneAutoOpened, updateAutoOpenRegistration } from '../actions/publicActions';
import { AutoOpenPriority } from '../constants';
import { getAutoOpenRegistrationMap } from '../selectors/getAutoOpenRegistrationMap';
import { getActiveCharm } from 'owa-header-store';
import { openFlexPane } from 'owa-suite-header-apis';
import { orchestrator } from 'satcheljs';

let hasAutoOpened = false;
export const updateAutoOpenRegistrationOrchestrator = orchestrator(
    updateAutoOpenRegistration,
    actionMessage => {
        const { autoOpenPaneId, autoOpenRegistration } = actionMessage;
        updateAutoOpenRegistrationInStore(autoOpenPaneId, autoOpenRegistration);
        if (!hasAutoOpened) {
            tryAutoOpen();
        }
    }
);

function tryAutoOpen() {
    const autoOpenRegistrationMap = getAutoOpenRegistrationMap();
    // Process the panels in priority order so see if we can auto open any
    for (let panel of AutoOpenPriority) {
        if (!autoOpenRegistrationMap.has(panel)) {
            // If we reach a scenario that is not loaded in the AutoOpenPriority list, this means the
            // data for this scenario has not yet loaded. We stop processing subsequent scenarios because they have
            // lower priority, and can not auto open until all the panels with higher priority have loaded
            // their data
            break;
        } else {
            const { shouldAutoOpen, handleAutoOpen } = autoOpenRegistrationMap.get(panel);
            // Confirm that there is no active charm already (e.g. user already manually opened a panel)
            // before triggering auto-open
            if (shouldAutoOpen && !getActiveCharm()) {
                handleAutoOpen ? handleAutoOpen() : openFlexPane(panel);
                flexPaneAutoOpened(panel);
                hasAutoOpened = true;
                break;
            }
        }
        // Continue checking panels of lower priority to auto open
    }
}
