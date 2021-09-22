import mailSearchStore, { defaultMailSearchStore } from '../store/store';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import { folderForestStore } from 'owa-mail-folder-forest-store';
import {
    primaryMailboxSearchScope,
    archiveMailboxSearchScope,
    publicFolderSearchScope,
    getSearchScopeList,
    singleGroupSearchScope,
    SearchScopeKind,
    sharedFoldersSearchScope,
} from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { mutatorAction } from 'satcheljs';
import {
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
    SHARED_FOLDERS_TREE_TYPE,
    ARCHIVE_FOLDERS_TREE_TYPE,
} from 'owa-folders-constants';
import {
    getOptionsForFeature,
    SearchOptions,
    SearchScope,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default mutatorAction('setStaticSearchScopeData', (shouldClear?: boolean): void => {
    /**
     * Normally this function sets the appropriate values in the store based on
     * the currently selected node. However, if explicitly told to clear this data
     * (i.e. search session is ending), reset values to default values and return.
     */
    if (shouldClear) {
        mailSearchStore.initialSearchScope = defaultMailSearchStore.initialSearchScope;
        mailSearchStore.staticSearchScope = defaultMailSearchStore.staticSearchScope;
        mailSearchStore.staticSearchScopeList = defaultMailSearchStore.staticSearchScopeList;
        return;
    }

    const selectedNode: FolderForestNode = folderForestStore.selectedNode;
    const searchScopeOption = getOptionsForFeature<SearchOptions>(OwsOptionsFeatureType.Search)
        .defaultSearchScope;
    let selectedNodeId = selectedNode.id;

    if (!selectedNodeId) {
        throw new Error(
            'selectedNodeId should not be null when setting the search scope for search.'
        );
    }

    /**
     * We should set the scope to msgFolderRoot if:
     *   - Current selected folder is Inbox and the option to include all results when Inbox is selected is enabled
     *   - Current selected folder is of Persona, PrivateDistributionList, Category, or Search type (as
     *     scoping search to search folder is not supported)
     */
    if (
        (selectedNodeId === folderNameToId('inbox') &&
            searchScopeOption !== SearchScope.CurrentFolder) ||
        searchScopeOption === SearchScope.AllFolders ||
        selectedNode.type === FolderForestNodeType.Persona ||
        selectedNode.type === FolderForestNodeType.PrivateDistributionList ||
        selectedNode.type === FolderForestNodeType.Category ||
        selectedNode.type === FolderForestNodeType.Search
    ) {
        selectedNodeId = folderNameToId(PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID);
    }

    /**
     * Set search scope to 'Group' kind if selected node is a group node.
     * Set search scope to 'ArchiveMailbox' kind if selected node's tree type is archiveFolderTree, else
     * set the search scope as 'PrimaryMailbox'.
     */
    if (selectedNode.type == FolderForestNodeType.Group) {
        mailSearchStore.staticSearchScope = singleGroupSearchScope({
            groupId: selectedNodeId,
            kind: SearchScopeKind.Group,
        });
    } else if (selectedNode.treeType == ARCHIVE_FOLDERS_TREE_TYPE) {
        mailSearchStore.staticSearchScope = archiveMailboxSearchScope({
            folderId: selectedNodeId,
            kind: SearchScopeKind.ArchiveMailbox,
        });
    } else if (selectedNode.treeType == SHARED_FOLDERS_TREE_TYPE) {
        mailSearchStore.staticSearchScope = sharedFoldersSearchScope({
            folderId: selectedNodeId,
            kind: SearchScopeKind.SharedFolders,
        });
    } else if (selectedNode.type == FolderForestNodeType.PublicFolder) {
        mailSearchStore.staticSearchScope = publicFolderSearchScope({
            folderId: selectedNodeId,
            kind: SearchScopeKind.PublicFolder,
        });
    } else {
        mailSearchStore.staticSearchScope = primaryMailboxSearchScope({
            folderId: selectedNodeId,
            kind: SearchScopeKind.PrimaryMailbox,
        });
    }

    // Store initial search scope so we don't lose track of it during session.
    mailSearchStore.initialSearchScope = mailSearchStore.staticSearchScope;

    // Get and store the search scope list based on the initialSearchScope.
    mailSearchStore.staticSearchScopeList = getSearchScopeList(mailSearchStore.initialSearchScope);
});
