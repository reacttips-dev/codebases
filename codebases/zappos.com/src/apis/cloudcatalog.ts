import { stringify } from 'query-string';

import timedFetch from 'middleware/timedFetch';
import {
  CloudCatalogBrand,
  ProductBundleOptions,
  ProductBundleResponse,
  ProductReviews,
  RelatedProductStyle
} from 'types/cloudCatalog';

interface CloudCatalogOptions {
  url: string;
  siteId: number;
  subsiteId: number;
}

const BASE_INCLUDES = ['preferredSubsite', 'hardLaunchDate', 'taxonomyAttributes'];
const IN_STOCK_INCLUDES = BASE_INCLUDES.concat(['drop', 'finalSale']);

/**
 * Get detail for a specific product
 */
export function productBundle({ url, siteId, subsiteId }: CloudCatalogOptions, { asin, stockId, styleId, productId, includeTsdImages = false, includeOosSizing = false, includeOos = false }: ProductBundleOptions, fetcher = timedFetch('cloudCatalogProduct')): Promise<Response<ProductBundleResponse>> {
  const qs = stringify({
    asin,
    autolink: 'brandProductName',
    entireProduct: true,
    includeBrand: true,
    includeImages: true,
    includeOos,
    includeOosSizing,
    includeSizing: true,
    includeTsdImages,
    includes: (includeOos ? BASE_INCLUDES : IN_STOCK_INCLUDES).join(','),
    productId,
    siteId,
    subsiteId,
    stockId,
    styleId
  });
  const productUrl = `${url}/v3/productBundle?${qs}`;
  return fetcher(productUrl);
}

interface ReviewCriteria {
  productId: string;
  limit?: string | number;
  filter?: string;
  offset?: string | number;
  page?: string | number;
  query?: string;
  sort?: string;
  types?: string;
}
/**
* Get product review for a product
*/
export function productReviews({ url }: CloudCatalogOptions, criteria: ReviewCriteria, fetcher = timedFetch('review')): Promise<Response<ProductReviews>> {
  return fetcher(`${url}/v2/reviews?${stringify(criteria)}`);
}

/**
 * Get a list of all brands
 */
export function brandList({ url, siteId }: CloudCatalogOptions, fetcher = timedFetch('cloudCatalogBrandList')): Promise<Response<CloudCatalogBrand[]>> {
  return fetcher(`${url}/v1/brandList?siteId=${siteId}`);
}

export interface RelatedProductResponse {
  dontForget: {
    brandName: string;
    productId: string;
    productName: string;
    styles: RelatedProductStyle[];
  };
}
/**
* Get products related to the one with the given product ID
*/
export function relatedProducts({ url, siteId }: CloudCatalogOptions, { productId = '' }, fetcher = timedFetch('cloudCatalogRelatedProducts')): Promise<Response<RelatedProductResponse | {}>> {
  return fetcher(`${url}/v1/relatedProducts?productId=${productId}&siteId=${siteId}`);
}

interface LikeCountOptions {
  styleIds: string[];
  type: string;
}
/**
* Returns count of likes for a product, defaulting to heart list
* https://api.zcloudcat.com/v1/listItemCounts?siteId=1&type=h&
*/
export function likeCounts({ url, siteId }: CloudCatalogOptions, { styleIds, type = 'h' }: LikeCountOptions, fetcher = timedFetch('likeCounts')): Promise<Response<Record<string, number>>> {
  return fetcher(`${url}/v1/listItemCounts?itemIds=${styleIds.join(',')}&type=${type}&siteId=${siteId}`);
}
