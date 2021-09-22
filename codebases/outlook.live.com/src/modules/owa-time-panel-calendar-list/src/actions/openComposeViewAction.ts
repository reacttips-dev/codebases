import type { QuickComposeEntrySourceType } from 'owa-calendar-helpers-types/lib/ComposeMetricTypes';
import type { CalendarEvent } from 'owa-calendar-types';
import { action } from 'satcheljs';

export const openComposeView = action(
    'openComposeView',
    (event: Partial<CalendarEvent>, entrySource: QuickComposeEntrySourceType) => ({
        event,
        entrySource,
    })
);
