import { observer } from 'mobx-react-lite';
import Reminder from './Reminder';
import onReminderClicked from '../../actions/onReminderClicked';
import type { ReminderData } from '../../store/schema/ReminderData';
import getFormattedTimeUntilEvent from '../../utils/getFormattedTimeUntilEvent';
import lowercaseFormatDuration from 'owa-duration-formatter/lib/lowercase';
import { minute } from 'owa-duration-formatter/lib/magnitudesInSeconds';
import isTaskReminder from '../../utils/isTaskReminder';
import loc from 'owa-localize';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import { observableNow } from 'owa-observable-datetime';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type ReminderGroupTypes from 'owa-service/lib/contract/ReminderGroupTypes';
import * as React from 'react';
import {
    addMinutes,
    differenceInMinutes,
    formatUserTime,
    isAllDayEvent,
    now,
    OwaDate,
    userDate,
} from 'owa-datetime';
import {
    reminder_allday_time,
    reminder_snooze_header,
    reminder_snooze_5minbefore,
    reminder_snooze_0minbefore,
} from './ReminderForCalendarOrTask.locstring.json';
import {
    dismissReminder as dismissReminderAction,
    snoozeReminder,
} from 'owa-reminder-orchestration';
import { IContextualMenuItem, ContextualMenuItemType } from '@fluentui/react/lib/ContextualMenu';

const MAX_SNOOZE_MINUTES = 120;

export interface ReminderProps {
    reminder: ReminderData;
    snooze?: (reminder: ItemId, newReminderTime: OwaDate) => void;
    navigateToReminder?: (reminder: string, reminderType: ReminderGroupTypes) => void;
    dismissReminder?: (reminder: ItemId) => void;
}

function isContextMenuItem(item: IContextualMenuItem | false): item is IContextualMenuItem {
    return typeof item !== 'boolean';
}

export default observer(function ReminderForCalendarOrTask(props: ReminderProps) {
    props = {
        dismissReminder: dismissReminderAction,
        snooze: snoozeReminder,
        navigateToReminder: onReminderClicked,
        ...props,
    };
    const startTime_0 = {
        get(): string {
            const { startTime, endTime, reminderTime } = props.reminder;

            // reminderTime and startTime are stored as an OwaDate (instead of a string) in the reminder store, which means we effectively
            // don't have mobx registration for OwaDate internals like time zone.  As a work-around, we re-create OwaDate typee before being displayed.
            if (isTask.get()) {
                return formatUserTime(userDate(reminderTime));
            } else if (isAllDayEvent(startTime, endTime)) {
                return loc(reminder_allday_time);
            } else {
                return formatUserTime(userDate(startTime));
            }
        },
    };
    const isTask = {
        get(): boolean {
            return isTaskReminder(props.reminder.reminderType);
        },
    };
    const snoozeMenuItems = (renderTime: OwaDate) => {
        const { reminder } = props;
        // Event reminders have options of 5 mins and 0 mins before. These are not applicable to Task reminders.
        // Event reminders have only snoozing options enabled from 5...120 minutes that are not past the end time of the event.
        // Task reminders have all snoozing options enabled from 5...120 minutes.
        let minutesUntilStart = differenceInMinutes(reminder.startTime, renderTime);
        let minutesUntilEnd = isTask.get()
            ? MAX_SNOOZE_MINUTES + 1
            : differenceInMinutes(reminder.endTime, renderTime);
        return [
            {
                key: 'snooze',
                itemType: ContextualMenuItemType.Header,
                name: loc(reminder_snooze_header),
            },
            // Snooze until 5 minutes before start
            !isTask.get() &&
                minutesUntilStart >= 5 && {
                    key: '5minBefore',
                    name: loc(reminder_snooze_5minbefore),
                    onClick: onSnoozeUntil,
                    data: 5 /* minutes */,
                },
            // Snooze until 0 minutes before start
            !isTask.get() &&
                minutesUntilStart >= 0 && {
                    key: '0minBefore',
                    name: loc(reminder_snooze_0minbefore),
                    onClick: onSnoozeUntil,
                    data: 0 /* minutes */,
                },
            // Snooze for n minutes
            ...[5, 10, 15, 30, 60, 120].map(
                snoozeMinutes =>
                    minutesUntilEnd >= snoozeMinutes && createSnoozeMenuItem(snoozeMinutes)
            ),
        ].filter(isContextMenuItem);
    };
    const onSnoozeUntil = (ev: React.MouseEvent<HTMLElement>, item: IContextualMenuItem) => {
        const minutesUntilEnd = item.data as number;
        snooze(addMinutes(props.reminder.startTime, -minutesUntilEnd));
    };
    const onSnoozeFor = (ev: React.MouseEvent<HTMLElement>, item: IContextualMenuItem) => {
        const minutes = item.data as number;
        snooze(addMinutes(now(), minutes));
    };
    const snooze = (newReminderTime: OwaDate) => {
        const { snooze, reminder } = props;
        !!snooze && snooze(reminder.itemId, newReminderTime);
    };
    const createSnoozeMenuItem = (snoozeMinutes: number): IContextualMenuItem => {
        return {
            key: snoozeMinutes.toString(),
            name: lowercaseFormatDuration(snoozeMinutes * minute, { maxUnits: 1 }),
            onClick: onSnoozeFor,
            data: snoozeMinutes,
        };
    };
    const renderTime = observableNow();
    const { reminder, navigateToReminder, dismissReminder } = props;
    const timeUntil = getFormattedTimeUntilEvent(reminder, renderTime);
    let charmId = reminder.charmId;
    if (isTask.get() && !charmId) {
        charmId = 55; // The task (checkmark) charm
    }
    let subject = reminder.subject;
    if (!subject) {
        subject = loc(noSubject);
    }
    return (
        /**
         * The parent <TransitionGroup> passes several properties that the CSSTransition needs.
         * However, I don't want to expose internal workings to the outside in the props,
         * so I just pass all props down to Reminder which passes them to the CSSTransition.
         **/
        <Reminder
            {...props}
            reminderId={reminder.itemId}
            reminderType={reminder.reminderType}
            charmId={charmId}
            subject={subject}
            location={reminder.location}
            startTimeDisplayString={startTime_0.get()}
            timeUntilDisplayString={timeUntil}
            snoozeMenuItems={snoozeMenuItems(renderTime)}
            navigateToReminder={navigateToReminder}
            dismissReminder={dismissReminder}
        />
    );
});
