import { closeConflictsView } from '../actions/publicActions';
import { ConflictsViewScenarioId } from '../constants';
import { getTimePanelSource } from '../selectors/timePanelStoreSelectors';
import { toggleTimePanel } from '../utils/toggleTimePanel';
import { resetConflictsView } from 'owa-conflicts-view';
import { popView } from 'owa-time-panel-bootstrap';
import { isShowingConflictsView } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const closeConflictsViewOrchestrator = orchestrator(closeConflictsView, () => {
    // close all views opened from the last conflict view
    while (isShowingConflictsView()) {
        popView();
    }

    // (scenario-specific) also close the Time Panel if it was opened via ShowConflicts entrypoint
    if (getTimePanelSource() === 'ShowConflicts') {
        toggleTimePanel();
    }

    resetConflictsView(ConflictsViewScenarioId);
});
