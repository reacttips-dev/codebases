import { action } from 'satcheljs';

export default action(
    'ADD_FOLDER_TO_DEFAULT_FOLDER_MAPPINGS',
    (defaultFolderName: string, folderId: string) => {
        return {
            defaultFolderName,
            folderId,
        };
    }
);
