import { updateIsDatePickerExpanded } from '../actions/publicActions';
import { getStore } from '../store/store';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { getUserMailboxInfo } from 'owa-client-ids';
import { mutator } from 'satcheljs';

mutator(updateIsDatePickerExpanded, actionMessage => updateIsExpanded(actionMessage.isExpanded));

mutator(workloadScenarioSettingsLoaded, actionMessage => {
    const { settings, userIdentity } = actionMessage;
    if (
        getUserMailboxInfo().userIdentity === userIdentity &&
        settings.isTimePanelDatePickerExpanded !== null &&
        settings.isTimePanelDatePickerExpanded !== undefined
    ) {
        updateIsExpanded(actionMessage.settings.isTimePanelDatePickerExpanded);
    }
});

function updateIsExpanded(isExpanded: boolean) {
    getStore().isDatePickerExpanded = isExpanded;
}
