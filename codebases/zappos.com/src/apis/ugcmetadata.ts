import { dashOrSnakeCaseToCamelCaseDeep } from 'helpers/DataFormatUtils';
import timedFetch from 'middleware/timedFetch';
import { fetchErrorMiddlewareAllowedErrors } from 'middleware/fetchErrorMiddleware';
import { OutfitMediaResponse } from 'types/outfitMedia';

const METADATA_API_BASE_URL = 'https://service.prod.metadata.ugc.zappos.com';
const DEFAULT_OUTFIT_RESPONSE = { media: [] };

export function getOutfitMedia(productId: string, fetcher: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response<OutfitMediaResponse>> = timedFetch('outfitMedia') as any /* TODO ts Remove once `timedFetch` is typed */) {
  return fetcher(`${METADATA_API_BASE_URL}/s/v1/zappos/images/outfit/${productId}.json`, { method: 'GET', mode: 'cors' })
    .then(fetchErrorMiddlewareAllowedErrors([404], { 404: () => DEFAULT_OUTFIT_RESPONSE }))
    .then(data => dashOrSnakeCaseToCamelCaseDeep(data));
}
