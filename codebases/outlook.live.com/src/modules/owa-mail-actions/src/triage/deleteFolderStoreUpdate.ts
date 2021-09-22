import { action } from 'satcheljs';

export default action('DELETE_FOLDER_STORE_UPDATE', (folderIds: string[]) => {
    return {
        folderIds,
    };
});
