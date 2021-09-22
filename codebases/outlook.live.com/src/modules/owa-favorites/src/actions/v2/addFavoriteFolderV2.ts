import { action } from 'satcheljs';

/**
 * Add a favorite folder
 * @param folderIdToAdd the id to be added
 */
export default action('ADD_FAVORITE_FOLDER_V2', (folderIdToAdd: string, newIndex?: number) => {
    return {
        folderIdToAdd,
        newIndex,
    };
});
