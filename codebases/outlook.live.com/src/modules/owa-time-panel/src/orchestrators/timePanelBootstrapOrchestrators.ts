import { openTimePanelInternal } from '../actions/timePanelStoreActions';
import { getSelectedCalendarItemId, isPanelOpen } from '../selectors/timePanelStoreSelectors';
import { toggleTimePanel } from '../utils/toggleTimePanel';
import { verifyValidSource } from '../utils/verifyValidSource';
import { createLazyOrchestrator } from 'owa-bundling';
import { lazyCloseNotesEditor } from 'owa-calendar-notes-editor';
import { isTimePanelAvailable, openTimePanel, popView } from 'owa-time-panel-bootstrap';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';

export const openTimePanelOrchestrator = createLazyOrchestrator(
    openTimePanel,
    'openTimePanelClone',
    actionMessage => {
        const { source } = actionMessage;

        // sanity check for feature availability
        if (!isTimePanelAvailable()) {
            return;
        }

        // noop if panel is already open
        if (isPanelOpen()) {
            return;
        }

        // verify source for telemetry purposes
        if (!verifyValidSource(source)) {
            return;
        }

        openTimePanelInternal(source);
        toggleTimePanel();
    }
);

export const cleanEventDetailsViewStateOrchestrator = orchestrator(popView, () => {
    if (getCurrentPanelView() == 'EventDetails' && getSelectedCalendarItemId()?.Id) {
        lazyCloseNotesEditor.importAndExecute(getSelectedCalendarItemId().Id);
    }
});
