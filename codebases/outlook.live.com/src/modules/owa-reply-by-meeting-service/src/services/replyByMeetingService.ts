import ReplyByMeetingRequest, {
    RestEvent,
    ContentType,
    ReplyByMeetingResponse,
} from './schema/ReplyByMeetingSchema';
import { setupRemoveDraftCalendarMeetingService } from './removeDraftCalendarMeetingService';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { makePostRequest } from 'owa-ows-gateway';
import { getEwsRequestString, OwaDate } from 'owa-datetime';

const REPLY_BY_MEETING_API_URL = 'ows/beta/replybymeeting';

export default function replyByMeetingService(
    referenceItemId: string,
    startTime: OwaDate,
    endTime: OwaDate,
    location: string,
    content: string,
    shouldSend: boolean
): Promise<string | null> {
    const userOptions = getUserConfiguration().UserOptions;
    const evt: RestEvent = {
        ReminderMinutesBeforeStart: userOptions.DefaultReminderTimeInMinutes,
    };

    // This service does not seem to honor the TimeZone value when
    // the DateTime string contains an offset; so we MUST use getEwsRequestString.
    // Ideally, the service would respect whatever DateTime value AND TimeZone are
    // passed in, but this one seems to reset the time zone to UTC if we have offsets.
    if (startTime) {
        evt.Start = {
            DateTime: getEwsRequestString(startTime),
            TimeZone: startTime.tz,
        };
    }

    if (endTime) {
        evt.End = {
            DateTime: getEwsRequestString(endTime),
            TimeZone: endTime.tz,
        };
    }

    if (location) {
        evt.Location = {
            DisplayName: location,
        };
    }

    if (content) {
        evt.Body = {
            Content: content,
            ContentType: ContentType.Html, // smart time data should always have html content
        };
    }

    const request: ReplyByMeetingRequest = {
        ReferenceItemId: referenceItemId,
        ShouldSend: shouldSend,
        Event: evt,
    };

    setupRemoveDraftCalendarMeetingService();

    return makePostRequest(REPLY_BY_MEETING_API_URL, request)
        .then((response: ReplyByMeetingResponse) => {
            return response.CreatedEventId;
        })
        .catch(err => {
            return null;
        });
}
