import { getDurationBucket, getViewDuration } from '../selectors/telemetrySelectors';
import { getSelectedCalendarItemId } from '../selectors/timePanelStoreSelectors';
import { loadTimePanelData } from '../utils/loadTimePanelData';
import { updateShouldAutoOpenTimePanel } from '../utils/updateShouldAutoOpenTimePanel';
import { logUsage } from 'owa-analytics';
import { lazyResetCalendarView } from 'owa-time-panel-calendar-list';
import { lazyCloseNotesEditor } from 'owa-calendar-notes-editor';
import { lazyUpdateSelectedEventId } from 'owa-event-details';
import { popView } from 'owa-time-panel-bootstrap';
import { lazyUpdateSelectedTaskId } from 'owa-time-panel-task-details';
import { orchestrator } from 'satcheljs';
import {
    getTimePanelCustomData,
    TimePanelChangeViewCustomData,
    timePanelOptions,
} from '../datapoints';
import {
    panelClosed,
    panelOpened,
    pushNewView,
    resetPanelViewOpenTimeStamp,
    updateCurrentView,
    updateSelectedTask,
    updateSelectedCalendarEvent,
} from '../actions/timePanelStoreActions';
import {
    popTimePanelView,
    pushTimePanelView,
    updateTopTimePanelView,
    PanelView,
    getPreviousPanelView,
    getPanelViewType,
    getStackLength,
    getCurrentPanelView,
} from 'owa-time-panel-settings';

// Core orchestrators

export const panelOpenedOrchestrator = orchestrator(panelOpened, async () => {
    // ensure preload requirements are met
    await loadTimePanelData();

    // persist auto-open enabled
    updateShouldAutoOpenTimePanel(true);

    // log change view event since it will otherwise not be captured by standard lifecycle
    logChangeView(getCurrentPanelView(), true);
});

export const panelClosedOrchestrator = orchestrator(panelClosed, () => {
    // persist auto-open disabled
    updateShouldAutoOpenTimePanel(false);

    // log change view event since it will otherwise not be captured by standard lifecycle
    logChangeView(null);

    // clean up the view stack
    while (getStackLength() > 1) {
        popTimePanelView();
    }

    // clean up notes editor in case an event details view is buried somewhere in the stack
    const id = getSelectedCalendarItemId();
    if (id?.Id) {
        lazyCloseNotesEditor.importAndExecute(id.Id);
    }

    // reset calendar view for next session
    lazyResetCalendarView.importAndExecute();
});

// Orchestrators for view stack

export const pushNewViewOrchestrator = orchestrator(pushNewView, actionMessage => {
    const { newView } = actionMessage;
    logChangeView(newView);
    pushTimePanelView(newView);
});

export const updateCurrentViewOrchestrator = orchestrator(updateCurrentView, actionMessage => {
    const { updatedView } = actionMessage;
    logChangeView(updatedView);
    updateTopTimePanelView(updatedView);
});

export const popViewOrchestrator = orchestrator(popView, () => {
    logChangeView(getPreviousPanelView());
    popTimePanelView();
});

orchestrator(popTimePanelView, updateTimeStamp);
orchestrator(updateTopTimePanelView, updateTimeStamp);
orchestrator(pushTimePanelView, updateTimeStamp);

function updateTimeStamp() {
    resetPanelViewOpenTimeStamp();
}

// Orchestrators for shared event and task callbacks

export const updateSelectedCalendarEventOrchestrator = orchestrator(
    updateSelectedCalendarEvent,
    actionMessage => {
        const { selectedCalendarEventId } = actionMessage;
        lazyUpdateSelectedEventId.importAndExecute(selectedCalendarEventId);
    }
);

export const updateSelectedTaskOrchestrator = orchestrator(updateSelectedTask, actionMessage => {
    const { selectedTaskId } = actionMessage;
    lazyUpdateSelectedTaskId.importAndExecute(selectedTaskId);
});

// Helper functions

function logChangeView(nextView: PanelView, isInitialView?: boolean): void {
    // current view will become the previous view (unless this is the initial view on panel load)
    const previousView = isInitialView ? null : getCurrentPanelView();
    const previousViewDuration = isInitialView ? 0 : getViewDuration();
    const previousViewDurationBucket = getDurationBucket(previousViewDuration);
    logUsage(
        'timePanelActionChangeView',
        getTimePanelCustomData<TimePanelChangeViewCustomData>({
            // standard logging
            previousViewDuration,
            // long-term logging
            previousView_1: previousView,
            previousViewType_2: getPanelViewType(previousView),
            previousViewDurationBucketLowerBoundMinutes_3:
                previousViewDurationBucket.lowerBoundMinutes,
            previousViewDurationBucketUpperBoundMinutes_4:
                previousViewDurationBucket.upperBoundMinutes,
            nextView_5: nextView,
            nextViewType_6: getPanelViewType(nextView),
        }),
        timePanelOptions
    );
}
