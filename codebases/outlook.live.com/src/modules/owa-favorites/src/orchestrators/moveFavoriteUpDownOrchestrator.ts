import moveFavoriteUpDown from '../actions/moveFavoriteUpDown';
import moveFavoriteUpDownV1 from '../actions/v1/moveFavoriteUpDownV1';
import moveFavoriteUpDownV2 from '../actions/v2/moveFavoriteUpDownV2';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export { FolderForestNodeType } from 'owa-favorites-types';

export default orchestrator(moveFavoriteUpDown, actionMessage => {
    const { favoriteId, isMoveUp, favoriteType } = actionMessage;

    if (isFeatureEnabled('tri-favorites-roaming')) {
        moveFavoriteUpDownV2(favoriteId, isMoveUp, favoriteType);
    } else {
        moveFavoriteUpDownV1(favoriteId, isMoveUp);
    }
});
