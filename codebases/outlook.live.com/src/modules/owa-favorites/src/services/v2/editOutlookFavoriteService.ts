import type { OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import { OUTLOOK_FAVORITES_API_URL } from './outlookFavoritesServiceConst';
import { makePatchRequest } from 'owa-ows-gateway';
import { makeRequestWithFullResponseErrorHandling } from './makeRequestWithFullResponseErrorHandling';

/**
 * Create the service request to add an outlook favorite
 * @param owsOutlookFavoritesData the favorite data that needs to be added
 * @returns a promise which contains EditOutlookFavoriteJsonResponse
 */
export default function editOutlookFavoriteService(
    favoriteId: string,
    owsOutlookFavoritesData: OutlookFavoriteServiceDataType
): Promise<any> {
    return makeRequestWithFullResponseErrorHandling(() =>
        makePatchRequest(
            `${OUTLOOK_FAVORITES_API_URL}/${favoriteId}`,
            owsOutlookFavoritesData,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            null /* customHeaders */,
            true /* throwServiceError */
        )
    );
}
