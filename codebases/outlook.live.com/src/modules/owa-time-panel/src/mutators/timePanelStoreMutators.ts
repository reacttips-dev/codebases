import {
    openTimePanelInternal,
    clearTelemetryData,
    initializeTelemetryData,
    panelOpened,
    panelClosed,
    resetPanelViewOpenTimeStamp,
    updateSelectedCalendarEvent,
    updateSelectedTask,
} from '../actions/timePanelStoreActions';
import { getTimePanelSource, isPanelOpen } from '../selectors/timePanelStoreSelectors';
import getStore from '../store/store';
import { now } from 'owa-datetime';
import { getGuid } from 'owa-guid';
import { mutator, mutatorAction } from 'satcheljs';

mutator(openTimePanelInternal, actionMessage => {
    const { source } = actionMessage;
    if (!isPanelOpen()) {
        getStore().source = source;
    }
});

mutator(panelOpened, () => {
    getStore().isPanelOpen = true;
});

mutator(panelClosed, () => {
    getStore().isPanelOpen = false;
});

export const setPanelInitialized = mutatorAction('setTimePanelInitialized', () => {
    getStore().isPanelInitialized = true;
});

mutator(initializeTelemetryData, () => {
    // all non-SuiteHeader callers are expected to use openTimePanel or related public
    // action to specify source, otherwise assume / default to SuiteHeader source
    if (!getTimePanelSource()) {
        getStore().source = 'SuiteHeader';
    }
    getStore().sessionId = getGuid();
    getStore().panelOpenTimestamp = now();
    getStore().panelViewOpenTimestamp = now();
});

mutator(clearTelemetryData, () => {
    getStore().source = null;
    getStore().sessionId = '';
    getStore().panelOpenTimestamp = null;
    getStore().panelViewOpenTimestamp = null;
});

mutator(updateSelectedCalendarEvent, actionMessage => {
    const { selectedCalendarEventId } = actionMessage;
    getStore().selectedCalendarItemId = selectedCalendarEventId;
});

mutator(updateSelectedTask, actionMessage => {
    const { selectedTaskId } = actionMessage;
    getStore().selectedTaskId = selectedTaskId;
});

mutator(resetPanelViewOpenTimeStamp, () => {
    getStore().panelViewOpenTimestamp = now();
});
