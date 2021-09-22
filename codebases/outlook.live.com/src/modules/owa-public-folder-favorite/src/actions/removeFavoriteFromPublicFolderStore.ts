import { action } from 'satcheljs';

export default action('REMOVE_FAVORITE_FROM_PUBLIC_FOLDER_STORE', (folderId: string) => {
    return {
        folderId,
    };
});
