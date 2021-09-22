import { OUTLOOK_FAVORITES_API_URL } from './outlookFavoritesServiceConst';
import type { OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import { makePatchRequest } from 'owa-ows-gateway';
import { makeRequestWithFullResponseErrorHandling } from './makeRequestWithFullResponseErrorHandling';

/**
 * update the service request to update an existing outlook favorite
 * @param owsOutlookFavoritesData the favorite service data that needs to be updated
 * @returns a promise which contains the response of OWS Prime updateOutlookFavorite service call
 */
export default function updateOutlookFavoriteService(
    owsOutlookFavoritesData: OutlookFavoriteServiceDataType
): Promise<any> {
    return makeRequestWithFullResponseErrorHandling(() =>
        makePatchRequest(
            `${OUTLOOK_FAVORITES_API_URL}/${owsOutlookFavoritesData.Id}`,
            owsOutlookFavoritesData,
            undefined /* correlationId */,
            true /* returnFullResponse */,
            null /* customHeaders */,
            true /* throwServiceError */
        )
    );
}
