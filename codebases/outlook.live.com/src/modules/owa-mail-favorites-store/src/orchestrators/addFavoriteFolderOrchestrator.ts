import addFavoriteFolder from '../actions/addFavoriteFolder';
import addFavoriteFolderV1 from '../actions/v1/addFavoriteFolderV1';
import { lazyAddFavoriteFolderV2 } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export default orchestrator(addFavoriteFolder, async actionMessage => {
    const folderIdToAdd = actionMessage.folderIdToAdd;
    const newIndex = actionMessage.newIndex;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        const addFavoriteFolderV2 = await lazyAddFavoriteFolderV2.import();
        addFavoriteFolderV2(folderIdToAdd, newIndex);
    } else {
        addFavoriteFolderV1(folderIdToAdd);
    }
});
