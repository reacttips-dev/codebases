import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import getFolderTable from '../selectors/getFolderTable';
import getFolderTreeLoadingState from '../selectors/getFolderTreeLoadingState';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { logUsage } from 'owa-analytics';
import { PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID } from 'owa-folders-constants';
import { setLoadingStateForFolderTree } from '../actions/setLoadingStateForFolderTree';
import { onFolderHierarchyResponse } from '../actions/onFolderHierarchyResponse';
import FolderTreeLoadStateEnum from '../store/schema/FolderTreeLoadStateEnum';
import { initializeFolderTreeData } from './initializeFolderTreeData';
import { lazyFetchPrimaryMailFolders } from '../lazyFetchPrimaryFolders';
import { isFeatureEnabled } from 'owa-feature-flags';
import { extractFolderHierarchy } from './extractFolderHierarchy';
import { getUserMailboxInfo } from 'owa-client-ids';
import type { SessionData } from 'owa-service/lib/types/SessionData';

/**
 * An orchestrator that gets the primary mail folders.
 */
export async function getPrimaryMailFolders(
    isLoadingMore?: boolean,
    userIdentity?: string,
    sessionData?: SessionData
) {
    const userMailboxInfo = getUserMailboxInfo(userIdentity);

    if (!userIdentity) {
        userIdentity = userMailboxInfo.userIdentity;
    }

    initializeFolderTreeData(userIdentity);
    const loadingState = getFolderTreeLoadingState(
        PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
        userIdentity
    );

    // if loading is in progress or it is loaded and we are not loading more, just return
    if (
        loadingState == FolderTreeLoadStateEnum.Loading ||
        (loadingState == FolderTreeLoadStateEnum.Loaded && !isLoadingMore)
    ) {
        return;
    }

    // sets the loading state to 'Loading' for primary folder tree
    setLoadingStateForFolderTree(
        PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
        FolderTreeLoadStateEnum.Loading,
        userIdentity
    );

    let primaryFolderGqlResponse =
        !isFeatureEnabled('tri-disableSDFolders') &&
        extractFolderHierarchy(sessionData, userMailboxInfo);

    try {
        // Check if folder hierarchy is present in the session data, if yes convert it to the gql type response
        // before consuming it.
        if (!primaryFolderGqlResponse) {
            // Fetch the folder hierarchy incase it is missing in session data.
            const fetchPrimaryMailFolders = await lazyFetchPrimaryMailFolders.import();
            primaryFolderGqlResponse = await fetchPrimaryMailFolders(userMailboxInfo);
        }
    } catch (e) {
        // Set tree loading to error state
        setLoadingStateForFolderTree(
            PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
            FolderTreeLoadStateEnum.ErrorLoading,
            userIdentity
        );
        return;
    }

    // Handle undefined response appropriately
    if (!primaryFolderGqlResponse) {
        setLoadingStateForFolderTree(
            PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
            FolderTreeLoadStateEnum.ErrorLoading,
            userIdentity
        );
        return;
    }

    const userDisplayName =
        getUserConfiguration().SessionSettings.UserEmailAddress === userIdentity
            ? getUserConfiguration().SessionSettings.UserDisplayName
            : userIdentity;

    // Consume the gql response
    onFolderHierarchyResponse(
        primaryFolderGqlResponse.RootFolder,
        primaryFolderGqlResponse.Folders,
        PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
        userIdentity,
        userDisplayName,
        PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
        userIdentity,
        primaryFolderGqlResponse.IncludesLastItemInRange,
        primaryFolderGqlResponse.offset
    );

    // log various counts after primary mail folders have been loaded
    logDataOnFolderLoaded();
}

function logDataOnFolderLoaded() {
    const numInboxChildFolders = getFolderTable().get(folderNameToId('inbox'))?.childFolderIds
        .length;
    const msgRootFolderCount = getFolderTable().get(folderNameToId('msgfolderroot'))?.TotalCount;

    logUsage('TnS_LoadFolders', [numInboxChildFolders, msgRootFolderCount]);
}
