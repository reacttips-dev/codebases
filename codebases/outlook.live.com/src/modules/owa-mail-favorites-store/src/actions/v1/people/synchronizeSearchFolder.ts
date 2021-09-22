import setupFavoritePersona from './setupFavoritePersona';
import updatePersonaIsSyncUpdateDone from '../../updatePersonaIsSyncUpdateDone';
import type { FavoritePersonaNode } from 'owa-favorites-types';
import { getStore } from '../../../index';
import {
    synchronizePersonaSearchFolder,
    getFavoritePersonasRootFolderId,
    SynchronizePersonaSearchFolderSource,
} from 'owa-mail-persona-search-folder-services';

/**
 * Update the search folder associated with the given persona. Create a new one if necessary.
 * Updates the current persona in the store with the new searchFolderId value
 * @param persona The persona whose search folder will be synced
 * @returns A promise wih a boolean value indicating whether a new search folder was generated
 */
export default async function synchronizeSearchFolder(
    persona: FavoritePersonaNode,
    source: SynchronizePersonaSearchFolderSource,
    hasPersonaInformationChanged?: boolean
): Promise<boolean> {
    const state = getStore();

    const parentFolderId =
        state.favoritePersonasRootFolderId || (await getFavoritePersonasRootFolderId());

    const searchFolderPersona = {
        favoriteNodeId: persona.id,
        displayName: persona.displayName,
        allEmailAddresses: persona.allEmailAddresses,
    };
    const searchFolder = await synchronizePersonaSearchFolder(
        searchFolderPersona,
        parentFolderId,
        source,
        hasPersonaInformationChanged
    );

    const hasSearchFolderIdChanged = persona.searchFolderId !== searchFolder.FolderId.Id;

    setupFavoritePersona(searchFolder);

    updatePersonaIsSyncUpdateDone(persona, true);

    return hasSearchFolderIdChanged;
}
