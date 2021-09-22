import { openConflictsView } from '../actions/publicActions';
import { pushNewView } from '../actions/timePanelStoreActions';
import { ConflictsViewScenarioId } from '../constants';
import { verifyValidSource } from '../utils/verifyValidSource';
import { lazyInitializeConflictsView } from 'owa-conflicts-view';
import { openTimePanel } from 'owa-time-panel-bootstrap';
import { orchestrator } from 'satcheljs';

export const openConflictsViewOrchestrator = orchestrator(openConflictsView, actionMessage => {
    const { source, meeting } = actionMessage;

    // verify source for telemetry purposes
    if (!verifyValidSource(source)) {
        return;
    }

    // make sure panel is open
    openTimePanel(source);

    // initialize conflicts view and push on top of existing view stack
    lazyInitializeConflictsView.importAndExecute(ConflictsViewScenarioId, meeting);
    pushNewView('Conflicts');
});
