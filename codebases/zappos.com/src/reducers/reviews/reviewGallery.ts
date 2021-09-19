import {
  HIDE_REVIEW_GALLERY_MODAL,
  RECEIVE_PRODUCT_REVIEWS_WITH_MEDIA,
  REQUEST_PRODUCT_DETAIL,
  REQUEST_PRODUCT_REVIEWS_WITH_MEDIA,
  SHOW_REVIEW_GALLERY_MODAL
} from 'constants/reduxActions';
import {
  IMAGE,
  MOST_HELPFUL,
  VIDEO
} from 'constants/appConstants';
import cleanReviews, { CleanedProductReview } from 'reducers/reviews/cleanReviews';
import { AppAction } from 'types/app';

export interface ReviewGalleryState {
  reviews: CleanedProductReview[];
  reviewId: null | string;
  reviewMediaIndex: number;
  isModalOpen: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  orderBy: string;
  mediaList: MediaListMedia[];
  imageCount?: number;
  videoCount?: number;
  mediaCount?: number;
}

const initialState: ReviewGalleryState = {
  reviews: [],
  reviewId: null,
  reviewMediaIndex: 0,
  isModalOpen: false,
  isLoading: false,
  isLoaded: false,
  orderBy: MOST_HELPFUL,
  mediaList: []
};

export const getMediaLabel = (mediaType?: string, authorByline?: string) => `${mediaType === IMAGE ? 'Image' : 'Video'} uploaded by ${authorByline}`;

interface ReviewMediaInfo {
  imageCount: number;
  videoCount: number;
  mediaCount: number;
  mediaList: MediaListMedia[];
}

export interface MediaListMedia {
  url: string;
  type: string;
  reviewId: string;
  mediaIndex: number;
  label: string;
}

export const makeMediaInfo = (reviews: CleanedProductReview[]): ReviewMediaInfo => {
  let imageCount = 0;
  let videoCount = 0;
  const reviewCount = reviews.length;
  const mediaList = [];
  for (let j = 0; j < reviewCount; ++j) {
    const { id, reviewGalleryMedia } = reviews[j];
    if (!reviewGalleryMedia) {
      continue;
    }
    const mediaCount = reviewGalleryMedia.length;
    for (let i = 0; i < mediaCount; ++i) {
      const { mediaType, mediaUrl, msaMediaUrl } = reviewGalleryMedia[i];

      // if it's an unsupported media type don't even include it the store
      if (mediaType === IMAGE || mediaType === VIDEO) {
        const review = reviews[j];
        const label = getMediaLabel(mediaType, review.authorByline);
        if (mediaType === IMAGE) {
          ++imageCount;
        } else if (VIDEO) {
          ++videoCount;
        }
        mediaList.push({ url: msaMediaUrl || mediaUrl, type: mediaType, reviewId: id, mediaIndex: i, label });
      }

    }
  }
  return { imageCount, videoCount, mediaCount: imageCount + videoCount, mediaList };
};

const reviewGallery = (state: Readonly<ReviewGalleryState> = initialState, action: AppAction): ReviewGalleryState => {
  switch (action.type) {
    case SHOW_REVIEW_GALLERY_MODAL: {
      const { reviewId, reviewMediaIndex } = action;
      return { ...state, isModalOpen: true, reviewId, reviewMediaIndex };
    }
    case REQUEST_PRODUCT_DETAIL: {
      return { ...initialState };
    }
    case REQUEST_PRODUCT_REVIEWS_WITH_MEDIA: {
      return { ...state, isLoading: true, isLoaded: false };
    }
    case RECEIVE_PRODUCT_REVIEWS_WITH_MEDIA: {
      const { reviews } = action;
      const cleanedReviews = cleanReviews(reviews);
      const { imageCount, videoCount, mediaCount, mediaList } = makeMediaInfo(cleanedReviews);
      return { ...state, reviews: cleanedReviews, isLoading: false, isLoaded: true, imageCount, videoCount, mediaCount, mediaList };
    }
    case HIDE_REVIEW_GALLERY_MODAL: {
      return { ...state, isModalOpen: false, reviewId: null, reviewMediaIndex: 0 };
    }
    default:
      return state;
  }
};

export default reviewGallery;
