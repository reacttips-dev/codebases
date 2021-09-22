import * as pendingFavoritesMapMutators from '../mutators/pendingFavoritesMapMutators';
import { onCategoryUnfavorited } from 'owa-favorites';
import { orchestrator } from 'satcheljs';

export default orchestrator(onCategoryUnfavorited, actionMessage => {
    pendingFavoritesMapMutators.remove(actionMessage.categoryId);
});
