import {
    DatapointVariant,
    PerformanceDatapoint,
    returnTopExecutingActionDatapoint,
    logUsage,
    DatapointStatus,
} from 'owa-analytics';
import { lazyLoadDumpster } from '../lazyFunctions';
import onAfterSelectingNode from './helpers/onAfterSelectingNode';
import selectNodeInFolderForest from './selectNodeInFolderForest';
import { FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType } from 'owa-graph-schema';
import folderStore, { isFolderUnderMsg } from 'owa-folders';
import getFolderData from 'owa-mail-actions/lib/getFolderData';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import {
    folderForestStore,
    getSelectedNode,
    getFolderIdForSelectedNode,
} from 'owa-mail-folder-forest-store';
import { addFrequentlyUsedFolder } from 'owa-mail-frequently-used-folders';
import { initTableSelectionOnLoad } from 'owa-mail-actions/lib/initTableSelectionOnLoad';
import {
    getSelectedTableView,
    getViewFilterForTable,
    TableQueryType,
    getListViewTypeString,
    MailFolderTableQuery,
    clearListViewVirtualization,
} from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import { ActionSource, lazySetTriageActionAnnouncement } from 'owa-mail-store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { addDatapointConfig } from 'owa-analytics-actions';
import {
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import { action, orchestrator, mutator } from 'satcheljs';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { shouldShowReadingPane } from 'owa-mail-layout/lib/selectors/shouldShowReadingPane';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import loc from 'owa-localize';
import { resetFolderToInbox } from './selectFolder.locstring.json';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import deleteFolderStoreUpdate from 'owa-mail-actions/lib/triage/deleteFolderStoreUpdate';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

let lastSwitchMailFolderDp: PerformanceDatapoint;

/**
 * General select a folder
 * @param folderId the folderId
 * @param treeType that the folder belongs to, i.e MailFolder or Favorites
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves when the select folder has completed
 */
function selectFolderInternal(
    folderId: string,
    treeType: FolderForestTreeType,
    actionSource: ActionSource,
    folderNodeType?: FolderForestNodeType,
    sessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    let distinguishedFolderId: string;

    // This is for the router code path, e.g we show /inbox instead of the real folder name in the url
    // if it's a distinguished folder
    if (folderId) {
        // The folderId is the name of a DistinguishedFolder. Grab the correct id.
        distinguishedFolderId = folderNameToId(folderId);
    }

    const folderIdToSelect = distinguishedFolderId || folderId;
    const switchFolderPromise = selectNodeInFolderForest(
        {
            id: folderIdToSelect,
            type: folderNodeType != null ? folderNodeType : FolderForestNodeType.Folder,
            treeType,
        },
        actionSource,
        sessionData,
        apolloClientPromise
    );

    return switchFolderPromise;
}

/**
 * Select a folder
 * @param folderId the folderId
 * @param treeType that the folder belongs to, i.e MailFolder or Favorites
 * @param actionSource action that initiated the switch folder action
 * @param state selected folder state
 */
const selectFolder = action(
    'selectFolder',
    (
        folderId: string,
        treeType: FolderForestTreeType,
        actionSource: ActionSource,
        folderNodeType?: FolderForestNodeType,
        sessionData?: SessionData,
        apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
    ) => {
        const previousFolderId = getSelectedNode().id;

        return addDatapointConfig(
            {
                name: 'SwitchMailFolder',
                options: {
                    variant: DatapointVariant.ColdOnly, // Log all the instances after the first instance in every session
                },
                customData: [
                    folderIdToName(folderId),
                    previousFolderId ? folderIdToName(previousFolderId) : '', // previousFolderId can be null when there is no folder selected before switching folder (for example, exiting search)
                    treeType,
                    actionSource,
                    getListViewTypeString(getListViewTypeForFolder(folderId)),
                ],
            },
            {
                folderId,
                treeType,
                previousFolderId,
                actionSource,
                folderNodeType,
                isNewFolderSameAsPreviousFolder: folderId == previousFolderId,
                sessionData,
                apolloClientPromise,
            }
        );
    }
);
export default selectFolder;

// Select Inbox if folder being deleted is the selected folder
orchestrator(deleteFolderStoreUpdate, actionMessage => {
    const { folderIds } = actionMessage;
    for (let i = 0; i < folderIds.length; i++) {
        const folderId = folderIds[i];
        if (folderId == getFolderIdForSelectedNode()) {
            selectFolder(
                folderNameToId('inbox'),
                'primaryFolderTree' /* treeType */,
                'ResetInbox' /* ActionSource */
            );

            break;
        }
    }
});

orchestrator(selectFolder, actionMessage => {
    const {
        folderId,
        treeType,
        previousFolderId,
        actionSource,
        folderNodeType,
        isNewFolderSameAsPreviousFolder,
        sessionData,
        apolloClientPromise,
    } = actionMessage;

    // If there is an ongoing switch mail folder datapoint, log the abandonment and end current as background success
    if (lastSwitchMailFolderDp && !lastSwitchMailFolderDp?.hasEnded) {
        // end SwitchMailFolder datapoint from the previous selection
        lastSwitchMailFolderDp.end(undefined /*duration*/, DatapointStatus.BackgroundSuccess);

        // Log abandonment is elapsed time was greater than half a second
        if (lastSwitchMailFolderDp?.properties?.E2ETimeElapsed > 500) {
            logUsage(
                'SwitchMailFolderAbandoned',
                [
                    lastSwitchMailFolderDp?.properties?.E2ETimeElapsed,
                    lastSwitchMailFolderDp?.propertyBag?.owa_1, // Folder name
                    lastSwitchMailFolderDp?.propertyBag?.owa_3, // Tree type
                    lastSwitchMailFolderDp?.propertyBag?.owa_4, // Action source
                    lastSwitchMailFolderDp?.propertyBag?.isCached, // isCached
                ],
                { sessionSampleRate: 10 }
            );
        }
    }

    // Cache the current switch mail folder datapoint
    lastSwitchMailFolderDp = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
        return dp.eventName == 'SwitchMailFolder';
    });

    const isInImmersiveView = isImmersiveReadingPaneShown();

    let folder = folderStore.folderTable.get(folderId);
    if (folderNodeType === FolderForestNodeType.PublicFolder) {
        folder = publicFolderFavoriteStore.folderTable.get(folderId);
    }

    let selectFolderPromise: Promise<void> = Promise.resolve();
    const tableView = getSelectedTableView();
    const isExitingSearch = tableView && tableView.tableQuery.type == TableQueryType.Search;
    if (isNewFolderSameAsPreviousFolder) {
        if (tableView) {
            if (!(isReadingPanePositionOff() && shouldShowReadingPane())) {
                // Initialize table selection
                initTableSelectionOnLoad(tableView);
            }
        }
    }

    // Do not clear virtualization logic if in immersive view, since we do not scroll to top of list view
    if (!isInImmersiveView) {
        clearListViewVirtualization(true /* isNewTableLoad */);
    }

    // On a page reload, the tableView is undefined initially. So, we need this check
    const viewFilter = tableView && getViewFilterForTable(tableView);

    /**
     * We need to reload the folder if the folder being selected is different
     * than the currently selected folder OR if a filter has been applied to the
     * folder.
     */
    if (
        !isNewFolderSameAsPreviousFolder ||
        (viewFilter && viewFilter !== 'All') ||
        (tableView?.tableQuery as MailFolderTableQuery)?.scenarioType == 'spotlight'
    ) {
        selectFolderPromise = selectFolderInternal(
            folderId,
            treeType,
            actionSource,
            folderNodeType,
            sessionData,
            apolloClientPromise
        );
        const folderName = folderIdToName(folderId);

        // refresh single folder count and get folder permissions
        getFolderData(folderId);

        // Do not add folder to frequently used if it is inbox or dumspter or it is not in primary mailbox
        if (
            isFolderUnderMsg(folder) &&
            folderName !== 'inbox' &&
            folderName !== PRIMARY_DUMPSTER_DISTINGUISHED_ID
        ) {
            addFrequentlyUsedFolder(folderId);
        }

        if (folderName === PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID) {
            lazyLoadDumpster.importAndExecute(
                PRIMARY_DUMPSTER_DISTINGUISHED_ID,
                folder.mailboxInfo
            );
        } else if (folderName === ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID) {
            lazyLoadDumpster.importAndExecute(
                ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
                folder.mailboxInfo
            );
        }
    }

    // Reset focus based on priority list when we switch
    // to a new table or select the same folder
    lazyResetFocus.importAndExecute();

    // Called after selecting same/different folder
    // #15945 - We should try to merge SelectFolder, SelectPersona, SelectGroup logic and move this method into a common place
    onAfterSelectingNode(actionSource);

    // Announce that selection is being changed to the inbox if auto-selecting
    if (actionSource === 'ResetInbox') {
        lazySetTriageActionAnnouncement.importAndExecute(loc(resetFolderToInbox), 'assertive');
    }

    // Raise onSelectFolder complete action
    selectFolderPromise.then(() => {
        onSelectFolderComplete(
            folderId,
            previousFolderId,
            isExitingSearch,
            tableView?.id,
            MailListItemSelectionSource.Auto,
            isInImmersiveView,
            actionSource
        );
    });

    return selectFolderPromise;
});

mutator(selectFolder, actionMessage => {
    if (actionMessage.isNewFolderSameAsPreviousFolder) {
        // Do not perform the rest of selecting folder logic when
        // user navigates to the node with the same id
        folderForestStore.selectedNode.treeType = actionMessage.treeType;
    }
});
