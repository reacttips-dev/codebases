import { openEventDetailsView } from '../actions/publicActions';
import { pushNewView, updateSelectedCalendarEvent } from '../actions/timePanelStoreActions';
import { verifyValidSource } from '../utils/verifyValidSource';
import { openTimePanel, popView } from 'owa-time-panel-bootstrap';
import { getStackLength } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const openEventDetailsViewOrchestrator = orchestrator(
    openEventDetailsView,
    actionMessage => {
        const { source, clientItemId } = actionMessage;

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

        // open directly to EventDetails view
        updateSelectedCalendarEvent(clientItemId);
        pushNewView('EventDetails');
    }
);
