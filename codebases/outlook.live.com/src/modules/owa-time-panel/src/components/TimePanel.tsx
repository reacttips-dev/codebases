import TimePanelError from './TimePanelError';
import TimePanelFRE from './TimePanelFRE';
import TimePanelLoadingView from './TimePanelLoadingView';
import { useAutoCorrectContentHeightRef } from './useAutoCorrectContentHeightRef';
import { useEscapeKeyHandler } from './useEscapeKeyHandler';
import { usePanelLifecycleEffect } from './usePanelLifecycleEffect';
import { pushNewView } from '../actions/timePanelStoreActions';
import { ConflictsViewScenarioId, TaskScenarioId, TodoScenarioConfigSource } from '../constants';
import { isPanelInitialized } from '../selectors/timePanelStoreSelectors';
import { observer } from 'mobx-react-lite';
import { assertNever } from 'owa-assert';
import { ConflictsView, getHighlightedEventId } from 'owa-conflicts-view';
import { ErrorBoundary, ErrorComponentType } from 'owa-error-boundary';
import { AttendeeTracking, EventDetails } from 'owa-event-details';
import { NotificationBarHost } from 'owa-notification-bar';
import { popView } from 'owa-time-panel-bootstrap';
import { ComposeForm } from 'owa-time-panel-compose';
import { TimePanelDndView, TimePanelDropListener } from 'owa-time-panel-dnd';
import { getCurrentPanelView } from 'owa-time-panel-settings';
import { TaskDetailsView } from 'owa-time-panel-task-details';
import { TaskListView } from 'owa-todo-list';
import * as React from 'react';
import {
    CalendarList,
    clickCalendarEvent,
    doubleClickCalendarEvent,
} from 'owa-time-panel-calendar-list';
import {
    isClickCalendarEventCallbackPayload,
    isDoubleClickCalendarEventCallbackPayload,
    CalendarEventInteractionCallback,
    CalendarEventCallbackPayload,
} from 'owa-calendar-event-interaction-schema';
import EventScope from 'owa-service/lib/contract/EventScope';
import type { CalendarEvent } from 'owa-calendar-types';
import { lazyOpenCalendarFullCompose } from 'owa-calendar-compose-form-lifecycle';
import type { FullComposeEntrySourceType } from 'owa-calendar-helpers-types/lib/ComposeMetricTypes';

import styles from './TimePanel.scss';

export interface TimePanelProps {
    onClosePanel: () => void;
}

export default observer(function TimePanel(props: TimePanelProps) {
    usePanelLifecycleEffect();

    if (!isPanelInitialized()) {
        return <TimePanelLoadingView />;
    }

    return <TimePanelContent {...props} />;
});

const TimePanelContent = observer(function TimePanelContent(props: TimePanelProps) {
    const { ref } = useAutoCorrectContentHeightRef();

    // If escape handling got to here, close the panel
    const onKeyDownCallback = useEscapeKeyHandler(props.onClosePanel);

    const conflictEventInteractionCallback = useConflictEventInteractionCallbacks();

    const panelView = getCurrentPanelView();
    let content: JSX.Element = null;
    switch (panelView) {
        case 'Calendar':
            content = <CalendarList />;
            break;
        case 'EventDetails':
            content = (
                <EventDetails
                    onDismiss={popView}
                    onAttendeeTrackingClicked={onAttendeeTrackingClicked}
                    onEditEvent={onEditEvent}
                />
            );
            break;
        case 'AttendeeTracking':
            content = <AttendeeTracking onDismiss={popView} />;
            break;
        case 'Conflicts':
            content = (
                <ConflictsView
                    scenario={ConflictsViewScenarioId}
                    headerClassName={styles.conflictsHeader}
                    highlightedEventId={getHighlightedEventId(ConflictsViewScenarioId)}
                    calendarEventInteractionCallback={conflictEventInteractionCallback}
                />
            );
            break;
        case 'Tasks':
            content = (
                <TaskListView
                    scenarioId={TaskScenarioId}
                    todoScenarioConfig={{ source: TodoScenarioConfigSource }}
                    viewConfig={{
                        listPicker: {
                            menuProps: {
                                calloutProps: {
                                    calloutMaxHeight: 500,
                                    calloutWidth: 290,
                                },
                            },
                        },
                        showTodoAppLink: true,
                    }}
                />
            );
            break;
        case 'TaskDetails':
            content = <TaskDetailsView onDismiss={popView} />;
            break;
        case 'ComposeForm':
            content = <ComposeForm />;
            break;
        default:
            assertNever(panelView);
    }

    return (
        <ErrorBoundary fullErrorComponent={TimePanelError} type={ErrorComponentType.Full}>
            <TimePanelDropListener>
                <div ref={ref} className={styles.container} onKeyDown={onKeyDownCallback}>
                    <div className={styles.contentWrapper}>
                        <TimePanelDndView>
                            <TimePanelFRE />
                            {content}
                        </TimePanelDndView>
                    </div>
                    <div className={styles.notificationBarHostWrapper}>
                        <NotificationBarHost hostId={'TimePanelNotificationBarHost'} />
                    </div>
                </div>
            </TimePanelDropListener>
        </ErrorBoundary>
    );
});

function useConflictEventInteractionCallbacks(): CalendarEventInteractionCallback {
    const onCallback = React.useCallback((payload: CalendarEventCallbackPayload) => {
        const { id } = payload;
        if (isClickCalendarEventCallbackPayload(payload)) {
            clickCalendarEvent(id);
        } else if (isDoubleClickCalendarEventCallbackPayload(payload)) {
            doubleClickCalendarEvent(id);
        }
    }, []);
    return onCallback;
}

function onAttendeeTrackingClicked() {
    pushNewView('AttendeeTracking');
}

function onEditEvent(
    entrySource: string,
    eventScope: EventScope,
    eventUpdates: Partial<CalendarEvent>,
    itemHasUpdates?: boolean
) {
    lazyOpenCalendarFullCompose.importAndExecute({
        fullComposeEntrySource: entrySource as FullComposeEntrySourceType,
        eventScope: eventScope,
        eventUpdates: eventUpdates,
        itemHasUpdates: itemHasUpdates,
    });
}
