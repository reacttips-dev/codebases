import { updateSelectedCalendarViewInStore } from '../actions/internalActions';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { getUserMailboxInfo } from 'owa-client-ids';
import { orchestrator } from 'satcheljs';

export const workloadScenarioSettingsLoadedOrchestrator = orchestrator(
    workloadScenarioSettingsLoaded,
    actionMessage => {
        const { settings, userIdentity } = actionMessage;
        if (
            getUserMailboxInfo().userIdentity === userIdentity &&
            settings.timePanelSelectedCalendarView
        ) {
            updateSelectedCalendarViewInStore(settings.timePanelSelectedCalendarView);
        }
    }
);
