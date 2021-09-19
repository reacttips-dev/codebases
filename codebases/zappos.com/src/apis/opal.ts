import queryString from 'query-string';

import { OnDemandSizingRequestData, OpalProfile, OpalProfileError, OpalSavedFilters, OrganizedFilters, SavedSizes, SizingPrediction, SupportedBrandsResponse } from 'types/opal';
import timedFetch from 'middleware/timedFetch';
import { trackError } from 'helpers/ErrorUtils';

const v2CustomerEndpoint = '/customer/v2/preferences';
export const ENDPOINT_OPAL_EXPLICITFITS = '/opalSizingAuth/explicit/fits';

interface OpalOptions {
  url: string;
}

/**
 * Get product sizing prediction
 * @param  {object}   url             sizing prediction api endpoint
 * @param  {object}   productId       product id
 * @param  {function} [fetcher=fetch] fetch or fetch like implementation
 * @return {Promise}                   promise
 */
export function sizingPrediction({ url }: OpalOptions, { productId }: { productId: string }, fetcher = timedFetch('sizingPrediction')): Promise<Response<SizingPrediction>> {

  const queryParams = {
    productId,
    ignoreCustomerForOnDemandEligible: true
  };

  const query = queryString.stringify(queryParams);
  const reqUrl = `${url}/sizing/v2/prediction?${query}`;
  return fetcher(reqUrl, {
    method: 'GET',
    credentials: 'include'
  });
}

/**
 * Get on-demand sizing prediction
 * @param  {object}   url             on-demand sizing prediction api endpoint
 * @param  {object}   reqData         productId, productSize, brandId, productCategory, gender
 * @param  {function} [fetcher=fetch] fetch or fetch like implementation
 */
export function sizingPredictionOnDemand({ url }: OpalOptions, reqData: OnDemandSizingRequestData, fetcher = timedFetch('sizingPredictionOnDemand')): Promise<Response<SizingPrediction>> {
  const { productId, productSize, brandId, productCategory, gender } = reqData;
  const queryParams = {
    productId,
    size: productSize,
    brandId,
    gender,
    productCategory,
    ignoreCustomerForOnDemandEligible: true
  };

  const query = queryString.stringify(queryParams);
  const reqUrl = `${url}/sizing/v2/prediction/onDemand?${query}`;
  return fetcher(reqUrl, {
    method: 'GET',
    credentials: 'include'
  });
}

/**
 * Get a list of supported brands for on-demand sizing prediction
 * @param  {object}   url             supported brands api endpoint
 * @param  {object}   gender          gender ("Men" or "Women")
 * @param  {function} [fetcher=fetch] fetch or fetch like implementation
 * @return {object}                   promise
 */
export function supportedBrands({ url }: OpalOptions, gender: string | null, fetcher = timedFetch('sizingSupportedBrands')): Promise<Response<SupportedBrandsResponse>> {
  const reqUrl = `${url}/sizing/supportedBrands?gender=${gender}`;
  return fetcher(reqUrl, {
    method: 'GET',
    credentials: 'include'
  });
}

/**
 * Get opal profile
 * @param  {object}   url             opal url
 * @param  {function} [fetcher=fetch] fetch or fetch like implementation
 * @return {object}                   promise
 */
export function profile({ url }: OpalOptions, fetcher = timedFetch('profile')): Promise<Response<OpalProfile | OpalProfileError>> {
  const reqUrl = `${url}/customer/customerProfile`;
  return fetcher(reqUrl, {
    method: 'GET',
    credentials: 'include'
  });
}

/**
 * Save Customers filters
 * @param  {object}   opal          calypso configuration
 * @param  {string}   filters         filters object from redux state
 * @return {object}                   promise
 */
export function saveFiltersToOpal({ url }: OpalOptions, { savedsizes, organizedFilters }: { savedsizes: SavedSizes; organizedFilters: OrganizedFilters }, fetcher = timedFetch('saveFilters')): Promise<Response<OpalSavedFilters>> {
  const customerId = savedsizes?.id;
  const method = !customerId ? 'POST' : 'PUT';
  const reqUrl = `${url}${v2CustomerEndpoint}/sizeFilters${customerId ? `/${customerId}` : ''}`;
  return fetcher(reqUrl, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(organizedFilters),
    credentials: 'include'
  }).catch((e: Error) => trackError('NON-FATAL', 'Could not save filters.', e));
}

export function deleteFiltersFromOpal({ url }: OpalOptions, id: string, fetcher = timedFetch('deleteFilters')): Promise<Response<void>> /* This _might_ return something, but we don't use it */ {
  return fetcher(`${url}${v2CustomerEndpoint}/sizeFilters/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).catch((e: Error) => trackError('NON-FATAL', 'Could delete saved filters.', e));
}
