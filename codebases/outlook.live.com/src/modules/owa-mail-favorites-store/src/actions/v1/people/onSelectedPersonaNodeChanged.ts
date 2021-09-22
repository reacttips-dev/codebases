import datapoints from '../../../datapoints';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import { logUsage } from 'owa-analytics';
import { deleteFolders } from 'owa-mail-persona-search-folder-services';
import { trace } from 'owa-trace';

/**
 * If the currenly selected persona get un-favorited we cannot delete the search folder
 * immediately, but once the selected node changes.
 */
export default async function onSelectedPersonaNodeChanged(personaNode: FavoritePersonaNode) {
    try {
        if (personaNode.markedForDeletion) {
            await deleteFolders([personaNode.searchFolderId], true /* permanentlyDelete */);
        }
    } catch (error) {
        // Fail silently and log.
        // By default search folders are deleted at some point when they become stale
        const { name: eventName, customData: customData } = datapoints.DeleteFolderFailure;

        trace.warn(eventName + ': ' + error);
        logUsage(eventName, customData(error.toString()));
    }
}
