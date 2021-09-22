import { eventCountForUpNext, viewAllEvents, plusNEvents } from './upNext.locstring.json';
import { default as UpNextV2Event } from './UpNextV2Event';
import getTimeUntilEvent from '../utils/getTimeUntilEvent';
import getAriaLabelForMultipleCalendarEvents from '../utils/getAriaLabelForMultipleCalendarEvents';
import { observer } from 'mobx-react-lite';
import { CommandBarButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { logUsage } from 'owa-analytics';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import loc, { format } from 'owa-localize';
import { lazyOpenEventDetailsView, lazyOpenTimePanelInCalendarView } from 'owa-time-panel';
import { isTimePanelAvailable } from 'owa-time-panel-bootstrap';
import { getCalendarPath } from 'owa-url';
import { lazyPopoutCalendarReadingPane } from 'owa-popout-calendar';
import * as React from 'react';
import {
    getCalendarEventItemAriaLabel,
    getCalendarEventItemSubjectText,
    getCalendarEventItemTitleWithLocation,
} from 'owa-calendar-event-attributes';

import styles from './UpNextV2Event.scss';

const UPNEXT_SOURCE = 'UpNext';
const MAX_EVENT_ROWS = 3;

export interface UpNextEventProps {
    upNextEvent: CalendarEvent;
    conflictingEvents: CalendarEvent[];
    containerStyle: IButtonStyles;
}

/**
 * Navigate to the appropriate view of the TimePanel
 * @param eventId id of the upcoming event
 */
function navigateToTimePanel(eventId: ClientItemId) {
    logUsage('TnS_UpNextClicked');

    if (!eventId) {
        lazyOpenTimePanelInCalendarView.importAndExecute(UPNEXT_SOURCE);
    } else {
        lazyOpenEventDetailsView.importAndExecute(UPNEXT_SOURCE, eventId);
    }
}

/**
 * Opens calendar event deep link or calendar if the eventId is null
 * @param eventId id of the upcoming event
 */
function openDeeplinkCalendar(eventId: ClientItemId) {
    if (!eventId) {
        window.open(getCalendarPath());
    } else {
        lazyPopoutCalendarReadingPane.importAndExecute(eventId, 'Mail_UpNext', null /* data */);
    }
}

function addEventRow(
    eventRows: JSX.Element[],
    id: string,
    name: string,
    location: string,
    eventCountString: string,
    timeUntilEvent: string
) {
    eventRows.push(
        <UpNextV2Event
            key={id}
            eventCountString={eventCountString}
            eventLocation={location}
            eventName={name}
            timeUntilEvent={timeUntilEvent}
        />
    );
}

export default observer(function UpNextV2EventList(props: UpNextEventProps) {
    let onMouseOverCallback;
    const upNextEvent = props.upNextEvent;
    const eventId = upNextEvent.ItemId;
    const totalEventsCount = props.conflictingEvents.length + 1;
    const areThereConflicts = totalEventsCount > 1;
    const allUpcomingEvents = [upNextEvent, ...props.conflictingEvents];

    // If there are conflicting events, we want to navigate to TimePanel Agenda/Day view rather than event details view
    const eventIdToNavigateTo = !areThereConflicts && eventId;
    const onUpNextClicked = React.useCallback(() => {
        if (isTimePanelAvailable()) {
            navigateToTimePanel(eventIdToNavigateTo);
        } else {
            openDeeplinkCalendar(eventIdToNavigateTo);
        }
    }, [eventIdToNavigateTo]);

    const onMouseEnterUpNext = React.useCallback(() => {
        const totalNumberOfEvents = allUpcomingEvents.length;
        onMouseOverCallback = setTimeout(() => {
            if (onMouseOverCallback) {
                logUsage('TnS_UpNextHover', [totalNumberOfEvents]);
            }
            onMouseOverCallback = null;
        }, 300);
    }, [eventIdToNavigateTo]);

    const onMouseLeaveUpNext = React.useCallback(() => {
        onMouseOverCallback = null;
    }, [eventIdToNavigateTo]);

    React.useEffect(() => {
        // Should be logged every-time we show a different primary up-next event
        logUsage('TnS_UpNext', [allUpcomingEvents.length], { sessionSampleRate: 10 });
    }, [eventIdToNavigateTo]);

    const eventRows = [];
    const shouldShowViewAll = totalEventsCount > MAX_EVENT_ROWS;
    const numberOfEventsToShow = shouldShowViewAll ? MAX_EVENT_ROWS - 1 : allUpcomingEvents.length;

    // Add upcoming events
    for (let i = 0; i < numberOfEventsToShow; i++) {
        const event = allUpcomingEvents[i];
        const eventLocation = event.Location?.DisplayName;
        const eventCountString =
            areThereConflicts && format(loc(eventCountForUpNext), i + 1, totalEventsCount);
        const timeUntilEvent = getTimeUntilEvent(event, !!eventLocation /* addNowSeparator */);
        addEventRow(
            eventRows,
            event.ItemId.Id,
            getCalendarEventItemSubjectText(event),
            eventLocation,
            eventCountString,
            timeUntilEvent
        );
    }

    // Add View all events row
    if (shouldShowViewAll) {
        const remainingEventsCount = totalEventsCount - numberOfEventsToShow;
        addEventRow(
            eventRows,
            'viewAll',
            loc(viewAllEvents),
            null /* eventLocation */,
            format(loc(plusNEvents), remainingEventsCount),
            getTimeUntilEvent(upNextEvent, false /* addNowSeparator */)
        );
    }

    let allEventsFlexContainerStyle = styles.allEventsContainer;
    if (totalEventsCount == 2) {
        allEventsFlexContainerStyle = styles.allEventsContainerTwoEvents;
    } else if (totalEventsCount > 2) {
        allEventsFlexContainerStyle = styles.allEventsContainerThreeOrMoreEvents;
    }

    // Explicitly set `undefined` when there are conflicts, since title={false} is a react error
    const titleString = areThereConflicts
        ? undefined
        : getCalendarEventItemTitleWithLocation(upNextEvent);
    const ariaLabelString = areThereConflicts
        ? getAriaLabelForMultipleCalendarEvents(
              allUpcomingEvents.slice(0, numberOfEventsToShow),
              allUpcomingEvents.length,
              shouldShowViewAll
          )
        : getCalendarEventItemAriaLabel(upNextEvent);

    return (
        <CommandBarButton
            ariaLabel={ariaLabelString}
            className={styles.upNextEventButtonContainer}
            data-is-focusable={true}
            data-automation-id={'UpNext'}
            onClick={onUpNextClicked}
            role={'menuitem'}
            title={titleString}
            styles={props.containerStyle}>
            <div
                className={allEventsFlexContainerStyle}
                onMouseEnter={onMouseEnterUpNext}
                onMouseLeave={onMouseLeaveUpNext}>
                {eventRows}
            </div>
        </CommandBarButton>
    );
});
