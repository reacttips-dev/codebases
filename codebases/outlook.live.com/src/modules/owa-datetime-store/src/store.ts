import type { TimeZoneRange } from './TimeZoneRange';
import { MAX_JAVASCRIPT_TIMESTAMP, MIN_JAVASCRIPT_TIMESTAMP } from 'owa-date-constants';
import type TimeZoneEntry from 'owa-service/lib/contract/TimeZoneEntry';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

export const getStore = createStore('owaDateTime', {
    AllTimeZones: [] as TimeZoneEntry[],
    DateFormat: '',
    LocalTimeZone: 'UTC',
    TimeFormat: '',
    TimeZoneRanges: {
        UTC: [
            {
                start: MIN_JAVASCRIPT_TIMESTAMP,
                end: MAX_JAVASCRIPT_TIMESTAMP,
                localStart: MIN_JAVASCRIPT_TIMESTAMP,
                localEnd: MAX_JAVASCRIPT_TIMESTAMP,
                offset: 0,
            },
        ],
    } as { [timeZoneId: string]: TimeZoneRange[] },
    TimeZoneAlternateNames: new ObservableMap<string, string[]>(),
});
