import weeklyRecurrenceHandler from './weeklyRecurrenceHandler';
import relativeMonthlyRecurrenceHandler from './relativeMonthlyRecurrenceHandler';
import absoluteMonthlyRecurrenceHandler from './absoluteMonthlyRecurrenceHandler';
import relativeYearlyRecurrenceHandler from './relativeYearlyRecurrenceHandler';
import absoluteYearlyRecurrenceHandler from './absoluteYearlyRecurrenceHandler';
import dailyRecurrenceHandler from './dailyRecurrenceHandler';
import type RecurrencePatternHandler from './RecurrencePatternHandler';
import type RecurrencePatternBaseType from 'owa-service/lib/contract/RecurrencePatternBaseType';

const recurrenceHandlers: RecurrencePatternHandler[] = [
    weeklyRecurrenceHandler,
    relativeMonthlyRecurrenceHandler,
    absoluteMonthlyRecurrenceHandler,
    relativeYearlyRecurrenceHandler,
    absoluteYearlyRecurrenceHandler,
    dailyRecurrenceHandler,
];

export default function getRecurrenceHandler(
    pattern: RecurrencePatternBaseType
): RecurrencePatternHandler {
    let handler;

    for (let i = 0; i < recurrenceHandlers.length; i++) {
        if (recurrenceHandlers[i].canHandle(pattern)) {
            handler = recurrenceHandlers[i];
            break;
        }
    }

    if (!handler) {
        throw new Error('Invalid recurrence type');
    }

    return handler;
}
