import type * as Schema from 'owa-graph-schema';

import { bindTypename, bindTypenameInList } from 'bind-typenames';

import type CalendarEntry from 'owa-service/lib/contract/CalendarEntry';
import type CalendarFolder from 'owa-service/lib/contract/CalendarFolder';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import type CalendarGroup from 'owa-service/lib/contract/CalendarGroup';
import type GetCalendarFoldersResponse from 'owa-service/lib/contract/GetCalendarFoldersResponse';
import type LinkedCalendarEntry from 'owa-service/lib/contract/LinkedCalendarEntry';
import type LocalCacheForRemoteCalendarEntry from 'owa-service/lib/contract/LocalCacheForRemoteCalendarEntry';
import type LocalCalendarEntry from 'owa-service/lib/contract/LocalCalendarEntry';
import type { MailboxInfo } from 'owa-client-ids';

export const LOCALCALENDAR_ENTRY_TYPE = 'LocalCalendarEntry:#Exchange';
export const LINKEDCALENDAR_ENTRY_TYPE = 'LinkedCalendarEntry:#Exchange';
export const LOCALCACHEFORREMOTECALENDAR_ENTRY_TYPE = 'LocalCacheForRemoteCalendarEntry:#Exchange';

/**
 * Maps the OWS getCalendarFolders response to GQL response
 * @param calendarFoldersResponse getCalendarFolders service response
 * @param mailboxInfo mailboxInfo
 */
export function mapGetCalendarFoldersResponseToGql(
    calendarFoldersResponse: GetCalendarFoldersResponse,
    mailboxInfo: Schema.MailboxInfoInput
): Schema.CalendarGroup[] {
    if (calendarFoldersResponse.CalendarGroups) {
        return calendarFoldersResponse.CalendarGroups.map(group =>
            mapOWSCalendarGroupToGql(group, calendarFoldersResponse.CalendarFolders, mailboxInfo)
        );
    } else {
        return [];
    }
}

export function mapOWSCalendarEntryToGql(
    calendarEntry: CalendarEntry,
    calendarFolder: CalendarFolder | undefined,
    mailboxInfo: MailboxInfo
): Schema.CalendarsUnionType {
    const gqlCalendarEntry: Schema.CalendarEntry = {
        calendarId: {
            id: calendarEntry.ItemId!.Id,
            changeKey: calendarEntry.ItemId!.ChangeKey,
            mailboxInfo: mailboxInfo,
        },
        CalendarName:
            calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.DefaultCalendar &&
            calendarFolder
                ? calendarFolder!.DisplayName ?? ''
                : calendarEntry.CalendarName ?? '',
        CalendarFolderType: calendarEntry.CalendarFolderType,
        CanShare: calendarEntry.CanShare,
        HexColor: calendarEntry.HexColor,
        HexColorString: calendarEntry.HexColorString,
        IsTallyingResponses: calendarEntry.IsTallyingResponses,
        ParentGroupId: calendarEntry.ParentGroupId!,
        CanEnableChangeNotifications: calendarFolder?.CanEnableChangeNotifications,
        ChangeNotificationStatus: calendarFolder?.ChangeNotificationStatus,
        DistinguishedFolderId: calendarFolder?.DistinguishedFolderId,
        EffectiveRights: calendarFolder?.EffectiveRights
            ? bindTypename(calendarFolder!.EffectiveRights!, 'EffectiveRightsType')
            : undefined,
        FolderId: calendarFolder?.FolderId
            ? bindTypename(calendarFolder!.FolderId!, 'FolderId')
            : undefined,
        ProviderId: calendarFolder?.ProviderId,
        SourceId: calendarFolder?.SourceId,
        CalendarColor: calendarEntry.CalendarColor,
        IsGroupMailboxCalendar: calendarEntry.IsGroupMailboxCalendar,
        AgendaMailDisabled: calendarFolder?.AgendaMailDisabled,
        CharmId: calendarFolder?.CharmId,
        DisplayOrder: calendarEntry.DisplayOrder,
    };

    if (calendarEntry.__type == LOCALCALENDAR_ENTRY_TYPE) {
        const localCalendarEntry: LocalCalendarEntry = calendarEntry;
        return {
            ...gqlCalendarEntry,
            LocalCalendarFolderId: localCalendarEntry.CalendarFolderId
                ? bindTypename(localCalendarEntry.CalendarFolderId!, 'FolderId')
                : undefined,
            CanViewPrivateItems: localCalendarEntry.CanViewPrivateItems,
            FamilyPuid: localCalendarEntry.FamilyPuid,
            IsDefaultCalendar: localCalendarEntry.IsDefaultCalendar,
            IsInterestingCalendar: localCalendarEntry.IsInterestingCalendar,
            IsInternetCalendar: localCalendarEntry.IsInternetCalendar,
            IsReadOnly: localCalendarEntry.IsReadOnly,
            IsRemovable: localCalendarEntry.IsRemovable,
            IsShared: localCalendarEntry.IsShared,
            IsSharedWithMe: localCalendarEntry.IsSharedWithMe,
            OwnerSipUri: localCalendarEntry.OwnerSipUri,
            SharedOwnerEmailAddress: localCalendarEntry.SharedOwnerEmailAddress,
            SharedOwnerName: localCalendarEntry.SharedOwnerName,
            IsSchoolCalendar: localCalendarEntry.IsSchoolCalendar,
            DefaultOnlineMeetingProvider: localCalendarEntry.DefaultOnlineMeetingProvider,
            AllowedOnlineMeetingProviders: localCalendarEntry.AllowedOnlineMeetingProviders,
            __typename: 'LocalCalendarEntry',
        };
    }

    if (calendarEntry.__type == LINKEDCALENDAR_ENTRY_TYPE) {
        const linkedCalendarEntry: LinkedCalendarEntry = calendarEntry;
        return {
            ...gqlCalendarEntry,
            OwnerEmailAddress: linkedCalendarEntry.OwnerEmailAddress,
            OwnerName: linkedCalendarEntry.OwnerName,
            OwnerSipUri: linkedCalendarEntry.OwnerSipUri,
            IsGeneralScheduleCalendar: linkedCalendarEntry.IsGeneralScheduleCalendar,
            IsOwnerEmailAddressInvalid: linkedCalendarEntry.IsOwnerEmailAddressInvalid,
            SharedFolderId: linkedCalendarEntry.SharedFolderId
                ? bindTypename(linkedCalendarEntry.SharedFolderId!, 'FolderId')
                : undefined,
            DefaultOnlineMeetingProvider: calendarFolder?.DefaultOnlineMeetingProvider,
            AllowedOnlineMeetingProviders: calendarFolder?.AllowedOnlineMeetingProviders,
            __typename: 'LinkedCalendarEntry',
        };
    } else {
        const cacheCalendarEntry: LocalCacheForRemoteCalendarEntry = calendarEntry;
        return {
            ...gqlCalendarEntry,
            CanViewPrivateItems: cacheCalendarEntry.CanViewPrivateItems,
            LocalCalendarFolderId: cacheCalendarEntry.CalendarFolderId,
            OwnerEmailAddress: cacheCalendarEntry.OwnerEmailAddress,
            OwnerName: cacheCalendarEntry.OwnerName,
            IsDefaultCalendar: cacheCalendarEntry.IsDefaultCalendar,
            IsReadOnly: cacheCalendarEntry.IsReadOnly,
            IsSharedWithMe: cacheCalendarEntry.IsSharedWithMe,
            IsGeneralScheduleCalendar: cacheCalendarEntry.IsGeneralScheduleCalendar,
            IsOwnerEmailAddressInvalid: cacheCalendarEntry.IsOwnerEmailAddressInvalid,
            SharedFolderId: cacheCalendarEntry.SharedFolderId,
            RemoteCategories: cacheCalendarEntry.RemoteCategories
                ? bindTypename(
                      cacheCalendarEntry.RemoteCategories,
                      'MasterCategoryList',
                      remoteCategories => ({
                          ...remoteCategories,
                          MasterList: bindTypenameInList(remoteCategories.MasterList, 'Category'),
                      })
                  )
                : undefined,
            SharedOwnerMailboxGuid: cacheCalendarEntry.SharedOwnerMailboxGuid,
            DefaultOnlineMeetingProvider: cacheCalendarEntry.DefaultOnlineMeetingProvider,
            AllowedOnlineMeetingProviders: cacheCalendarEntry.AllowedOnlineMeetingProviders,
            __typename: 'LocalCacheForRemoteCalendarEntry',
        };
    }
}

export function mapOWSCalendarGroupToGql(
    calendarGroup: CalendarGroup,
    folders: CalendarFolder[] | undefined,
    mailboxInfo: MailboxInfo
): Schema.CalendarGroup {
    const groupCalendars = calendarGroup.Calendars?.map(cal => {
        const calcFolderId = getCalculatedFolderId(cal);
        const calFolder = calcFolderId
            ? folders?.filter(f => f.FolderId?.Id == calcFolderId)?.[0]
            : undefined;
        return mapOWSCalendarEntryToGql(cal, calFolder, mailboxInfo);
    });

    return {
        calendarGroupId: {
            id: calendarGroup.ItemId!.Id,
            changeKey: calendarGroup.ItemId!.ChangeKey,
            mailboxInfo: mailboxInfo,
        },
        serverGroupId: calendarGroup.GroupId!,
        GroupName: calendarGroup.GroupName!,
        GroupType: calendarGroup.GroupType,
        DisplayOrder: calendarGroup.DisplayOrder,
        Calendars: groupCalendars,
        __typename: 'CalendarGroup',
    };
}

function getCalculatedFolderId(
    calendar: CalendarEntry | LocalCalendarEntry
): string | null | undefined {
    if ((calendar as LocalCalendarEntry).CalendarFolderId !== undefined) {
        // local calendar entry
        return (calendar as LocalCalendarEntry).CalendarFolderId?.Id;
    }
    const linkedCalendarEntry: LinkedCalendarEntry = calendar;
    return linkedCalendarEntry.IsGeneralScheduleCalendar
        ? linkedCalendarEntry.OwnerEmailAddress
        : linkedCalendarEntry.SharedFolderId?.Id;
}
