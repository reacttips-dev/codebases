import { orchestrator } from 'satcheljs';
import loadFavoritePersonaSearchFolder from '../../actions/v2/people/loadFavoritePersonaSearchFolder';
import { outlookFavoritePersonaSearchFoldersLoaded } from 'owa-folders';
import fetchFavoritePersonaSearchFolders from '../../services/v2/fetchFavoritePersonaSearchFolders';

export default orchestrator(loadFavoritePersonaSearchFolder, async actionMessage => {
    const { favoriteData } = actionMessage;

    const personaFolder = await fetchFavoritePersonaSearchFolders([favoriteData.searchFolderId]);

    outlookFavoritePersonaSearchFoldersLoaded([personaFolder], [favoriteData]);
});
