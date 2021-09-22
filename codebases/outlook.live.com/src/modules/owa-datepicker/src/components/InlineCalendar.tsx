import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Calendar, ICalendarProps, ICalendarDayGridStyles } from '@fluentui/react';
import { dateTimeFormatter, OwaDate, owaDate, asDate, addYears } from 'owa-datetime';
import { getCalendarStrings, getTzOrUserTimeZone, getOwaDate } from 'owa-datepicker-common';
import { getPalette } from 'owa-theme';
import { mergeStyleSets } from '@fluentui/merge-styles';
import * as styles from './DropdownDatePicker.scss';

import classNames from 'classnames';

export interface InlineCalendarProps
    extends Omit<
        ICalendarProps,
        | 'dateTimeFormatter'
        | 'maxDate'
        | 'minDate'
        | 'onSelectDate'
        | 'showSixWeeksByDefault'
        | 'strings'
        | 'today'
        | 'value'
    > {
    maxDate?: OwaDate;
    minDate?: OwaDate;
    onSelectDate: (date: OwaDate, selectedDateRangeArray?: OwaDate[]) => void;
    value: OwaDate | null | undefined;
    timeZoneId?: string;
    numOfDaysInDayRange?: number;
    hideTodayEmphasis?: boolean;
}

/** A mini-calendar that is localized and formats dates according to user options */
export const InlineCalendar = observer(function InlineCalendar(props_0: InlineCalendarProps) {
    props_0 = {
        showMonthPickerAsOverlay: true,
        ...props_0,
    };
    const onSelectDate_0 = (date: Date, dates?: Date[]) => {
        const { value, onSelectDate, timeZoneId } = props_0;
        const tz = getTzOrUserTimeZone(value, timeZoneId);
        const selectedDate = getOwaDate(tz, date);
        const selectedDates = dates && dates.map(d => getOwaDate(tz, d));
        onSelectDate(selectedDate, selectedDates);
    };
    const {
        maxDate,
        minDate,
        onSelectDate,
        value,
        timeZoneId,
        hideTodayEmphasis,
        ...calendarProps
    } = props_0;

    // Passing null or undefined results in Date.now() being used instead, so to
    // prevent the today emphasis visuals, we need to provide an arbitrary date
    // that isn't in view. This is achieved by subtracting one year from the
    // 'value' date to present.
    const tzDateForTodayEmphasis = hideTodayEmphasis
        ? addYears(value, -1)
        : owaDate(getTzOrUserTimeZone(value, timeZoneId));
    const palette = getPalette();
    // in OWA we always want work week styling to hover/select the entire week
    const workWeekDays = [0, 1, 2, 3, 4, 5, 6];
    // default props to override the styles everywhere this gets used
    const props = {
        ...calendarProps,
        calendarDayProps: {
            ...calendarProps?.calendarDayProps,
            styles: mergeStyleSets(
                calendarProps?.calendarDayProps?.styles as ICalendarDayGridStyles,
                {
                    dayCell: {
                        selectors: {
                            '&.ms-CalendarDay-hoverStyle': {
                                backgroundColor: palette.neutralLight + '!important',
                            },
                            '&.ms-CalendarDay-pressedStyle': {
                                backgroundColor: palette.themeLight + '!important',
                            },
                        },
                    },
                    daySelected: {
                        backgroundColor: palette.themeLight,
                        selectors: {
                            '&.ms-CalendarDay-hoverStyle, &.ms-CalendarDay-pressedStyle, &:hover': {
                                backgroundColor: palette.themeLight + '!important',
                            },
                        },
                    },
                }
            ),
        },
    };
    // Always display 6 weeks in calendar to ensure the height of
    // the control doesn't change as the user moves between months
    return (
        <Calendar
            {...props}
            className={classNames(styles.inlineCalendar, props.className)}
            dateTimeFormatter={dateTimeFormatter}
            maxDate={asDate(maxDate)}
            minDate={asDate(minDate)}
            onSelectDate={onSelectDate_0}
            showSixWeeksByDefault={true}
            strings={getCalendarStrings()}
            today={asDate(tzDateForTodayEmphasis)}
            value={asDate(value)}
            workWeekDays={workWeekDays}
        />
    );
});
