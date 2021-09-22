import { action } from 'satcheljs';

export default action('GET_FOLDER_DATA', (folderId: string) => {
    return {
        folderId,
    };
});
