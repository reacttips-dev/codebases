import type { CalendarEntry, LocalCacheForRemoteCalendarEntry } from 'owa-graph-schema';
import { MailboxInfo, MailboxType, getUserMailboxInfo } from 'owa-client-ids';
import {
    getCalendarIndex,
    addToCalendarsCache,
    getCalculatedFolderIdByCalendarID,
    getCalendarEntryByCalendarId,
    getCalendarGroups,
    getCalendarIdByFolderId,
    getFolderIdByCalendarID,
    isTeamsCalendarEntry,
    joinFolderIdAndChannelId,
    markCalendarEntryAsValid,
    removeCalendarWithIDFromCalendarsCache,
} from 'owa-calendar-cache';
import { extractTrueProperty } from 'owa-calendar-properties';

import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import { calendarFolderIdUpdated } from '../actions/publicActions';
import folderId from 'owa-service/lib/factory/folderId';
import {
    getCalendarFolderConfigurationService,
    SharedCalendarAdditionalInfoResult,
} from '../services/getCalendarFolderConfigurationService';
import { getUserConfiguration } from 'owa-session-store';
import { logUsage } from 'owa-analytics';
import { setCalendarLoadState } from '../actions/internalActions';
import { mutatorAction } from 'satcheljs';
import type FolderId from 'owa-service/lib/contract/FolderId';

/**
 * Fetches the actual calendar folder id for a calendar and updates the the calendar
 * cache with the actual calendar folder id.
 *
 * **Why is this needed?**
 * When we fetch calendars and put them in the cache via initializeCalendarCache,
 * some of calendars (particularly all the old-model shared calendars, including the group calendars) have invalid folder ids. These should be updated as needed by consumers of the cache with this function.
 *
 * **When is this needed?**
 * The calendar folder id needs to be updated when we want to fetch events for a calendar or look up a calendar
 * by the calendar folder property associated with an event.
 *
 * **Why isn't this taken care of during initialization?**
 * Because extra requests/ processing are needed to obtain an updated calendar folder id, so we do not want to do this
 * extra work until the data is needed by a consumer of the cache. This is why it is up to the consumer of the
 * cache update the calendar folder id as needed.
 *
 * @param calendarId the calendar id which needs its calendar folder id updated
 */
export async function getAndUpdateActualFolderId(calendarId: string) {
    setCalendarLoadState(calendarId, 'Loading');
    await getAndUpdateActualFolderIdInternal(calendarId);
}

export async function getAndUpdateActualFolderIdInternal(calendarId: string) {
    const calendarEntry: LocalCacheForRemoteCalendarEntry = getCalendarEntryByCalendarId(
        calendarId
    ) as LocalCacheForRemoteCalendarEntry;
    if (!calendarEntry) {
        throw new Error(`Unable to get calendar entry for calendar ${calendarId}`);
    }

    const calendarFolderId = getFolderIdByCalendarID(calendarId);
    const calculatedFolderId = getCalculatedFolderIdByCalendarID(calendarId);
    const fullCalendarId = getCalendarIdByFolderId(calendarFolderId);
    const mailboxInfo = fullCalendarId ? fullCalendarId.mailboxInfo : getUserMailboxInfo();
    const isTeamsType = isTeamsCalendarEntry(calendarEntry);

    let email;
    let getCalendarFolderConfigResponse;
    let userIdentity;

    let parentGroup = getCalendarGroups().filter(
        group => group.serverGroupId == calendarEntry.ParentGroupId
    );

    if (parentGroup) {
        userIdentity = parentGroup[0].calendarGroupId.mailboxInfo.userIdentity;
    } else {
        userIdentity = getUserMailboxInfo().userIdentity;
    }

    if (
        calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.PublicCalendarFolder &&
        getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox
    ) {
        email = getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox;
    } else {
        const ownerEmailAddress = getEmailAddress(calendarEntry.OwnerEmailAddress, mailboxInfo);
        email = isTeamsType ? extractTrueProperty(ownerEmailAddress) : ownerEmailAddress;
    }

    try {
        getCalendarFolderConfigResponse = await getCalendarFolderConfigurationService(
            folderId({
                Id: calculatedFolderId,
            }),
            email,
            userIdentity
        );
    } catch (error) {
        // There are cases wherein GetCalendarFolderConfigurationService seems to return 200's with mailboxNotFound messages
        // and in certain scenarios 500s with a redirect. In certain hybrid topologies, when online mailboxes are trying to access
        // a shared calendar from on-prem, a 500 is returned and a 200 with error code 31 on other lookup failures.
        // Either ways, the current behavior is to fall back to making a call to GetUserAvailability and fetch f/b data for this calendar.
        logUsage('getCalendarFolderConfigurationServiceFailed');
        markCalendarEntryAsValid(calendarEntry);
        return;
    }

    if (getCalendarFolderConfigResponse) {
        // We need to mark CalendarEntry as valid even when we don't have a FolderId to support previous
        // calendar sharing model that uses LinkedCalendarEntries. We won't have a FolderId in scenarios
        // where the user doesn't have permissions on the calendar and can only get FreeBusy information
        markCalendarEntryAsValid(calendarEntry);
        if (calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.PublicCalendarFolder) {
            addPublicFolderCalendarsToStore(getCalendarFolderConfigResponse, calendarEntry);
        } else {
            updateStoreWithActualFolderId(
                getCalendarFolderConfigResponse,
                calendarEntry,
                mailboxInfo,
                calendarId,
                isTeamsType
            );
        }
        calendarFolderIdUpdated();
    }
}

function addPublicFolderCalendarsToStore(
    response: SharedCalendarAdditionalInfoResult,
    calendarEntry: LocalCacheForRemoteCalendarEntry
) {
    const calendarFolder = response.calendarFolder;
    if (calendarFolder) {
        if (!calendarEntry.FolderId) {
            setCalendarEntryFolderId(calendarEntry, calendarFolder.folderId);
        }
        const PFmailboxId = calendarFolder.replicaList[0];
        const updatedCalendarEntry: CalendarEntry = {
            ...calendarEntry,
            calendarId: {
                id: calendarEntry.calendarId.id,
                changeKey: calendarEntry.calendarId.changeKey,
                mailboxInfo: getUpdatedMailboxInfo(PFmailboxId),
            },
            // Update all the props from the calendarFolder obtained
            DistinguishedFolderId:
                calendarFolder.distinguishedFolderId ?? calendarEntry.DistinguishedFolderId,
            EffectiveRights: calendarFolder.effectiveRights ?? calendarEntry.EffectiveRights,
            CharmId: calendarFolder.charmId ?? calendarEntry.CharmId,
        };
        addToCalendarsCache(updatedCalendarEntry);
    }
}

const setCalendarEntryFolderId = mutatorAction(
    'setCalendarEntryFolderId',
    (calendarEntry: LocalCacheForRemoteCalendarEntry, folderId: FolderId) => {
        calendarEntry.FolderId = folderId;
    }
);

function updateStoreWithActualFolderId(
    response: SharedCalendarAdditionalInfoResult,
    calendarEntry: LocalCacheForRemoteCalendarEntry,
    mailboxInfo: MailboxInfo,
    calendarId: string,
    isTeamsType?: boolean
) {
    const calendarFolder = response.calendarFolder;

    if (calendarFolder) {
        /* In order to accomodate multiple channels from the same TEAM, we tweak the CalendarFolderId in our client side cache.
        Issue: Multiple channels from the same TEAM can spawn from the same Group Mailbox, meaning they will have the same folder Id.
        With this constraint, we would still have to support showcasing two channels from the same TEAM

        Solution: For this to work with our existing client cache model, we are customizing the folder Id for a channel in the following manner:
        Each channel id's FolderId will be saved like: FolderId + CHANNEL_CALENDAR_APPEND_STRING + Channel Id.

        -- Everytime we need to make a call to the server using this custom folder Id, we will remove the customization and send
        -- Everytime the server comes back and updates the parent FolderId, we will add the customization.
        */
        if (isTeamsType && calendarFolder?.folderId?.Id) {
            calendarFolder.folderId.Id = joinFolderIdAndChannelId(
                calendarFolder.folderId.Id,
                calendarId
            );
        }

        if (calendarFolder?.effectiveRights?.Read) {
            if (calendarFolder.remoteCategories) {
                calendarEntry.RemoteCategories = calendarFolder.remoteCategories;
            }

            if (
                calendarId == calendarEntry.OwnerEmailAddress ||
                (calendarEntry.calendarId && calendarId == calendarEntry.calendarId.id)
            ) {
                const calendarIndex = getCalendarIndex(calendarId);
                removeCalendarWithIDFromCalendarsCache(
                    calendarId,
                    true /*shouldPersistCalendarEntry*/
                );

                // Update the existing calendarEntry with all the properties obtained from the received calendarFolder
                const updatedCalendarEntry: CalendarEntry = {
                    ...calendarEntry,
                    // Update all the props from the calendarFolder obtained
                    DistinguishedFolderId:
                        calendarFolder.distinguishedFolderId ?? calendarEntry.DistinguishedFolderId,
                    EffectiveRights:
                        calendarFolder.effectiveRights ?? calendarEntry.EffectiveRights,
                    FolderId: calendarFolder.folderId ?? calendarEntry.FolderId,
                    CharmId: calendarFolder.charmId ?? calendarEntry.CharmId,
                    DefaultOnlineMeetingProvider:
                        calendarFolder.defaultOnlineMeetingProvider ??
                        calendarEntry.DefaultOnlineMeetingProvider,
                    AllowedOnlineMeetingProviders:
                        calendarFolder.allowedOnlineMeetingProviders ??
                        calendarEntry.AllowedOnlineMeetingProviders,
                };

                // now we add the actual calendarFolder to the cache
                addToCalendarsCache(updatedCalendarEntry, calendarIndex);
            }
        }
    }
}

function getEmailAddress(ownerEmailAddress: string, mailboxInfo: MailboxInfo) {
    if (ownerEmailAddress) {
        return ownerEmailAddress;
    } else if (mailboxInfo) {
        return mailboxInfo.userIdentity;
    } else {
        return null;
    }
}

function getUpdatedMailboxInfo(emailAddress: string) {
    return {
        type: 'PublicMailbox' as MailboxType,
        userIdentity: getUserMailboxInfo().userIdentity,
        mailboxSmtpAddress: emailAddress,
    };
}
