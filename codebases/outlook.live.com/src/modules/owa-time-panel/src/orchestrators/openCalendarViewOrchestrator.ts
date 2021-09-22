import { openCalendarView } from '../actions/publicActions';
import { updateCurrentView } from '../actions/timePanelStoreActions';
import { verifyValidSource } from '../utils/verifyValidSource';
import { openTimePanel, popView } from 'owa-time-panel-bootstrap';
import { getStackLength } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const openCalendarViewOrchestrator = orchestrator(openCalendarView, actionMessage => {
    const { source } = actionMessage;

    // verify source for telemetry purposes
    if (!verifyValidSource(source)) {
        return;
    }

    // make sure panel is open
    openTimePanel(source);

    // close all non-base views
    while (getStackLength() > 1) {
        popView();
    }

    // open directly to Calendar view
    updateCurrentView('Calendar');
});
