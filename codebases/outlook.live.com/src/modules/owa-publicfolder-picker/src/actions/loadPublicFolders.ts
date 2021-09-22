import { action } from 'satcheljs';
import type { FindPublicFolderResponseMessage } from '../services/findPublicFolders';

export let loadPublicFolder = action('LOAD_PUBLIC_FOLDERS', (folderId: string) => {
    return {
        folderId,
    };
});

export let loadFirstLevelPublicFolders = action(
    'LOAD_FIRST_LEVEL_PUBLIC_FOLDERS',
    (folderId: string) => {
        return {
            folderId,
        };
    }
);

export let processFindFolderResponse = action(
    'processFindFolderResponse',
    (responseMessage: FindPublicFolderResponseMessage) => {
        return {
            responseMessage,
        };
    }
);
