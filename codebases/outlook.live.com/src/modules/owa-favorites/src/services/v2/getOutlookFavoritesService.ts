import { OUTLOOK_FAVORITES_API_URL } from './outlookFavoritesServiceConst';
import { makeGetRequest } from 'owa-ows-gateway';

export default function getOutlookFavoritesService(): Promise<any> {
    return makeGetRequest(
        OUTLOOK_FAVORITES_API_URL,
        undefined /* correlationId */,
        false /* returnFullResponse */,
        undefined /* customHeaders */,
        true /* throwServiceError */
    );
}
