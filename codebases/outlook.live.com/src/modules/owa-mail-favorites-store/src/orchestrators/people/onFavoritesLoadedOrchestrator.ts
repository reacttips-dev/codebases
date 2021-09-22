import { orchestrator } from 'satcheljs';
import outlookFavoritePersonasLoaded from '../../actions/v2/people/outlookFavoritePersonasLoaded';
import { outlookFavoritePersonaSearchFoldersLoaded } from 'owa-folders';
import { fetchMultipleFavoritePersonaSearchFolders } from 'owa-mail-persona-search-folder-services';

export default orchestrator(outlookFavoritePersonasLoaded, async actionMessage => {
    const { personas } = actionMessage;
    const searchFolderIdsForPersonas = personas
        .map(persona => persona.searchFolderId)
        .filter(searchFolderId => !!searchFolderId);

    const existingFolders = await fetchMultipleFavoritePersonaSearchFolders(
        searchFolderIdsForPersonas
    );
    outlookFavoritePersonaSearchFoldersLoaded(existingFolders, personas);
});
