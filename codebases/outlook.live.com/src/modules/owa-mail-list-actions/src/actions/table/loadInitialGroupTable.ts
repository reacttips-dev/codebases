import { getGroupIdFromTableQuery } from 'owa-group-utils';
import groupHeaderCommandBarStore from 'owa-group-header-store/lib/store/CommandBarStore';
import GroupHeaderNavigationButton from 'owa-group-header-store/lib/store/schema/NavigationButton';
import { getGroupsWarmUpTime, wasGroupWarmedUp } from 'owa-group-prefetch-store';
import loadInitialMailTable from './loadInitialMailTable';
import type { TableView } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import { returnTopExecutingActionDatapoint, PerformanceDatapoint } from 'owa-analytics';
import {
    switchGroupDatapointName,
    navigateFromMeToWeDatapointName,
} from 'owa-group-common/lib/constants';

/**
 * Performs the first load for a group table
 * @param tableView - the given mail tableView
 * @param onInitialTableLoadComplete - callback for when the initial table load has completed
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves when the load initial table has completed either from server or from cache
 */
export default function loadInitialGroupTable(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    actionSource: ActionSource
): Promise<void> {
    // Update SwitchGroup or NavigateFromMeToWe datapoint with
    // information about which group module we are booting into
    const datapoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return (
            dp.eventName == navigateFromMeToWeDatapointName ||
            dp.eventName == switchGroupDatapointName
        );
    });

    const groupModule = groupHeaderCommandBarStore.navigationButtonSelected;
    if (datapoint) {
        datapoint.addCustomProperty('GroupModule', GroupHeaderNavigationButton[groupModule]);

        const groupId = getGroupIdFromTableQuery(tableView.tableQuery);
        if (wasGroupWarmedUp(groupId)) {
            const groupsWarmUpTime = getGroupsWarmUpTime();
            datapoint.addCustomProperty('TimeSinceWarmUp', Date.now() - groupsWarmUpTime);
        }
    }

    // If we are booting into a non-email module, do nothing
    let promiseToReturn = Promise.resolve();

    if (groupModule === GroupHeaderNavigationButton.Email) {
        promiseToReturn = loadInitialMailTable(tableView, onInitialTableLoadComplete, actionSource);
    }

    return promiseToReturn;
}
