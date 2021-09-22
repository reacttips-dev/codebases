import { action } from 'satcheljs';
import type { PublicFolderStore } from '../store/publicFolderFavoriteStore';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';

export default action(
    'ADD_PUBLIC_FOLDER_TO_STORE',
    (state: PublicFolderStore, item: BaseFolderType) => {
        return {
            state,
            item,
        };
    }
);
