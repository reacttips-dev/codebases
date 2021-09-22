import { isMeetingRequest } from 'owa-meeting-message';
import { observableNow } from 'owa-observable-datetime';
import type MeetingCancellationMessageType from 'owa-service/lib/contract/MeetingCancellationMessageType';
import type MeetingRequestMessageType from 'owa-service/lib/contract/MeetingRequestMessageType';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import isMeetingInPast from 'owa-timeformat/lib/utils/isMeetingInPast';

// if a meeting item (after LoadItem is called - since it has all the properties) should show the RSVP button on the listview
export default function shouldMeetingItemShowRSVP(
    meetingItem: MeetingRequestMessageType | MeetingCancellationMessageType
) {
    const folderName = folderIdToName(meetingItem.ParentFolderId.Id);
    if (folderName === 'deleteditems' || folderName === 'sentitems') {
        return false;
    }

    // don't show RSVP for delegate scenarios
    if (!!meetingItem.IsDelegated && !!meetingItem.ReceivedRepresenting) {
        return false;
    }

    // AssociatedCalendarItemId is not available if the meeting cancellation
    // has already been delete and user moves it back to non deleted item folder
    if (!meetingItem.AssociatedCalendarItemId) {
        return false;
    }

    // Cases specific for meeting requests
    if (isMeetingRequest(meetingItem.ItemClass)) {
        const meetingRequest = meetingItem as MeetingRequestMessageType;

        // Don't want to show for no response required scenarios
        if (meetingRequest.MeetingRequestType === 'InformationalUpdate') {
            return false;
        }

        // Don't show RSVP if user has already responded
        if (meetingItem.ResponseType !== 'NoResponseReceived') {
            return false;
        }

        // Don't show if it is a meeting request that is in the past
        if (isMeetingInPast(meetingRequest, observableNow())) {
            return false;
        }
    }

    return true;
}
