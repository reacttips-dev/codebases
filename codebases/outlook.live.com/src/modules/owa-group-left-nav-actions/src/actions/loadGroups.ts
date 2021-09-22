import updateUserGroupsSetConfiguration from './updateUserGroupsSetConfiguration';
import { DatapointStatus, PerformanceDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { leftNavGroupsStore } from 'owa-group-left-nav';
import { subscribeToGroupAssociationNotifications } from './groupAssociationNotificationStrategy';
import { subscribeToGroupsUnreadNotifications } from './groupsUnreadNotificationsStrategy';
import datapoints from '../logging/datapoints';
import { tryGetErrorFromBody } from 'owa-groups-services/lib/responseHandler';
import addOrUpdateGroup from 'owa-groups-shared-store/lib/utils/addOrUpdateGroup';
import type RequestedUnifiedGroupsSet from 'owa-service/lib/contract/RequestedUnifiedGroupsSet';
import UnifiedGroupAdditionalPropertyType from 'owa-service/lib/contract/UnifiedGroupAdditionalPropertyType';
import type UnifiedGroup from 'owa-service/lib/contract/UnifiedGroup';
import UnifiedGroupsFilterType from 'owa-service/lib/contract/UnifiedGroupsFilterType';
import type UnifiedGroupsSet from 'owa-service/lib/contract/UnifiedGroupsSet';
import UnifiedGroupsSortType from 'owa-service/lib/contract/UnifiedGroupsSortType';
import getUserUnifiedGroupsRequest from 'owa-service/lib/factory/getUserUnifiedGroupsRequest';
import getUserUnifiedGroupsOperation from 'owa-service/lib/operation/getUserUnifiedGroupsOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';
import { mutatorAction } from 'satcheljs';
import { getGroupsStore } from 'owa-groups-shared-store';
import { warmUpFrequentlyUsedGroups } from 'owa-group-prefetch-actions';
import getGroupSets from 'owa-session-store/lib/utils/getGroupSets';
import type RecursiveReadOnly from 'owa-service/lib/RecursiveReadOnly';

let loadGroupsInProgress = false;

function createGetUserUnifiedGroupsRequestBody() {
    const requestedUnifiedGroupsSets: RequestedUnifiedGroupsSet[] = new Array();

    if (isFeatureEnabled('tri-favorites-roaming')) {
        requestedUnifiedGroupsSets.push({
            FilterType: UnifiedGroupsFilterType.All,
            SortType: UnifiedGroupsSortType.Relevance,
            SortDirection: 'Descending',
        });
    } else {
        requestedUnifiedGroupsSets.push({
            FilterType: UnifiedGroupsFilterType.Favorites,
            SortType: UnifiedGroupsSortType.Relevance,
            SortDirection: 'Descending',
        });

        requestedUnifiedGroupsSets.push({
            FilterType: UnifiedGroupsFilterType.ExcludeFavorites,
            SortType: UnifiedGroupsSortType.Relevance,
            SortDirection: 'Descending',
        });
    }
    const additionalProperties: UnifiedGroupAdditionalPropertyType[] = [
        UnifiedGroupAdditionalPropertyType.IsOwner,
    ];
    return getUserUnifiedGroupsRequest({
        RequestedGroupsSets: requestedUnifiedGroupsSets,
        AdditionalProperties: additionalProperties,
    });
}

/**
 * Load groups by sending out GetUserUnifiedGroups service request
 * @param groupsStore the groups store to load the data to
 * Note that currently we have not implemented the scenario to call this function yet.
 */
export async function loadGroups(warmUpFrequentlyUsed?: boolean): Promise<void> {
    if (loadGroupsInProgress) {
        return;
    }

    const datapoint = new PerformanceDatapoint('loadGroups');
    loadGroupsInProgress = true;
    const requestBody = createGetUserUnifiedGroupsRequestBody();

    const getUserUnifiedGroupsResponse = await getUserUnifiedGroupsOperation({
        Header: getJsonRequestHeader(),
        Body: requestBody,
    });

    if (getUserUnifiedGroupsResponse.Body.ResponseClass == 'Success') {
        datapoint.end();
        setLoadGroupsError(false);
        const unifiedGroupSets = getUserUnifiedGroupsResponse.Body.GroupsSets;
        onLoadGroupsSuccessCommon(unifiedGroupSets);
        updateUserGroupsSetConfiguration(unifiedGroupSets);

        // Note Warm Up must happen after processUnifiedGroupSets was done.
        if (warmUpFrequentlyUsed) {
            warmUpFrequentlyUsedGroups();
        }
    } else {
        const errorString =
            'There was an error loading groups: ' +
            tryGetErrorFromBody(getUserUnifiedGroupsResponse);
        datapoint.addCustomData({ error: errorString });
        datapoint.endWithError(DatapointStatus.ServerError, new Error(errorString));
        setLoadGroupsError(true);
    }

    loadGroupsInProgress = false;
}

const setLoadGroupsError = mutatorAction('setLoadGroupsError', (hasError: boolean) => {
    leftNavGroupsStore.loadGroupsError = hasError;
    if (!hasError) {
        leftNavGroupsStore.hasLoadedFromServer = true;
    }
});

/**
 * Load the groups from session data on initializing OWA
 * @param groupsStore the groups store to load the data to
 */
export let loadGroupsFromSessionData = wrapFunctionForDatapoint(
    datapoints.LoadGroupsInLeftNavFromSessionData,
    function () {
        if (loadGroupsInProgress) {
            return;
        }

        loadGroupsInProgress = true;
        const sessionDataGroupSets = getGroupSets();
        if (!sessionDataGroupSets) {
            trace.info('GroupsSets data is not available in session data');
            loadGroupsInProgress = false;
            return;
        }

        onLoadGroupsSuccessCommon(sessionDataGroupSets.UnifiedGroupsSets);
        loadGroupsInProgress = false;
    }
);

function onLoadGroupsSuccessCommon(
    unifiedGroupSets: readonly RecursiveReadOnly<UnifiedGroupsSet>[]
): void {
    if (unifiedGroupSets) {
        const myOrgGroups: string[] = [];
        const groupsStore = getGroupsStore();
        unifiedGroupSets.forEach((groupSet: UnifiedGroupsSet) => {
            groupSet.Groups.forEach((group: UnifiedGroup) => {
                myOrgGroups.push(group.SmtpAddress.toLowerCase());

                addOrUpdateGroup(groupsStore, group.SmtpAddress, {
                    basicInformation: group,
                    groupDetails: null,
                    members: null,
                });
            });
        });
        setMyOrgGroups(myOrgGroups);
    }
    subscribeToGroupsUnreadNotifications();
    subscribeToGroupAssociationNotifications();
}

const setMyOrgGroups = mutatorAction('setMyOrgGroups', (orgGroups: string[]) => {
    leftNavGroupsStore.myOrgGroups = orgGroups;
});
