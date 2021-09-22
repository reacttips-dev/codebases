import { setTimePanelConfigLoadState } from '../actions/internalActions';
import { onSelectedCalendarIdsUpdated } from '../actions/publicActions';
import { ConfigLoadState } from '../store/schema/TimePanelSelectedCalendarIdsStore';
import { loadingWorkloadScenarioSettingsFailed } from 'owa-scenario-settings';
import { orchestrator } from 'satcheljs';

export const loadingWorkloadScenarioSettingsFailedOrchestrator = orchestrator(
    loadingWorkloadScenarioSettingsFailed,
    actionMessage => {
        setTimePanelConfigLoadState(ConfigLoadState.Failed, actionMessage.userIdentity);

        // trigger update signal for listening orchestrators
        onSelectedCalendarIdsUpdated();
    }
);
