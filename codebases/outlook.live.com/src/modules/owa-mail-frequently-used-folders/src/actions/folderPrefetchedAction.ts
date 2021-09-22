import { action } from 'satcheljs';

export default action('folderPrefetchedAction', (folderId: string) => {
    return {
        folderId,
    };
});
