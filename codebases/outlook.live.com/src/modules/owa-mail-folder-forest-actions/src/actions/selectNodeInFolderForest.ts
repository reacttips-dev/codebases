import onFolderForestNodeSelected from './onFolderForestNodeSelected';
import commandBarAction from 'owa-group-header-store/lib/actions/commandBarAction';
import NavigationButton from 'owa-group-header-store/lib/store/schema/NavigationButton';
import { lazyOnSelectedPersonaNodeChanged } from 'owa-mail-favorites-store';
import { lazySetGroupLastVisitedTime } from 'owa-group-left-nav-actions';
import { getGroupIdFromTableQuery } from 'owa-group-utils';
import { getSelectedTableView } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import { mutatorAction } from 'satcheljs';
import { getStore } from 'owa-mail-folder-forest-store';
import { FavoritePersonaNode, FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Set the selected node in the folder forest
 * @param node node to be selected
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves when the select node has completed
 */
export default function selectNodeInFolderForest(
    node: FolderForestNode,
    actionSource?: ActionSource,
    sessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    const state = getStore();
    if (state.selectedNode.type === FolderForestNodeType.Persona) {
        lazyOnSelectedPersonaNodeChanged.importAndExecute(
            state.selectedNode as FavoritePersonaNode
        );
    }

    if (state.selectedNode.type === FolderForestNodeType.Group) {
        // If switching from Group to another node, set the time last visited for the group.
        // This will only be needed while Groups supports both seen/unseen and read/unread on
        // different clients. TO-DO 115698: Remove this when legacy clients are no longer using
        // seen/unseen and requiring lastVisitedTime.
        // Skip it in case of delete groups as this will trigger a mailbox association notification with
        // IsMember true and bring the group back to the left nav.
        if (actionSource != 'DeleteGroup') {
            const tableView = getSelectedTableView();
            tableView &&
                lazySetGroupLastVisitedTime.importAndExecute(
                    getGroupIdFromTableQuery(tableView.tableQuery)
                );
        }

        // If switching from Group to Folder or other types,
        // reset the Group Header CommandBar state so it shows Conversations tab
        if (node.type !== FolderForestNodeType.Group) {
            commandBarAction(NavigationButton.Email);
        }
    }

    const selectedNode = { ...node };

    // Set the selected node properties in folder forest store
    setSelectedFolderNode(selectedNode);

    return onFolderForestNodeSelected(selectedNode, actionSource, sessionData, apolloClientPromise);
}

const setSelectedFolderNode = mutatorAction('setSelectedFolderNode', (node: FolderForestNode) => {
    getStore().selectedNode = node;
});
