import { getMediaLabel } from './reviewGallery';

import { DEFAULT_REVIEWER_NAME, IMAGE, VIDEO } from 'constants/appConstants';
import { ProductReview, ProductReviewMedia } from 'types/cloudCatalog';

function mapAndFilter<T, R>(arr: T[], mapFn: (arg: T, index: number, inputArray: T[]) => R, filterFn: (arg: T, index: number, inputArray: T[]) => boolean): R[] {
  const output: R[] = [];
  arr.forEach((item, i, inputArray) => {
    if (filterFn(item, i, inputArray)) {
      output.push(mapFn(item, i, inputArray));
    }
  });
  return output;
}

const filterUnknownMedia = ({ mediaType }: ProductReviewMedia) => mediaType === IMAGE || mediaType === VIDEO;

const makeMediaMapper = (review: ProductReview) => (reviewMedia: ProductReviewMedia): CleanedProductReviewMedia => {
  const authorByline = getReviewAuthorByline(review);
  const label = getMediaLabel(reviewMedia.mediaType, authorByline);
  return ({ ...reviewMedia, authorByline, label });
};
export const getReviewAuthorByline = (review: ProductReview) => `${review.name || DEFAULT_REVIEWER_NAME}${review.source || review.powerReview ? '' : ', Zappos Customer'}`;

export interface CleanedProductReview extends ProductReview {
  authorByline?: string;
  reviewGalleryMedia: CleanedProductReviewMedia[] | null;
}

export interface CleanedProductReviewMedia extends ProductReviewMedia {
  authorByline?: string;
  label?: string;
}

export function cleanReview(review: ProductReview): CleanedProductReview {
  if (!review || !review.summary) {
    return review;
  }
  // strip out \r's until a new version of 16+ is released
  // see https://github.com/facebook/react/issues/11103
  // Should we be styling newlines something differently here so that newlines are preserved in output?
  let filteredMedia = review.reviewGalleryMedia;
  if (review.hasMedia && review.reviewGalleryMedia) {
    const mapper = makeMediaMapper(review);
    filteredMedia = mapAndFilter(review.reviewGalleryMedia, mapper, filterUnknownMedia);
  }
  return {
    ...review,
    summary: review.summary.replace(/\r\n/g, '\n'),
    reviewGalleryMedia: (filteredMedia as CleanedProductReviewMedia[]),
    authorByline: getReviewAuthorByline(review)
  };

}
/**
 * [cleanReviews description]
 * @param  {Array} reviews
 * @return {Array}         Reviews list with summary text cleaned of newlines.
 */
export default function cleanReviews(reviews: ProductReview[]) {
  return reviews ? reviews.map(cleanReview) : reviews;
}
