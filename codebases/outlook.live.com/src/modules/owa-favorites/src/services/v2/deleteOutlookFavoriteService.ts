import { makeDeleteRequest } from 'owa-ows-gateway';
import { OUTLOOK_FAVORITES_API_URL } from './outlookFavoritesServiceConst';
import { makeRequestWithFullResponseErrorHandling } from './makeRequestWithFullResponseErrorHandling';

/**
 * Issue the service request to delete an outlook favorite
 * @param favoriteId id of the favorite outlookFavoriteData
 * @returns a promise which contains the delete outlook favorite response
 */
export default function deleteOutlookFavoriteService(favoriteId: string): Promise<any> {
    return makeRequestWithFullResponseErrorHandling(() =>
        makeDeleteRequest(
            `${OUTLOOK_FAVORITES_API_URL}/${favoriteId}`,
            null /* requestObject */,
            null /* correlationId */,
            true /* returnFullResponse */,
            null /* customHeaders */,
            true /* throwServiceError */
        )
    );
}
