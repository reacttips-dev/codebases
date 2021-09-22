import { updateIsTaskListSelected } from '../actions/publicActions';
import { getStore } from '../store/store';
import { workloadScenarioSettingsLoaded } from 'owa-scenario-settings';
import { getUserMailboxInfo } from 'owa-client-ids';
import { mutator } from 'satcheljs';

mutator(updateIsTaskListSelected, actionMessage => updateIsSelected(actionMessage.isSelected));

mutator(workloadScenarioSettingsLoaded, actionMessage => {
    const { settings, userIdentity } = actionMessage;
    if (
        getUserMailboxInfo().userIdentity === userIdentity &&
        settings.isTimePanelCalendarViewTaskListSelected !== null &&
        settings.isTimePanelCalendarViewTaskListSelected !== undefined
    ) {
        updateIsSelected(actionMessage.settings.isTimePanelCalendarViewTaskListSelected);
    }
});

function updateIsSelected(isSelected: boolean) {
    getStore().isTaskListSelected = isSelected;
}
