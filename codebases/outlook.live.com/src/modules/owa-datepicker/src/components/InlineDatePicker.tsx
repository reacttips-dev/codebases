import * as React from 'react';
import { InlineCalendar, InlineCalendarProps } from './InlineCalendar';
import { getUserOptions } from 'owa-session-store';
import { MIN_OUTLOOK_DATE, MAX_OUTLOOK_DATE } from 'owa-datetime';
import { observer } from 'mobx-react-lite';

/**
 * An inline date picker that is localized, formats dates according to OWA's date/time formats,
 * observes OWA options on how to show weeks and default to min/max dates supported by Outlook.
 *
 * `showWeekNumbers` should be left `undefined` in most cases, so we respect the user settings.
 * Passing `true` or `false` will force the control into the corresponding state, ignoring user settings.
 * This should NEVER be your first design decision...
 */
export const InlineDatePicker = observer(
    ({
        maxDate = MAX_OUTLOOK_DATE,
        minDate = MIN_OUTLOOK_DATE,
        showWeekNumbers,
        ...formattedalendarProps
    }: Omit<InlineCalendarProps, 'firstDayOfWeek' | 'firstWeekOfYear' | 'showWeekNumbers'> & {
        showWeekNumbers?: boolean;
    }) => {
        const { WeekStartDay, FirstWeekOfYear, ShowWeekNumbers } = getUserOptions();
        const effectiveShowWeekNumbers = showWeekNumbers ?? ShowWeekNumbers;
        return (
            <InlineCalendar
                {...formattedalendarProps}
                maxDate={maxDate}
                minDate={minDate}
                firstDayOfWeek={WeekStartDay}
                firstWeekOfYear={FirstWeekOfYear as any}
                showWeekNumbers={effectiveShowWeekNumbers}
            />
        );
    }
);
