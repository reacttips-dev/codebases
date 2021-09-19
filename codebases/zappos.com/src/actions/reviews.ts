import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import {
  HIDE_REVIEW_GALLERY_MODAL,
  RECEIVE_PRODUCT_REVIEWS_WITH_MEDIA,
  REQUEST_PRODUCT_REVIEWS_WITH_MEDIA,
  SET_DOC_META_PRODUCT_REVIEWS,
  SHOW_REVIEW_GALLERY_MODAL
} from 'constants/reduxActions';
import { productReviews } from 'apis/cloudcatalog';
import { fetchProductDetail, fetchProductReviews } from 'actions/productDetail';
import { IS_NUMBER_RE } from 'common/regex';
import { err, setError } from 'actions/errors';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { trackError } from 'helpers/ErrorUtils';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import { AppState } from 'types/app';
import { ProductReview } from 'types/cloudCatalog';

export function showReviewGalleryModal(reviewId: string, reviewMediaIndex: number) {
  return {
    type: SHOW_REVIEW_GALLERY_MODAL,
    reviewId,
    reviewMediaIndex
  } as const;
}

export function hideReviewGalleryModal() {
  return {
    type: HIDE_REVIEW_GALLERY_MODAL
  } as const;
}

export function requestProductReviewsWithMedia() {
  return {
    type: REQUEST_PRODUCT_REVIEWS_WITH_MEDIA
  } as const;
}

export function receiveProductReviewsWithMedia(reviews: ProductReview[]) {
  return {
    type: RECEIVE_PRODUCT_REVIEWS_WITH_MEDIA,
    reviews
  } as const;
}

export function setProductReviewsDocMeta(product: FormattedProductBundle) {
  return { type: SET_DOC_META_PRODUCT_REVIEWS, product } as const;
}

export function loadProductReviewsPage(productId: string, reviewsPage?: number | string, reviewsStart?: number | string, orderBy?: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    return Promise.all([
      dispatch(fetchProductDetail(productId, { errorOnOos: false })),
      dispatch(fetchProductReviews(productId, reviewsPage, reviewsStart, true, orderBy)),
      dispatch(fetchProductReviewsWithMedia(productId))
    ])
      .then(() => {
        const { product: { detail } } = getState();
        detail && dispatch(setProductReviewsDocMeta(detail));
      });
  };
}

export function fetchProductReviewsWithMedia(productId: string, isCrucial = false, limit?: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestProductReviewsWithMedia());
    const state = getState();
    const { environmentConfig: { api: { cloudreviews } } } = state;
    return productReviews(cloudreviews, { productId, limit, filter: 'hasMedia:true' })
      .then(fetchErrorMiddleware)
      .then(({ reviews }) => {
        dispatch(receiveProductReviewsWithMedia(reviews));
      })
      .catch(e => {
        if (isCrucial) {
          dispatch(setError(err.PRODUCT_DETAILS, e));
        } else {
          trackError('NON-FATAL', 'Could not load Product Reviews.', e);
        }
      });
  };
}

export function fetchZenCustomerMedia(productId: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    dispatch(requestProductReviewsWithMedia());
    const state = getState();
    const { environmentConfig: { api: { cloudreviews } } } = state;
    return productReviews(cloudreviews, { productId, types: 'zenMediaOnly' })
      .then(fetchErrorMiddleware)
      .then(({ reviews }) => {
        dispatch(receiveProductReviewsWithMedia(reviews));
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not load Zen customer media.', e);
      });
  };
}

interface ReviewRequestOpts {
  productId: string;
  reviewsPage?: string;
  reviewsStart?: string;
}

export function isValidReviewsRequest({ productId, reviewsPage, reviewsStart }: ReviewRequestOpts) { // dont bother validating orderBy since review fetcher handles any input
  return productId && IS_NUMBER_RE.test(productId) && (!reviewsPage || IS_NUMBER_RE.test(reviewsPage)) && (!reviewsStart || IS_NUMBER_RE.test(reviewsStart));
}

export type ReviewAction =
 | ReturnType<typeof showReviewGalleryModal>
 | ReturnType<typeof hideReviewGalleryModal>
 | ReturnType<typeof requestProductReviewsWithMedia>
 | ReturnType<typeof receiveProductReviewsWithMedia>
 | ReturnType<typeof setProductReviewsDocMeta>;
