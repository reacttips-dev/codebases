import { orchestrator } from 'satcheljs';
import { lazyOpenEventQuickComposeView } from 'owa-time-panel';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { addCalendarEvent } from 'owa-getstarted/lib/actions/addCalendarEvent';

orchestrator(addCalendarEvent, actionMessage => {
    let firstDayOfClassCalendarEvent: Partial<CalendarEvent> = {
        Subject: actionMessage.taskNewEventTitle,
        IsAllDayEvent: true,
    };

    lazyOpenEventQuickComposeView.importAndExecute(
        'GetStarted',
        'GetStarted',
        firstDayOfClassCalendarEvent
    );
});
