import { action } from 'satcheljs';

export default action('ADD_PUBLIC_FOLDER_TO_FAVORITES', (folderId: string) => {
    return {
        folderId,
    };
});

// Needed by People Hub to know when Public Folders are added to favorites
export const addPublicFolderToFavoritesCompleted = action(
    'addPublicFolderToFavoritesCompleted',
    (folderId: string, folderName: string, favoriteId: string) => {
        return {
            folderId,
            folderName,
            favoriteId,
        };
    }
);
