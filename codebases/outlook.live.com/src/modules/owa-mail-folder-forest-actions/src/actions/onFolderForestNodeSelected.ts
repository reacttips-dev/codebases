import { getCategoryNameFromId, getMasterCategoryList } from 'owa-categories';
import { createGroupMailTableQuery, getListViewTypeForGroup } from 'owa-group-mail-list-actions';
import { isFavoritingInProgress } from 'owa-mail-favorites-store';
import getFolderViewStateFromId from 'owa-mail-folder-store/lib/selectors/getFolderViewStateFromId';
import type MailFolderNodeViewState from 'owa-mail-folder-store/lib/store/schema/MailFolderNodeViewState';
import { TableQuery } from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import type { ActionSource } from 'owa-mail-store';
import { loadTableViewFromTableQuery } from 'owa-mail-table-loading-actions';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import {
    FavoritePersonaNode,
    FolderForestNode,
    FolderForestNodeType,
    FavoritePrivateDistributionListData,
} from 'owa-favorites-types';
import { favoritesStore } from 'owa-favorites';
import {
    lazyCreateFallbackPersonaSearchTableQuery,
    lazyCreateFallbackPrivateDistributionListSearchTableQuery,
    lazyCreateFallbackCategorySearchTableQuery,
} from 'owa-mail-search/lib/lazyFunctions';
import createMailCategoryFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailCategoryFolderTableQuery';
import createMailFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailFolderTableQuery';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Called when a folder forest node is selected
 * @param node the folder forest node
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves whether the select node has completed
 */
export default async function onFolderForestNodeSelected(
    node: FolderForestNode,
    actionSource: ActionSource,
    sessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    let tableQuery: TableQuery;

    switch (node.type) {
        case FolderForestNodeType.Folder:
            const viewState: MailFolderNodeViewState = getFolderViewStateFromId(node.id);
            tableQuery = createMailFolderTableQuery(
                node.id,
                getListViewTypeForFolder(node.id),
                'mail',
                null /* apply default focused view filter for the selected folder*/,
                null /* viewFilter */,
                null /* categoryName */,
                {
                    sortColumn: viewState.sortColumn,
                    sortDirection: viewState.sortOrder,
                }
            );
            break;

        case FolderForestNodeType.Category:
            if (isFavoritingInProgress(node.id)) {
                // Execute one-off search while the category search folder is being populated, because the server
                // search folder hasn't been created yet
                const categoryName = getCategoryNameFromId(node.id, getMasterCategoryList());
                tableQuery = (await lazyCreateFallbackCategorySearchTableQuery.import())(
                    categoryName,
                    getListViewTypeForFolder(node.id)
                );
            } else {
                tableQuery = createMailCategoryFolderTableQuery(node.id);
            }
            break;

        case FolderForestNodeType.Persona:
            const personaNode = node as FavoritePersonaNode;

            if (!personaNode.isSearchFolderPopulated) {
                // Execute search while the folder is being populated
                tableQuery = (await lazyCreateFallbackPersonaSearchTableQuery.import())(
                    personaNode.displayName,
                    personaNode.allEmailAddresses,
                    getListViewTypeForFolder(node.id)
                );
            } else {
                tableQuery = createMailFolderTableQuery(
                    personaNode.searchFolderId,
                    getListViewTypeForFolder(personaNode.searchFolderId),
                    'persona'
                );
            }
            break;

        case FolderForestNodeType.PrivateDistributionList:
            const clickedPdl = favoritesStore.outlookFavorites.get(
                node.id
            ) as FavoritePrivateDistributionListData;

            if (!clickedPdl.isSearchFolderPopulated) {
                // Execute search while the folder is being populated
                tableQuery = (
                    await lazyCreateFallbackPrivateDistributionListSearchTableQuery.import()
                )(
                    clickedPdl.displayName,
                    clickedPdl.members,
                    clickedPdl.pdlId,
                    clickedPdl.owsPersonaId,
                    getListViewTypeForFolder(node.id)
                );
            } else {
                tableQuery = createMailFolderTableQuery(
                    clickedPdl.searchFolderId,
                    getListViewTypeForFolder(clickedPdl.searchFolderId),
                    'privatedistributionlist'
                );
            }
            break;

        case FolderForestNodeType.Group:
            tableQuery = createGroupMailTableQuery(node.id, getListViewTypeForGroup());
            break;

        case FolderForestNodeType.PublicFolder:
            tableQuery = createMailFolderTableQuery(node.id, ReactListViewType.Message, 'mail');
            break;

        default:
            // No-op for other node type
            break;
    }

    return loadTableViewFromTableQuery(
        tableQuery,
        null /* loadTableViewDataPoint */,
        actionSource,
        sessionData,
        apolloClientPromise
    );
}
