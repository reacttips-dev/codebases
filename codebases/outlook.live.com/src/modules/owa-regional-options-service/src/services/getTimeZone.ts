import getTimeZoneOperation from 'owa-service/lib/operation/getTimeZoneOperation';
import type TimeZoneEntry from 'owa-service/lib/contract/TimeZoneEntry';

export default function getTimeZone(): Promise<TimeZoneEntry[]> {
    return getTimeZoneOperation({
        needTimeZoneList: true,
    }).then(response => response.TimeZoneList);
}
