import { isFeatureEnabled } from 'owa-feature-flags';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { getUserMailboxInfo } from 'owa-client-ids';
import { updateAutoOpenRegistration } from 'owa-suite-header-auto-open';
import { isSuiteHeaderRendered, updateIsSuiteHeaderRendered } from 'owa-suite-header-store';
import { isTimePanelAvailable, openTimePanel } from 'owa-time-panel-bootstrap';
import { orchestrator } from 'satcheljs';

/**
 * We want to try to trigger an auto open when:
 * 1. The isTimePanelOpen setting is loaded AND 2. the suite header is loaded
 * We do not know whether 1 or 2 will be loaded first, so we check both of these values when each is loaded,
 * and take action once both pieces of data are loaded
 */
let shouldTimePanelTryAutoOpen: boolean | null = null;

orchestrator(workloadScenarioSettingsLoaded, actionMessage => {
    const { settings, userIdentity } = actionMessage;

    // ignore connected account settings
    if (getUserMailboxInfo().userIdentity !== userIdentity) {
        return;
    }

    shouldTimePanelTryAutoOpen = settings.isTimePanelOpen;

    if (!isSuiteHeaderRendered()) {
        return;
    }
    const shouldAutoOpen =
        shouldTimePanelTryAutoOpen &&
        isTimePanelAvailable() &&
        isFeatureEnabled('cal-time-panel-softPin');

    updateAutoOpenRegistration('OwaTimePanel', { shouldAutoOpen, handleAutoOpen });
});

orchestrator(updateIsSuiteHeaderRendered, actionMessage => {
    if (shouldTimePanelTryAutoOpen === null) {
        return;
    }
    const shouldAutoOpen =
        actionMessage.isRendered &&
        shouldTimePanelTryAutoOpen &&
        isTimePanelAvailable() &&
        isFeatureEnabled('cal-time-panel-softPin');

    updateAutoOpenRegistration('OwaTimePanel', { shouldAutoOpen, handleAutoOpen });
});

function handleAutoOpen() {
    openTimePanel('AutoOpen');
}
