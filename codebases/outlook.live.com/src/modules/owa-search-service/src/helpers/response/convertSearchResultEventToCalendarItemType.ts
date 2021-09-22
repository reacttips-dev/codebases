import type { SearchResultEvent } from '../../data/schema/SubstrateSearchResponse';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import type CalendarItemTypeType from 'owa-service/lib/contract/CalendarItemTypeType';
import {
    convertRecipientToSingleRecipientType,
    convertToFolderId,
    convertToItemId,
    convertSearchSortOrder,
} from './converterHelpers';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

const DEFAULT_ITEMCLASS: string = 'IPM.Appointment';

export default function convertSearchResultEventToCalendarItemType(
    searchResult: SearchResultEvent
): CalendarItem {
    const organizer = convertRecipientToSingleRecipientType(searchResult.Organizer);
    return {
        CalendarItemType: searchResult.CalendarItemType.toString() as CalendarItemTypeType,
        Categories: searchResult.Categories,
        CharmId: searchResult.Charm,
        DisplayTo: searchResult.DisplayTo,
        End: searchResult.End,
        Start: searchResult.Start,
        HasAttachments: searchResult.HasAttachments,
        IsAllDayEvent: searchResult.IsAllDayEvent,
        IsMeeting: searchResult.IsMeeting,
        IsMeetingPollEvent: searchResult.IsMeetingPollEvent,
        ItemClass: searchResult.ItemClass ? searchResult.ItemClass : DEFAULT_ITEMCLASS,
        FreeBusyType: searchResult.LegacyFreeBusyStatus
            ? searchResult.LegacyFreeBusyStatus.toString()
            : null,
        Location: { DisplayName: searchResult.Location },
        Sensitivity: searchResult.Sensitivity,
        SeriesId: searchResult.SeriesMasterItemId ? searchResult.SeriesMasterItemId.Id : null,
        Subject: searchResult.Subject,
        Organizer: organizer,
        UID: searchResult.UID,
        ItemId: convertToItemId(searchResult.ItemId),
        ParentFolderId: convertToFolderId(searchResult.ParentFolderId),
        SerializedImmutableId: searchResult.ImmutableId,
        SortOrderSource: convertSearchSortOrder(searchResult.SortOrderSource),
        Preview: searchResult.Preview,
        // sometimes 3S is wrong about whether you're the organizer, so also check organizer mailbox info
        IsOrganizer:
            searchResult.IsOrganizer &&
            getUserConfiguration().SessionSettings.UserEmailAddress ===
                organizer?.Mailbox?.EmailAddress,
        IsCancelled: searchResult.IsCancelled,
        ResponseType: searchResult.MyResponseType,
    };
}
