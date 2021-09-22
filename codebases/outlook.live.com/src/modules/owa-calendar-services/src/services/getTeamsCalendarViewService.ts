import type GetCalendarViewResponse from 'owa-service/lib/contract/GetCalendarViewResponse';
import { GET } from 'owa-ows-rest-api';

// TODO VSO 114554: update calendar events services to consume ISO string dates
export default async function getTeamsCalendarViewService(
    rangeStart: string,
    rangeEnd: string,
    folderId: string,
    channelId: string,
    timeZone: string
): Promise<GetCalendarViewResponse> {
    /** For documentation of this API, see
        https://outlook-sdf.office.com/ows/swagger/index.html#/TeamsCalendarEvents
    */
    const requestUri = `ows/api/beta/TeamsCalendarEvents/items?id=${encodeURIComponent(
        folderId
    )}&rangeStart=${encodeURIComponent(rangeStart)}&rangeEnd=${encodeURIComponent(
        rangeEnd
    )}&channelId=${channelId}&timeZone=${timeZone}`;
    return GET<Promise<GetCalendarViewResponse>>('getTeamsCalendarView', null, requestUri);
}
