import { errorReplyByMeeting } from './replyByMeeting.locstring.json';
import datapoints from '../datapoints';
import type CalendarInlineComposeViewState from '../store/schema/CalendarInlineComposeViewState';
import { lazyLogSigsDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import type { ActionSource } from 'owa-analytics-types';
import { addHours, addMinutes, now, OwaDate, startOfHour } from 'owa-datetime';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc from 'owa-localize';
import { FlightNames } from 'owa-mail-smart-pill-features';
import { ClientItem, getStore } from 'owa-mail-store';
import addPopoutV2 from 'owa-popout-v2/lib/actions/addPopoutV2';
import { CALENDAR_POPOUT_OPTIONS } from 'owa-popout-calendar';
import getDefaultEventDuration from 'owa-session-store/lib/selectors/getDefaultEventDuration';
import { trace } from 'owa-trace';
import { replyByMeetingService } from 'owa-reply-by-meeting-service';

const HOURS_IN_ADVANCE = 2; // Make start time 2 hours in advance to prevent reminder showing up immediately

export default wrapFunctionForDatapoint(
    datapoints.ReplyByMeeting,
    function replyByMeeting(
        referenceItemId: string,
        calendarInlineComposeViewState?: CalendarInlineComposeViewState,
        shouldSend?: boolean,
        actionSource?: ActionSource,
        extractionEntityId?: string,
        internetMessageId?: string,
        sigsData?: { [key: string]: string }
    ): Promise<void> {
        let data = calendarInlineComposeViewState
            ? calendarInlineComposeViewState.smartTimeSuggestion
            : null;
        const content = calendarInlineComposeViewState
            ? calendarInlineComposeViewState.content
            : null;
        const location = calendarInlineComposeViewState
            ? calendarInlineComposeViewState.location
            : null;

        if (!data || !data.startTime || !data.endTime) {
            const [startTime, endTime] = getStartEndTime();

            if (!data) {
                data = {
                    startTime: startTime,
                    endTime: endTime,
                };
            } else {
                data.startTime = startTime;
                data.endTime = endTime;
            }
        }

        const eventIdPromise = replyByMeetingService(
            referenceItemId,
            data.startTime,
            data.endTime,
            location,
            content,
            shouldSend
        );

        let extractionSourceId: string = null;
        /* only set the extraction entity id for smart time feature */
        if (isFeatureEnabled(FlightNames.SmartReplyWithCustomMeetingTime)) {
            extractionSourceId = extractionEntityId;
        }

        const isSmartReplyWithMeeting = extractionSourceId != null;

        const referenceItem: ClientItem = getStore().items.get(referenceItemId);

        lazyLogSigsDatapoint.importAndExecute(
            isSmartReplyWithMeeting ? 'SmartReplyByMeeting' : 'ReplyWithMeeting',
            {
                compliance: 'CustomerContent',
                customProperties: {
                    InternetMessageId: internetMessageId,
                    MessageBody: content,
                    ...referenceItem?.SIGSData?.SmartPillData,
                    ...sigsData,
                },
            }
        );

        addPopoutV2(
            'calendar',
            'compose',
            async () => {
                const createdEventId = await eventIdPromise;
                if (!createdEventId) {
                    trace.warn(loc(errorReplyByMeeting));
                }

                return Promise.resolve(
                    createdEventId && !shouldSend
                        ? {
                              draftItemId: createdEventId,
                              extractionSourceId: extractionSourceId,
                              internetMessageId: internetMessageId,
                              composeEntrySource: isSmartReplyWithMeeting
                                  ? 'Mail_SmartReplyWithMeeting'
                                  : 'Mail_ReplyByAllMeeting',
                              shouldInitializeForNewDraft: true,
                          }
                        : null
                );
            },
            CALENDAR_POPOUT_OPTIONS
        );

        return Promise.resolve();
    }
);

function getStartEndTime(): [OwaDate, OwaDate] {
    const startOfCurrentHour = startOfHour(now());
    const startDate = addHours(startOfCurrentHour, HOURS_IN_ADVANCE);
    const endDate = addMinutes(startDate, getDefaultEventDuration());
    return [startDate, endDate];
}
