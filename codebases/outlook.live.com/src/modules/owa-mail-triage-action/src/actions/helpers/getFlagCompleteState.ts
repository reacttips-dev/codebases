import { assertNever } from 'owa-assert';
import {
    addDays,
    endOfWeek,
    getDay,
    getISOString,
    now,
    OwaDate,
    startOfDay,
    startOfWeek,
} from 'owa-datetime';
import { createWorkWeekDaysArray } from 'owa-datetime-utils';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import type FlagType from 'owa-service/lib/contract/FlagType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export enum FlagCompleteEnum {
    today,
    tomorrow,
    thisWeek,
    nextWeek,
    noDate,
    complete,
    clear,
}

export default function getFlagCompleteState(flagAction: FlagCompleteEnum): FlagType {
    const userOptions = getUserConfiguration().UserOptions;
    const workDays = userOptions.WorkingHours.WorkDays;

    let dueDate: string;
    let startDate: string;
    let completeDate: string;

    let dates: string[];
    let flagStatusToApply: FlagStatus;
    const currentTime = now();

    switch (flagAction) {
        case FlagCompleteEnum.today:
            startDate = getISOString(currentTime);
            dueDate = startDate;
            flagStatusToApply = 'Flagged';
            break;
        case FlagCompleteEnum.tomorrow:
            startDate = getISOString(addDays(startOfDay(currentTime), 1));
            dueDate = startDate;
            flagStatusToApply = 'Flagged';
            break;
        case FlagCompleteEnum.thisWeek:
            dates = setFlagThisWeek(workDays, currentTime);
            startDate = dates[0];
            dueDate = dates[1];
            flagStatusToApply = 'Flagged';
            break;
        case FlagCompleteEnum.nextWeek:
            dates = setFlagNextWeek(userOptions.WeekStartDay, workDays, currentTime);
            startDate = dates[0];
            dueDate = dates[1];
            flagStatusToApply = 'Flagged';
            break;
        case FlagCompleteEnum.noDate:
            flagStatusToApply = 'Flagged';
            break;
        case FlagCompleteEnum.complete:
            completeDate = getISOString(currentTime);
            flagStatusToApply = 'Complete';
            break;
        case FlagCompleteEnum.clear:
            flagStatusToApply = 'NotFlagged';
            break;
        default:
            assertNever(flagAction);
            break;
    }

    const flagType: FlagType = {
        FlagStatus: flagStatusToApply,
        StartDate: startDate,
        DueDate: dueDate,
        CompleteDate: completeDate,
    };
    return flagType;
}

function setFlagThisWeek(workDaysNum: number, currentTime: OwaDate): any {
    const dayOfWeek = getDay(currentTime);
    const daysToStartOfNextWeek = 7 - dayOfWeek;
    let daysToStartDate = 2;

    // If days to end of week is <= 2 && > 0, then we need to back up so that we are within this week
    if (0 < daysToStartOfNextWeek && daysToStartOfNextWeek <= 2) {
        daysToStartDate = daysToStartOfNextWeek - 1;
    }

    // Calculate start date
    let startDate = addDays(startOfDay(currentTime), daysToStartDate);

    const workDays = createWorkWeekDaysArray(workDaysNum);

    // Make sure start date is a working day, if not, move backwards to the last working day,
    // or until we get to todays date
    while (currentTime < startDate && !workDays.includes(getDay(startDate))) {
        startDate = addDays(startOfDay(startDate), -1);
    }

    // Set due date to the end of this week
    let dueDate = addDays(startOfDay(currentTime), daysToStartOfNextWeek - 1);

    // Check if the due date is a working day, if it isn't, go back until we hit a working day or
    // until we get to start date
    while (startDate < dueDate && !workDays.includes(getDay(dueDate))) {
        dueDate = addDays(startOfDay(dueDate), -1);
    }
    return [getISOString(startDate), getISOString(dueDate)];
}

function setFlagNextWeek(weekStartDay: number, workDaysNum: number, currentTime: OwaDate): any {
    const nextWeekToday = addDays(currentTime, 7);

    let startDate = startOfWeek(nextWeekToday, weekStartDay);

    const workDays = createWorkWeekDaysArray(workDaysNum);

    // Check if the start date is a working day, if it isn't, go forward until we hit a working day or until
    // we hit the end of next week at which point we leave it on that date
    for (let i = 0; i < 7 && !workDays.includes(getDay(startDate)); ++i) {
        startDate = addDays(startOfDay(startDate), 1);
    }

    let dueDate = endOfWeek(nextWeekToday, weekStartDay);
    while (startDate < dueDate && !workDays.includes(getDay(dueDate))) {
        dueDate = addDays(startOfDay(dueDate), -1);
    }
    return [getISOString(startDate), getISOString(dueDate)];
}
