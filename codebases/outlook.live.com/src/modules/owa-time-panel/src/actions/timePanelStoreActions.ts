import { getDurationBucket, getSessionDuration } from '../selectors/telemetrySelectors';
import { getTimePanelSource } from '../selectors/timePanelStoreSelectors';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ClientItemId } from 'owa-client-ids';
import type { TimePanelSource } from 'owa-time-panel-bootstrap';
import type { PanelView } from 'owa-time-panel-settings';
import { action } from 'satcheljs';
import {
    getTimePanelCustomData,
    timePanelOptions,
    TimePanelTarget,
    TimePanelDeeplinkCustomData,
    TimePanelCloseCustomData,
    TimePanelOpenCustomData,
} from '../datapoints';

/**
 * Core actions
 */

/**
 * This is the action that is called by openTimePanel orchestrator to update time panel store
 */
export const openTimePanelInternal = action('openTimePanelInternal', (source: TimePanelSource) => ({
    source,
}));

export const initializeTelemetryData = action('initializeTelemetryData');

export const clearTelemetryData = action('clearTelemetryData');

export const panelOpened = action('timePanelOpened', () =>
    addDatapointConfig({
        name: 'timePanelActionOpen',
        options: timePanelOptions,
        customData: getTimePanelCustomData<TimePanelOpenCustomData>({
            // long-term logging
            source_1: getTimePanelSource(),
        }),
    })
);

export const panelClosed = action('timePanelClosed', () => {
    const sessionDuration = getSessionDuration();
    const sessionDurationBucket = getDurationBucket(sessionDuration);
    return addDatapointConfig({
        name: 'timePanelActionClose',
        options: timePanelOptions,
        customData: getTimePanelCustomData<TimePanelCloseCustomData>({
            // standard logging
            sessionDuration,
            // long-term logging
            sessionDurationBucketLowerBoundMinutes_1: sessionDurationBucket.lowerBoundMinutes,
            sessionDurationBucketUpperBoundMinutes_2: sessionDurationBucket.upperBoundMinutes,
        }),
    });
});

export const openDeeplink = action('openDeeplink', (target: TimePanelTarget) =>
    addDatapointConfig({
        name: 'timePanelActionDeeplink',
        options: timePanelOptions,
        customData: getTimePanelCustomData<TimePanelDeeplinkCustomData>({
            // long-term logging
            target_1: target,
        }),
    })
);

export const updateSelectedCalendarEvent = action(
    'updateSelectedCalendarEvent',
    (selectedCalendarEventId: ClientItemId | null) => ({ selectedCalendarEventId })
);

export const updateSelectedTask = action('updateSelectedTask', (selectedTaskId: string | null) => ({
    selectedTaskId,
}));

/**
 * Actions for view stack
 */

export const pushNewView = action('pushNewView', (newView: PanelView) => ({
    newView,
}));

export const updateCurrentView = action('updateCurrentView', (updatedView: PanelView) => ({
    updatedView,
}));

export const resetPanelViewOpenTimeStamp = action('resetPanelViewOpenTimeStamp');
