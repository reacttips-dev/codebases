import { addDays, isWithinRange, startOfDay, today, userDate } from 'owa-datetime';
import { isGroupInFavorites } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { leftNavGroupsStore } from 'owa-group-left-nav';
import { MAX_GROUP_NODES_WHEN_COLLAPSED } from 'owa-group-left-nav/lib/utils/constants';
import { createGroupMailTableQuery, getListViewTypeForGroup } from 'owa-group-mail-list-actions';
import { setGroupsWarmUpTime, setWarmedUpGroups } from 'owa-group-prefetch-store';
import { getGroupsStore } from 'owa-groups-shared-store';
import type GroupsState from 'owa-groups-shared-store/lib/schema/GroupsState';
import { findItemWithStartIndex, getConversationRows, getItemRows } from 'owa-mail-find-rows';
import { getBaseFolderId, MailFolderTableQuery } from 'owa-mail-list-store';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import getMailItemSortByProperty from 'owa-mail-triage-table-utils/lib/getMailItemSortByProperty';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type UnifiedGroup from 'owa-service/lib/contract/UnifiedGroup';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { lazyLoadGroupFolders } from 'owa-group-folder-tree-actions';

const MAX_GROUPS_TO_WARM_UP = 5;
const GROUP_PREFETCH_DELAY_MS: number = 10000; // 10 seconds
const MAX_DAYS_SINCE_LAST_VISIT: number = 30; // Max days since last visit to be considered a groups user

// This needs to be in Sync with SyntheticActionSource in %SDXROOT%\sources\dev\services\src\Core\Search\NormalQueryView.cs
// so that these calls don't count for engagement
const SyntheticGroupActionSource = 'GroupModulePrefetch';
const ActionSourceHeaderName = 'X-OWA-ActionSource';

const GroupWarmUpActionName = 'GroupMailbox_WarmUp';
const ActionNameHeaderName = 'X-OWA-ActionName';

let wasGroupsWarmUpTriggered = false;

export function warmUpFrequentlyUsedGroups(): void {
    const groupsStore = getGroupsStore();
    if (!wasGroupsWarmUpTriggered) {
        wasGroupsWarmUpTriggered = true;

        setTimeout(() => {
            if (!isGroupsSpaceUser(groupsStore)) {
                return;
            }

            setGroupsWarmUpTime(Date.now());
            const groupsToWarmUp = getGroupsToWarmUp(groupsStore);
            groupsToWarmUp.forEach(groupId => {
                warmUpGroup(groupId).catch(error => {
                    // catch error so we don't bubble this up, which would result in alerting errors.
                    return;
                });

                // load folder hierarchy for group
                if (isFeatureEnabled('grp-loadFolders')) {
                    lazyLoadGroupFolders.importAndExecute(groupId.toLowerCase());
                }
            });

            setWarmedUpGroups(groupsToWarmUp);
        }, GROUP_PREFETCH_DELAY_MS);
    }
}

function isGroupsSpaceUser(groupsStore: GroupsState): boolean {
    for (let groupId of leftNavGroupsStore.myOrgGroups) {
        if (wasGroupVisitedInLastNDays(groupsStore, groupId, MAX_DAYS_SINCE_LAST_VISIT)) {
            return true;
        }
    }

    return false;
}

function wasGroupVisitedInLastNDays(
    groupsStore: GroupsState,
    groupId: string,
    daysSinceLastVisit: number
) {
    const group = groupsStore.groups.get(groupId.toLowerCase());
    if (!group || !group.basicInformation) {
        return false;
    }

    const basicGroupInfo = group.basicInformation as UnifiedGroup;
    if (!basicGroupInfo.LastVisitedTimeUtc) {
        return false;
    }

    const lastVisitedTime = userDate(basicGroupInfo.LastVisitedTimeUtc);
    const lastVisitedDate = startOfDay(lastVisitedTime);
    const today_date = today();
    return isWithinRange(lastVisitedDate, addDays(today_date, -daysSinceLastVisit), today_date);
}

function getGroupsToWarmUp(groupsStore: GroupsState) {
    // First try to select the groups to warm up among the favorite groups
    let groupsToWarmUp = leftNavGroupsStore.myOrgGroups
        .filter((groupId, index) => {
            return (
                isGroupInFavorites(groupId) &&
                wasGroupVisitedInLastNDays(groupsStore, groupId, MAX_DAYS_SINCE_LAST_VISIT)
            );
        })
        .slice(0, MAX_GROUPS_TO_WARM_UP);

    if (groupsToWarmUp.length < MAX_GROUPS_TO_WARM_UP) {
        // If we haven't reached number of groups we want to warm up, then Select Top groups in prankie order
        const nonFavoriteTopGroups = leftNavGroupsStore.myOrgGroups.filter((groupId, index) => {
            return (
                index < MAX_GROUP_NODES_WHEN_COLLAPSED &&
                !isGroupInFavorites(groupId) &&
                wasGroupVisitedInLastNDays(groupsStore, groupId, MAX_DAYS_SINCE_LAST_VISIT)
            );
        });

        groupsToWarmUp = groupsToWarmUp
            .concat(nonFavoriteTopGroups)
            .slice(0, MAX_GROUPS_TO_WARM_UP);
    }

    return groupsToWarmUp;
}

function warmUpGroup(groupId: string): Promise<unknown> {
    const listViewType = getListViewTypeForGroup();
    const groupTableQuery = createGroupMailTableQuery(groupId, listViewType);

    switch (listViewType) {
        case ReactListViewType.Conversation:
            return findGroupConversations(groupTableQuery);

        case ReactListViewType.Message:
            return findGroupItems(groupTableQuery);
    }

    return Promise.resolve();
}

function findGroupConversations(groupTableQuery: MailFolderTableQuery): Promise<unknown> {
    const headers = new Headers();
    headers.set(ActionSourceHeaderName, SyntheticGroupActionSource);
    headers.set(ActionNameHeaderName, GroupWarmUpActionName);
    return getConversationRows(
        'inbox', // distinguished folder id name
        1, // Number of Rows to load
        groupTableQuery.viewFilter,
        groupTableQuery.sortBy,
        false, // shouldTableSortByRenewTime
        groupTableQuery.focusedViewFilter,
        groupTableQuery.requestShapeName,
        getMailboxInfoFromTableQuery(groupTableQuery),
        undefined, // lastInstanceKey is null since we are starting at the top
        groupTableQuery.categoryName,
        undefined, //searchFolderId
        {
            headers: headers,
        } // requestOptions
    );
}

function findGroupItems(groupTableQuery: MailFolderTableQuery): Promise<unknown> {
    if (isFeatureEnabled('mon-messageList-useGqlForFindItem')) {
        return getItemRows(
            getBaseFolderId(groupTableQuery),
            1, // Number of Rows to load
            groupTableQuery.viewFilter,
            groupTableQuery.sortBy,
            false, // shouldTableSortByRenewTime
            groupTableQuery.focusedViewFilter,
            groupTableQuery.requestShapeName,
            getMailboxInfoFromTableQuery(groupTableQuery),
            undefined,
            getRequestOptionsForGroupWarmUp(groupTableQuery),
            groupTableQuery.categoryName
        );
    } else {
        return findItemWithStartIndex(
            getBaseFolderId(groupTableQuery),
            0, // startIndex
            1, // Number of Rows to load
            groupTableQuery.viewFilter,
            getMailItemSortByProperty(groupTableQuery),
            groupTableQuery.focusedViewFilter,
            groupTableQuery.requestShapeName,
            undefined,
            getRequestOptionsForGroupWarmUp(groupTableQuery),
            groupTableQuery.categoryName
        );
    }
}

function getRequestOptionsForGroupWarmUp(groupTableQuery: MailFolderTableQuery) {
    const options: RequestOptions =
        getMailboxRequestOptions(getMailboxInfoFromTableQuery(groupTableQuery)) || {};
    options.headers = new Headers();
    options.headers.set(ActionSourceHeaderName, SyntheticGroupActionSource);
    options.headers.set(ActionNameHeaderName, GroupWarmUpActionName);
    return options;
}
