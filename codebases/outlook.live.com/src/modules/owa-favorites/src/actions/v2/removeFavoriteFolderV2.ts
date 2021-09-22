import { action } from 'satcheljs';

/**
 * Remove a favorite folder
 * @param folderIdToRemove the id to be remove
 */
export default action('REMOVE_FAVORITE_FOLDER_V2', (folderIdToRemove: string) => {
    return {
        folderIdToRemove,
    };
});
