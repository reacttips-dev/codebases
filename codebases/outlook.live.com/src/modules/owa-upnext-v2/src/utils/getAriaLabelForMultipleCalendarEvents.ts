import {
    multipleEvents,
    rankOutOfTotalEvents,
    viewAllEvents,
} from '../components/upNext.locstring.json';
import { getCalendarEventItemAriaLabel } from 'owa-calendar-event-attributes';
import type { CalendarEvent } from 'owa-calendar-types';
import loc, { format } from 'owa-localize';

export default function getAriaLabelForMultipleCalendarEvents(
    itemsShown: CalendarEvent[],
    totalEvents: number,
    isViewAllShown: boolean
) {
    let stringBuilder = [];
    stringBuilder.push(format(loc(multipleEvents), totalEvents));

    for (let i = 0; i < itemsShown.length; i++) {
        const item = itemsShown[i];
        stringBuilder.push(format(loc(rankOutOfTotalEvents), i + 1, totalEvents));
        stringBuilder.push(getCalendarEventItemAriaLabel(item));
    }

    if (isViewAllShown) {
        stringBuilder.push(loc(viewAllEvents));
    }

    return stringBuilder.join(' ');
}
