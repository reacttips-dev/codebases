import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import datapoints from '../../../datapoints';
import type { FavoriteDataWithSearchFolderId } from 'owa-favorites-types';
/**
 * Favorites have been loaded in store
 */
export default action(
    'outlookFavoritePersonasLoaded',
    (personas: FavoriteDataWithSearchFolderId[]) =>
        addDatapointConfig(datapoints.OutlookFavoritePersonasLoaded, {
            personas,
        })
);
