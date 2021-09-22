import updateFavoritePosition from '../actions/updateFavoritePosition';
import moveFavoriteToPositionV1 from '../actions/v1/moveFavoriteToPositionV1';
import updateFavoritePositionV2 from '../actions/v2/updateFavoritePositionV2';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export default orchestrator(updateFavoritePosition, actionMessage => {
    const { favoriteIdToUpdate, destinationFavoriteId, favoriteType } = actionMessage;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        updateFavoritePositionV2(favoriteIdToUpdate, destinationFavoriteId, favoriteType);
    } else {
        moveFavoriteToPositionV1(favoriteIdToUpdate, destinationFavoriteId);
    }
});
