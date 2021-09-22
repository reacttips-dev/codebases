import type { QuickComposeEntrySourceType } from 'owa-calendar-helpers-types/lib/ComposeMetricTypes';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import type { TimePanelSource } from 'owa-time-panel-bootstrap';
import { action } from 'satcheljs';
import type { TimePanelTodoListAction } from '../store/schema/TimePanelTodoListAction';

/**
 * Opens Time Panel and navigates to Calendar view
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. opening deep-link to Calendar surface in new tab
 */
export const openCalendarView = action('openCalendarView', (source: TimePanelSource) => ({
    source,
}));

/**
 * Opens Time Panel and navigates to Tasks view
 *
 * REMINDER: Verify panel availability first using isTimePanelWithToDoFeaturesAvailable util, otherwise feature should be
 * hidden/disabled.
 */
export const openTasksView = action(
    'openTasksView',
    (source: TimePanelSource, actionPayload?: TimePanelTodoListAction) => ({
        source,
        actionPayload,
    })
);

/**
 * Opens Time Panel and navigates to Event Details view for the requested event
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. launching event reading pane popout
 */
export const openEventDetailsView = action(
    'openEventDetailsView',
    (source: TimePanelSource, clientItemId: ClientItemId) => ({
        source,
        clientItemId,
    })
);

/**
 * Opens Time Panel and navigates to Attendee Tracking view for the requested event,
 * with Back button navigating back to Event Details view
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. launching event reading pane popout
 */
export const openAttendeeTrackingView = action(
    'openAttendeeTrackingView',
    (source: TimePanelSource, clientItemId: ClientItemId) => ({
        source,
        clientItemId,
    })
);

/**
 * Closes Attendee Tracking view and associated Event Details view if currently open for the requested event
 *
 * Optionally closes Time Panel as well, depending on the scenario and original panel entrypoint
 */
export const closeAttendeeTrackingView = action(
    'closeAttendeeTrackingView',
    (clientItemId: ClientItemId) => ({ clientItemId })
);

/**
 * Opens Time Panel and navigates to Conflicts view for the requested meeting message
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. reporting inline string summary of conflicts
 */
export const openConflictsView = action(
    'openConflictsView',
    (source: TimePanelSource, meeting: MeetingRequestMessageType) => ({ source, meeting })
);

/**
 * Closes Attendee Tracking view and associated Event Details view if currently open for the requested event
 *
 * Optionally closes Time Panel too, depending on the scenario and original panel entrypoint
 */
export const closeConflictsView = action('closeConflictsView');

/**
 * Opens Time Panel and navigates to Event Quick Compose view, with automatic handling of any existing or "dirty" compose forms
 *
 * Optionally pre-populates the form with content, with any un-specified values falling back to form defaults (if any)
 *
 * REMINDER: Verify panel availability first using isTimePanelAvailable util and consider implementing a graceful fallback,
 * e.g. launching event compose popout
 */
export const openEventQuickComposeView = action(
    'openEventQuickComposeView',
    (
        source: TimePanelSource,
        entrySource: QuickComposeEntrySourceType,
        event?: Partial<CalendarEvent>
    ) => ({
        source,
        entrySource,
        event,
    })
);
