import { getStore } from '../store';
import { initializeOwaDateTimeStore } from '../actions/internalActions';
import { mutator, mutatorAction } from 'satcheljs';
import { timeZoneRanges } from '../utils/timeZoneRanges';
import type TimeZoneRangeType from 'owa-service/lib/contract/TimeZoneRangeType';

// Initialize the store with time zone presents in sessiondata...
mutator(initializeOwaDateTimeStore, actionMessage => {
    if (actionMessage.MailboxTimeZoneOffset) {
        for (var ii = 0; ii < actionMessage.MailboxTimeZoneOffset.length; ii++) {
            const offset = actionMessage.MailboxTimeZoneOffset[ii];
            getStore().TimeZoneRanges[offset.TimeZoneId!] = timeZoneRanges(
                offset.OffsetRanges as Required<TimeZoneRangeType>[]
            );
        }
    }
});

export const setTimeZoneRange = mutatorAction(
    'setTimeZoneRange',
    (timeZoneId: string, offsetRanges: Required<TimeZoneRangeType>[], ianaTimeZones: string[]) => {
        getStore().TimeZoneAlternateNames.set(timeZoneId, ianaTimeZones);
        getStore().TimeZoneRanges[timeZoneId] = timeZoneRanges(offsetRanges);
    }
);
