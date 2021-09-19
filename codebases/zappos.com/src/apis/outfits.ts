import { dashOrSnakeCaseToCamelCaseDeep } from 'helpers/DataFormatUtils';
import timedFetch from 'middleware/timedFetch';
import { fetchErrorMiddlewareAllowedErrors } from 'middleware/fetchErrorMiddleware';
import { Look, Looks, LooksError, OutfitApiListResponse } from 'types/outfits';
import { OutfitMedia, OutfitMediaResponse } from 'types/outfitMedia';
import { CamelCasedProps } from 'types/utility';

const LOOKS_API_BASE_URL = 'https://d1fmnjalyijmpf.cloudfront.net/api';
const OUTFITS_MVP_API_BASE_URL = 'https://d2wqmv008y1iid.cloudfront.net';

export const transformLookToMedia = (look: Look): OutfitMedia => ({
  entityType: look.source,
  entityId: look.sourceId,
  mediaType: look.mediaType,
  mediaUrl: look.mediaUrl,
  products: look.products,
  uploadTs: look.uploadTs
});

export const transformLooksToMedia = (looks: CamelCasedProps<Looks> | CamelCasedProps<LooksError>): OutfitMediaResponse => ('looks' in looks ? { media: looks.looks.map(transformLookToMedia) } : { media: [] });

export function getLooks(productId: string, fetcher: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response<Looks | LooksError>> = timedFetch('productLooks') as any /* TODO ts Remove once `timedFetch` is typed */): Promise<OutfitMediaResponse> {
  return fetcher(`${LOOKS_API_BASE_URL}/v1/looks/${productId}.json`, { method: 'GET', mode: 'cors' })
    .then(fetchErrorMiddlewareAllowedErrors([404]))
    .then(data => dashOrSnakeCaseToCamelCaseDeep(data))
    .then(transformLooksToMedia);
}

// 404s from the API will return an { outfits: [] } are considered valid
export function getOutfits(productId: string, styleId: string, fetcher: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response<OutfitApiListResponse>> = timedFetch('productOutfits') as any /* TODO ts Remove once `timedFetch` is typed */) {
  return fetcher(`${OUTFITS_MVP_API_BASE_URL}/v1/outfits/${productId}/${styleId}.json`, { method: 'GET' })
    .then(fetchErrorMiddlewareAllowedErrors([404]));
}
