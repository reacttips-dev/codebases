import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { FavoritePersonaData, FavoritePrivateDistributionListData } from 'owa-favorites-types';

export default action(
    'loadFavoritePersonaSearchFolder',
    (favoriteData: FavoritePersonaData | FavoritePrivateDistributionListData) =>
        addDatapointConfig(
            { name: 'LoadFavoritePersonaSearchFolder' },
            {
                favoriteData,
            }
        )
);
