import type MeetingMessageButtonEntrySource from '../store/schema/MeetingMessageButtonEntrySource';
import { getRSVPPeekStore } from '../store/store';

export default function shouldShowRSVPPeek(
    itemIdToShowRSVPPeek: string,
    entrySourceToShowRSVPPeek: MeetingMessageButtonEntrySource
): boolean {
    const { itemId, meetingRequestViewState, entrySource } = getRSVPPeekStore();
    // Repurposing meetingRequestViewState to indicate whether the dialog should be shown.
    return (
        itemId == itemIdToShowRSVPPeek &&
        entrySource == entrySourceToShowRSVPPeek &&
        !!meetingRequestViewState
    );
}
