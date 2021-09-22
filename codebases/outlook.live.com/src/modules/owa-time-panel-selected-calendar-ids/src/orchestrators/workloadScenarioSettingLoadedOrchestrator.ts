import {
    setTimePanelConfigLoadState,
    updateSelectedCalendarIdsInStore,
} from '../actions/internalActions';
import { onSelectedCalendarIdsUpdated, updateSelectedCalendarIds } from '../actions/publicActions';
import { ConfigLoadState } from '../store/schema/TimePanelSelectedCalendarIdsStore';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { orchestrator } from 'satcheljs';
import { convertIdsToTargetFormat, ConvertIdSource } from 'owa-immutable-id';
import { isConversionNeeded, getTargetFormat } from 'owa-immutable-id-store';

export const workloadScenarioSettingsLoadedOrchestrator = orchestrator(
    workloadScenarioSettingsLoaded,
    async actionMessage => {
        const { settings, userIdentity } = actionMessage;

        setTimePanelConfigLoadState(ConfigLoadState.Loaded, userIdentity);
        if (settings.timePanelCalendarIds?.length > 0) {
            if (isConversionNeeded(settings.timePanelCalendarIds, userIdentity)) {
                const formattedResult = await convertIdsToTargetFormat(
                    settings.timePanelCalendarIds,
                    getTargetFormat(userIdentity),
                    userIdentity,
                    ConvertIdSource.MyDay
                );
                updateSelectedCalendarIds(formattedResult, userIdentity);
            } else {
                updateSelectedCalendarIdsInStore(settings.timePanelCalendarIds, userIdentity);
            }
        }

        // trigger update signal for orchestration purposes
        onSelectedCalendarIdsUpdated();
    }
);
