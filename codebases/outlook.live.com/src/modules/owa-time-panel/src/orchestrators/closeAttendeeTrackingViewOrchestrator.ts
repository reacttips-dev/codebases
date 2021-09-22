import { closeAttendeeTrackingView } from '../actions/publicActions';
import { toggleTimePanel } from '../utils/toggleTimePanel';
import { popView } from 'owa-time-panel-bootstrap';
import { isShowingAttendeeTrackingView } from 'owa-time-panel-settings';
import { orchestrator } from 'satcheljs';
import {
    getSelectedCalendarItemId,
    getTimePanelSource,
} from '../selectors/timePanelStoreSelectors';

export const closeAttendeeTrackingViewOrchestrator = orchestrator(
    closeAttendeeTrackingView,
    actionMessage => {
        const { clientItemId } = actionMessage;

        const selectedId = getSelectedCalendarItemId();
        if (selectedId && selectedId.Id == clientItemId.Id) {
            // close the AttendeeTracking view and associated EventDetails view if they are still open for this event
            if (isShowingAttendeeTrackingView()) {
                popView();
                popView();
            }

            // (scenario-specific) also close the Time Panel if it was opened via MeetingCard entrypoint
            if (getTimePanelSource() === 'MeetingCard') {
                toggleTimePanel();
            }
        }
    }
);
