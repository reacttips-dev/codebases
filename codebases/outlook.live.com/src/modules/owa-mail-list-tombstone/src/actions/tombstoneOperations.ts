import { default as TombstoneReasonType } from '../store/schema/TombstoneReasonType';
import { getStore } from '../store/Store';
import { logVerboseUsage } from 'owa-analytics';
import { MailFolderTableQuery, TableQueryType, TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs/lib/legacy';

/**
 * TombstoneOperations is a suppression map.
 * We add to the tombstone list after doing a client operation and we want
 * to suppress ( or do special processing on) server notifications for this row until
 * we get correct notification which indicates the completion of the operation server-side
 */

/**
 * Add each instanceKeys in the given list to the tombstone map
 * @param instanceKeys - the instanceKeys to be added to the tombstones map
 * @param tableView - tableView these instanceKeys belong to
 * @param tombstoneReasonType - the reason for which the row is being tombstoned
 */
export let add = action('tombstoneOperations.add')(function add(
    instanceKeys: string[],
    tableView: TableView,
    tombstoneReasonType: TombstoneReasonType
) {
    // Tombstone is not supported in search or "Important" filter (i.e. Spotlight).
    if (
        tableView.tableQuery.type == TableQueryType.Search ||
        (tableView.tableQuery as MailFolderTableQuery).scenarioType === 'spotlight'
    ) {
        return;
    }

    const folderId = tableView.serverFolderId;

    // Create the tombstone map for the folder if it doesn't exist
    const folderTombstoneMap = getStore().folderTombstoneMap;
    if (!(folderId in folderTombstoneMap)) {
        folderTombstoneMap[folderId] = {};
    }

    // Add to tombstone list
    const rowsTombstoneMap = folderTombstoneMap[folderId];
    instanceKeys.forEach(instanceKey => {
        /**
         *  Add tombstone reason if no entry exists for this instanceKey
         */
        let existingTombstonedReasons = rowsTombstoneMap[instanceKey];
        if (!existingTombstonedReasons) {
            rowsTombstoneMap[instanceKey] = [tombstoneReasonType];
            return;
        }

        /**
         * Override the entry if its "RowRemove" type reason
         * If a row is removed and pending delete, no row modified operation should bring it back.
         */
        if (tombstoneReasonType == TombstoneReasonType.RowRemove) {
            rowsTombstoneMap[instanceKey] = [TombstoneReasonType.RowRemove];
            return;
        }

        /**
         * Do not add the entry to the list if
         * there exists a RowRemove reason type entry for this row as it supercedes all other reasons
         */
        if (existingTombstonedReasons.indexOf(TombstoneReasonType.RowRemove) > -1) {
            return;
        }

        /**
         * Add the tombstone reason to the list if
         * it does not exist in the list
         */
        if (existingTombstonedReasons.indexOf(tombstoneReasonType) == -1) {
            existingTombstonedReasons.push(tombstoneReasonType);
        }
    });
});

/**
 * Remove given reason for given instanceKey from the tombstones map if it exists
 * @param instanceKey - the instanceKey to remove
 * @param folderId for these instanceKeys
 * @param tombstoneReason reason to remove from the tombstone map
 */
export let remove = action('tombstoneOperations.remove')(function remove(
    instanceKey: string,
    folderId: string,
    tombstoneReason: TombstoneReasonType
) {
    /**
     * Tombstone list doesn't exist for this folder.
     * User may have never performed scenarios that are supported by tombstone in this folder
     */
    const folderTombstoneMap = getStore().folderTombstoneMap;
    if (!(folderId in folderTombstoneMap)) {
        return;
    }

    const rowTombstoneMap = folderTombstoneMap[folderId];
    const tombstoneReasonsForRow = rowTombstoneMap[instanceKey];
    const indexOfTombstoneReasonToRemove = tombstoneReasonsForRow
        ? tombstoneReasonsForRow.indexOf(tombstoneReason)
        : -1;
    if (indexOfTombstoneReasonToRemove == -1) {
        throw new Error(
            'tombstone.remove given reason does not exist when trying to remove entry from it'
        );
    }

    tombstoneReasonsForRow.splice(indexOfTombstoneReasonToRemove, 1);

    /**
     * Delete row's entry if there are no more reasons are tombstoned for it
     */
    if (tombstoneReasonsForRow.length == 0) {
        delete rowTombstoneMap[instanceKey];
    }

    /**
     * Delete folder's entry if there are no more rows tombstoned in it
     */
    if (Object.keys(rowTombstoneMap).length == 0) {
        delete folderTombstoneMap[folderId];
    }
});

/**
 * Removes all instanceKeys from the tombstone map
 */
export let removeAll = action('tombstoneOperations.removeAll')(function removeAll() {
    // Remove all by re-initializing entire folderTombstoneMap
    getStore().folderTombstoneMap = {};
    logVerboseUsage('TnS_RemoveAllFromTombstone');
});

export let getCount = function getCount(
    folderId: string,
    tombstoneReasonType: TombstoneReasonType
): number {
    const folderTombstoneMap = getStore().folderTombstoneMap;
    if (!(folderId in folderTombstoneMap)) {
        return 0;
    }

    let count = 0;
    const tombstoneMap = folderTombstoneMap[folderId];
    Object.values(tombstoneMap).forEach(triageOperation => {
        if (triageOperation == tombstoneReasonType) {
            count++;
        }
    });

    return count;
};

/**
 * Returns tombstoned reasons for this row
 * @param instanceKey - the instanceKey to check
 * @param folderId for the instanceKey
 * @returns the array of TombstoneReasonType if it exists, undefined otherwise
 */
export let getTombstonedReasons = function getTombstonedReasons(
    instanceKey: string,
    folderId: string
): TombstoneReasonType[] {
    const folderTombstoneMap = getStore().folderTombstoneMap;

    if (folderId in folderTombstoneMap) {
        const rowTombstoneMap = folderTombstoneMap[folderId];
        const tombstoneReasonsForRow = rowTombstoneMap[instanceKey];
        if (tombstoneReasonsForRow) {
            return tombstoneReasonsForRow;
        }
    }

    /**
     * This row may not have been tombstoned
     */
    return [];
};

/**
 * Clear all instanceKeys for the given folderId from tombstone map
 * @param folderId for these instanceKeys
 */
export let clearMapForFolder = action('tombstoneOperations.clearMapForFolder')(
    function clearMapForFolder(folderId: string) {
        // Delete the map for the folder
        const folderTombstoneMap = getStore().folderTombstoneMap;

        if (folderTombstoneMap[folderId]) {
            logVerboseUsage('TnS_ClearFolderMapInTombstone', [
                Object.keys(folderTombstoneMap[folderId]).length,
            ]);
            delete folderTombstoneMap[folderId];
        }
    }
);

/**
 * Remove rows from tombstone
 * @param instanceKeys InstanceKeys for the rows to be removed from tombstone
 * @param folderId folder to which the rows belong
 */
export let removeRowsFromTombstone = action('tombstoneOperations.removeRowsFromTombstone')(
    function (instanceKeys: string[], folderId: string) {
        // Tombstone list doesn't exist for this folder.
        // User may have never performed triage operations supported by tombstone in this folder
        const folderTombstoneMap = getStore().folderTombstoneMap;
        if (!(folderId in folderTombstoneMap)) {
            return;
        }
        const rowTombstoneMap = folderTombstoneMap[folderId];
        for (const instanceKey of instanceKeys) {
            if (instanceKey in rowTombstoneMap) {
                delete rowTombstoneMap[instanceKey];
            }
        }

        /**
         * Delete folder's entry if there are no more rows tombstoned in it
         */
        if (Object.keys(rowTombstoneMap).length == 0) {
            delete folderTombstoneMap[folderId];
        }
    }
);
