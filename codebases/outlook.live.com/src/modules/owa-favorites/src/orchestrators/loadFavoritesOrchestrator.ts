import loadFavorites from '../actions/loadFavorites';
import loadFavoritesV1 from '../actions/v1/loadFavoritesV1';
import loadOutlookFavorites from '../utils/loadOutlookFavorites';
import { isFeatureEnabled } from 'owa-feature-flags';
import { orchestrator } from 'satcheljs';

export default orchestrator(loadFavorites, actionMessage => {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        // Load roaming favorites from the Outlook Favorites
        loadOutlookFavorites();
    } else {
        // Load favorites from FavoritesNodes
        loadFavoritesV1();
    }
});
