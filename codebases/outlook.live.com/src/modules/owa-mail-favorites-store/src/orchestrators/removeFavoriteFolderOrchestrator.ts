import removeFavoriteFolder from '../actions/removeFavoriteFolder';
import removeFavoriteFolderV1 from '../actions/v1/removeFavoriteFolderV1';
import { lazyRemoveFavoriteFolderV2 } from 'owa-favorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export default orchestrator(removeFavoriteFolder, async actionMessage => {
    const folderIdToRemove = actionMessage.folderIdToRemove;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        const removeFavoriteFolderV2 = await lazyRemoveFavoriteFolderV2.import();
        removeFavoriteFolderV2(folderIdToRemove);
    } else {
        removeFavoriteFolderV1(folderIdToRemove);
    }
});
