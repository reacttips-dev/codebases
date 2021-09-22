import favoriteStore from '../../store/store';
import markSearchFolderAsPopulated from '../../actions/v2/people/markSearchFolderAsPopulated';
import { mutator } from 'satcheljs';
import type { FavoriteDataWithSearchFolderId } from 'owa-favorites-types';

export default mutator(markSearchFolderAsPopulated, actionMessage => {
    const { favoriteId } = actionMessage;

    const favoriteData = favoriteStore.outlookFavorites.get(favoriteId);

    // personaNode can be undefined if user removed favorite before the search folder has been populated
    if (favoriteData) {
        if (favoriteData.type === 'persona' || favoriteData.type === 'privatedistributionlist') {
            (favoriteData as FavoriteDataWithSearchFolderId).isSearchFolderPopulated = true;
        }
    }
});
