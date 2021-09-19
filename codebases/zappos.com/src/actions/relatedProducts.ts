import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { RECEIVE_RELATED_PRODUCTS } from 'constants/reduxActions';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { RelatedProductResponse, relatedProducts } from 'apis/cloudcatalog';
import { AppState } from 'types/app';

const receiveRelatedProducts = (data: RelatedProductResponse | {}) => ({ type: RECEIVE_RELATED_PRODUCTS, data }) as const;

export function fetchRelatedProducts(productId: string): ThunkAction<void, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const params = { productId };
    const { environmentConfig: { api: { cloudcatalog: cloudCatalogInfo } } } = state;
    relatedProducts(cloudCatalogInfo, params)
      .then(fetchErrorMiddleware)
      .then(res => {
        dispatch(receiveRelatedProducts(res));
        return res;
      });
  };
}

export type RelatedProductAction =
 | ReturnType<typeof receiveRelatedProducts>;

export const hasRelatedProducts = (data: RelatedProductResponse | {}): data is RelatedProductResponse => !!(data as RelatedProductResponse).dontForget;
