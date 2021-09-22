import { mutator } from 'satcheljs';
import removeFavoriteFromPublicFolderStore from '../actions/removeFavoriteFromPublicFolderStore';
import publicFolderFavoriteStore from '../store/publicFolderFavoriteStore';

export default mutator(removeFavoriteFromPublicFolderStore, actionMessage => {
    const { folderId } = actionMessage;

    if (publicFolderFavoriteStore.folderTable.has(folderId)) {
        publicFolderFavoriteStore.folderTable.delete(folderId);
    }
});
