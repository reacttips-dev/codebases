import type { OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import { OUTLOOK_FAVORITES_API_URL } from './outlookFavoritesServiceConst';
import { makePostRequest } from 'owa-ows-gateway';
import { makeRequestWithFullResponseErrorHandling } from './makeRequestWithFullResponseErrorHandling';

/**
 * Create the service request to add an outlook favorite
 * @param owsOutlookFavoritesData the favorite data that needs to be added
 * @returns a promise which contains CreateOutlookFavoriteJsonResponse
 */
export default function createMultipleOutlookFavoritesService(
    favoriteList: OutlookFavoriteServiceDataType[]
): Promise<any> {
    return makeRequestWithFullResponseErrorHandling(() =>
        makePostRequest(
            `${OUTLOOK_FAVORITES_API_URL}/Create`,
            favoriteList,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            null /* customHeaders */,
            true /* throwServiceError */
        )
    );
}
