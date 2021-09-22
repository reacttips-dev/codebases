import { getSessionDuration } from '../selectors/telemetrySelectors';
import { handleTimePanelClosed } from 'owa-time-panel-bootstrap';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import * as React from 'react';
import {
    getSelectedCalendarItemId,
    getTimePanelSource,
} from '../selectors/timePanelStoreSelectors';
import {
    clearTelemetryData,
    initializeTelemetryData,
    panelClosed,
    panelOpened,
} from '../actions/timePanelStoreActions';

export function usePanelLifecycleEffect() {
    // action ordering matters for this effect to accurately log telemetry
    React.useEffect(() => {
        // initialize telemetry first on mount
        initializeTelemetryData();

        // set up
        panelOpened();

        return () => {
            // save values first on unmount
            const source = getTimePanelSource();
            const duration = getSessionDuration();
            const lastView = getCurrentPanelView();
            const itemId = getSelectedCalendarItemId();

            // clean up
            panelClosed();

            // clear telemetry last
            clearTelemetryData();

            // signal that panel has closed for any additional handling needed (e.g. reset focus)
            handleTimePanelClosed(source, duration, lastView, itemId);
        };
    }, []);
}
