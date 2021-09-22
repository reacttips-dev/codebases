import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { DatePicker, IDatePicker, IDatePickerProps } from '@fluentui/react/lib/DatePicker';
import {
    asDate,
    dateTimeFormatter,
    endOfDay,
    isEqual,
    isWithinRange,
    MAX_JAVASCRIPT_DATE,
    MAX_OUTLOOK_DATE,
    MIN_JAVASCRIPT_DATE,
    MIN_OUTLOOK_DATE,
    owaDate,
    OwaDate,
    parseUserDate,
    startOfDay,
} from 'owa-datetime';
import { getUserOptions } from 'owa-session-store';
import { getCalendarStrings, getTzOrUserTimeZone } from 'owa-datepicker-common';

import classNames from 'classnames';
import styles from './DropdownDatePicker.scss';

export interface DropdownDatePickerProps
    extends Omit<
        IDatePickerProps,
        | 'allowTextInput'
        | 'calendarProps'
        | 'componentRef'
        | 'dateTimeFormatter'
        | 'formatDate'
        | 'initialPickerDate'
        | 'isMonthPickerVisible'
        | 'maxDate'
        | 'minDate'
        | 'onSelectDate'
        | 'parseDateFromString'
        | 'showGoToToday'
        | 'showMonthPickerAsOverlay'
        | 'strings'
        | 'today'
        | 'value'
    > {
    initialPickerDate?: OwaDate;
    maxDate?: OwaDate;
    minDate?: OwaDate;
    onSelectDate: (date: OwaDate) => void;
    value: OwaDate | null | undefined;
    timeZoneId?: string;
    allowTextInput?: boolean;
}

/**
 * A dropdown date picker that is localized, formats dates according to OWA's date/time formats,
 * observes OWA options on how to show weeks and default to min/max dates supported by Outlook
 */
export const DropdownDatePicker = observer(function DropdownDatePicker(
    props: DropdownDatePickerProps
) {
    props = {
        maxDate: MAX_OUTLOOK_DATE,
        minDate: MIN_OUTLOOK_DATE,
        ...props,
    };
    // This is used to fix a callout dismissal bug in IE11 with React 16 and Fabric Contextual Menus
    const dateSelector = React.useRef(React.createRef<IDatePicker>());
    const onCalendarSelectWasCalled = React.useRef<boolean>(false);
    const onSelectDate = (date: Date | null | undefined) => {
        if (date) {
            const { value, onSelectDate, timeZoneId } = props;
            const selectedDate = owaDate(
                getTzOrUserTimeZone(value, timeZoneId),
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            onSelectDate(selectedDate);
        }
    };
    const parseDateFromString = (str: string) => {
        const { maxDate, minDate, value } = props;
        const parsedDate = parseUserDate(str, value);
        const startOfMinDay = getLimitDate(minDate, MIN_JAVASCRIPT_DATE, startOfDay);
        const endOfMaxDay = getLimitDate(maxDate, MAX_JAVASCRIPT_DATE, endOfDay);
        return parsedDate && isWithinRange(parsedDate, startOfMinDay, endOfMaxDay)
            ? asDate(parsedDate)
            : null;
    };
    const onCalendarSelect = () => {
        onCalendarSelectWasCalled.current = true;
    };
    /**
     * Callback issued when the menu is dimissed to ensure the focus goes back to the input after
     * the user interacts with the calendar menu
     */
    const onAfterMenuDismissPreventIE11React16CalloutDismiss = () => {
        if (onCalendarSelectWasCalled.current) {
            dateSelector.current.current.focus();
            onCalendarSelectWasCalled.current = false;
        }
        if (props.onAfterMenuDismiss) {
            props.onAfterMenuDismiss();
        }
    };
    const {
        className,
        disabled,
        initialPickerDate,
        maxDate,
        minDate,
        value,
        timeZoneId,
        allowTextInput = true,
        ...datePickerProps
    } = props;
    const { WeekStartDay, FirstWeekOfYear, ShowWeekNumbers } = getUserOptions();
    const strings = getCalendarStrings();
    const tzNow = owaDate(getTzOrUserTimeZone(value, timeZoneId));
    const startOfMinDay = getLimitDate(minDate, MIN_JAVASCRIPT_DATE, startOfDay);
    const endOfMaxDay = getLimitDate(maxDate, MAX_JAVASCRIPT_DATE, endOfDay);
    const showGoToToday = isWithinRange(tzNow, startOfMinDay, endOfMaxDay);
    // Always display 6 weeks in calendar to ensure the height of
    // the control doesn't change as the user moves between months.
    // When clicking on "Today", select the date and close the calendar.
    const calendarProps = {
        onSelectDate: onCalendarSelect,
        selectDateOnClick: true,
        showSixWeeksByDefault: true,
        strings: strings,
    };
    const datePickerClass = classNames(styles.datepickerInput, className, {
        [styles.grey]: disabled,
    });
    return (
        <DatePicker
            {...datePickerProps}
            allowTextInput={allowTextInput}
            calendarProps={calendarProps}
            className={datePickerClass}
            componentRef={dateSelector.current}
            dateTimeFormatter={dateTimeFormatter}
            disabled={disabled}
            firstDayOfWeek={WeekStartDay}
            firstWeekOfYear={FirstWeekOfYear as any}
            formatDate={dateTimeFormatter.formatUserDate}
            initialPickerDate={asDate(initialPickerDate)}
            maxDate={asDate(maxDate)}
            minDate={asDate(minDate)}
            onAfterMenuDismiss={onAfterMenuDismissPreventIE11React16CalloutDismiss}
            onSelectDate={onSelectDate}
            parseDateFromString={parseDateFromString}
            showGoToToday={showGoToToday}
            showMonthPickerAsOverlay={true}
            showWeekNumbers={ShowWeekNumbers}
            strings={strings}
            today={asDate(tzNow)}
            value={asDate(value)}
        />
    );
});

function getLimitDate(date: OwaDate, limit: OwaDate, limitFn: typeof startOfDay | typeof endOfDay) {
    return !date || isEqual(date, limit) ? limit : limitFn(date);
}
