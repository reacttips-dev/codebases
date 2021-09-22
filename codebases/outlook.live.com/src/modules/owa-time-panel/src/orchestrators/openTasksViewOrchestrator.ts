import { openTasksView } from '../actions/publicActions';
import { timePanelTodoListAction } from '../actions/timePanelTodoListAction';
import { updateCurrentView } from '../actions/timePanelStoreActions';
import { verifyValidSource } from '../utils/verifyValidSource';
import { openTimePanel, popView } from 'owa-time-panel-bootstrap';
import { getStackLength } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const openTasksViewOrchestrator = orchestrator(openTasksView, actionMessage => {
    const { source, actionPayload } = actionMessage;

    // verify source for telemetry purposes
    if (!verifyValidSource(source)) {
        return;
    }
    if (actionPayload) {
        timePanelTodoListAction(actionPayload);
    }
    // make sure panel is open
    openTimePanel(source);

    // close all non-base views
    while (getStackLength() > 1) {
        popView();
    }

    // open directly to Tasks view
    updateCurrentView('Tasks');
});
