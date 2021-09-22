import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import isMeetingInPast from 'owa-timeformat/lib/utils/isMeetingInPast';
import type Item from 'owa-service/lib/contract/Item';
import type { OwaDate } from 'owa-datetime';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';

type ConflictingInfo = {
    conflictingMeetingCount: number;
    conflictingMeetingSubject: string;
};

function isMeetingNotFree(meeting: CalendarItem) {
    return meeting.FreeBusyType != 'Free';
}

// Right now this is needed for the classic UI experience for conflicts in popout RP.
// This can be removed once that UI is deprecated.
export function getFutureConflictingMeetings(
    item: MeetingRequestMessageType,
    date: OwaDate
): Item[] {
    const conflictingMeetings = item.ConflictingMeetings?.Items || [];
    return conflictingMeetings
        .filter(isMeetingNotFree)
        .filter(item => !isMeetingInPast(item, date));
}

export function getFutureAdjacentMeetings(item: MeetingRequestMessageType, date: OwaDate): Item[] {
    const adjacentMeetings = item.AdjacentMeetings?.Items || [];
    return adjacentMeetings.filter(isMeetingNotFree).filter(item => !isMeetingInPast(item, date));
}

export function getFutureConflictingMeetingsCountAndSubject(
    item: MeetingRequestMessageType,
    date: OwaDate
): ConflictingInfo {
    let conflictingInfo: ConflictingInfo = {
        conflictingMeetingCount: 0,
        conflictingMeetingSubject: null,
    };

    const useNativeHostConversationEnabled = isHostAppFeatureEnabled(
        'useNativeConversationOptions'
    );
    // Surfacing the available info from Hx to show conflict subject and count- WI: 114890
    if (useNativeHostConversationEnabled && isFeatureEnabled('mon-rp-loadItemViaGql')) {
        if (item?.ConflictingMeetingCount) {
            conflictingInfo.conflictingMeetingCount = item?.ConflictingMeetingCount;
            if (item.ConflictingMeetings?.Items?.length > 0) {
                conflictingInfo.conflictingMeetingSubject =
                    item.ConflictingMeetings.Items[0].Subject;
            }
        }
    } else {
        //OWS response
        const conflictingMeetings = item.ConflictingMeetings?.Items || [];
        const futureConflictingMeetings = conflictingMeetings
            .filter(isMeetingNotFree)
            .filter(item => !isMeetingInPast(item, date));
        conflictingInfo.conflictingMeetingCount = futureConflictingMeetings.length;
        conflictingInfo.conflictingMeetingSubject =
            futureConflictingMeetings.length > 0 ? futureConflictingMeetings[0].Subject : null;
    }
    return conflictingInfo;
}
