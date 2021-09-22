import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { CustomBaseUrl } from 'owa-service/lib/RequestOptions';
import getTimeZoneOffsetsOperation from 'owa-service/lib/operation/getTimeZoneOffsetsOperation';
import type GetTimeZoneOffsetsJsonResponse from 'owa-service/lib/contract/GetTimeZoneOffsetsJsonResponse';
import type TimeZoneOffsetsType from 'owa-service/lib/contract/TimeZoneOffsetsType';

export default function getTimeZoneOffsets(
    isAnonymousRequest: boolean
): Promise<TimeZoneOffsetsType[]> {
    // In order to implement DST heuristics we'll need at least 28 years.
    // This is because there is 14 different types of years:
    // 7, for Jan 1st on each day of year and another 7 for the leap years.
    // Then we basically cycle thru the non-leap years 3 times while we cycle thru
    // the leap years once. So the full cycle that has all of them is 28 years.
    // This LINQPad query can help visualize the sequence:
    //      from year in Enumerable.Range(2010, 100)
    //      let isLeap = new DateTime(year, 2, 28).AddDays(1).Day == 29
    //      let jan1st = new DateTime(year, 1, 1).DayOfWeek
    //      select new { year, code = (isLeap ? 10 : 0) + (int)jan1st  }

    const currentYear = new Date().getFullYear();
    const start = currentYear - 14;
    const end = currentYear + 14;
    const jan1st = '-01-01T00:00:00.000Z';

    return getTimeZoneOffsetsOperation(
        {
            Header: getJsonRequestHeader(),
            Body: {
                StartTime: start + jan1st,
                EndTime: end + jan1st,
            },
        },
        { customBaseUrl: CustomBaseUrl.AnonymousCalendar }
    ).then((response: GetTimeZoneOffsetsJsonResponse) => {
        return response.Body.TimeZones;
    });
}
