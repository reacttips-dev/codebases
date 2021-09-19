import React from 'react';
import cn from 'classnames';

import { pluralize } from 'helpers/index';
import ReviewGalleryMediaGrid from 'components/reviews/ReviewGalleryMediaGrid';
import useMartyContext from 'hooks/useMartyContext';
import { shouldRenderReviewGallery } from 'helpers/ReviewUtils';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { ReviewGalleryState } from 'reducers/reviews/reviewGallery';

import css from 'styles/components/productdetail/reviewPhotoGallery.scss';

interface Props {
  divClass?: string;
  id?: string;
  includeHr?: boolean;
  limit?: number;
  onOpenMediaReview: (...args: any[]) => void;
  placement?: string;
  reviewGallery?: ReviewGalleryState;
  showMediaCount: boolean;
}

export const ReviewPhotoGallery = ({
  divClass,
  id,
  includeHr,
  limit = 0,
  onOpenMediaReview,
  placement,
  reviewGallery,
  showMediaCount
}: Props) => {

  const { testId } = useMartyContext();

  if (!reviewGallery) {
    return null;
  }

  const { mediaList, imageCount, videoCount } = reviewGallery;

  const showViewAll = (videoCount! + imageCount!) > limit;

  const imageCountText = `${imageCount} ${pluralize('Image', imageCount)}`;
  const videoCountText = `${videoCount} ${pluralize('Video', videoCount)}`;
  return shouldRenderReviewGallery(reviewGallery) ? (
    <div id={id} className={divClass}>
      {includeHr && <hr />}
      <h3>Customer Photos and Videos</h3>
      <div className={css.reviewPhotoGallery}>
        {showMediaCount && <div className={css.imageAndVideoCount} data-test-id={testId('imageAndVideoCount')}>{imageCountText}, {videoCountText}</div>}
        <div className={css.imageAndVideoContainer}>
          <ReviewGalleryMediaGrid
            mediaList={mediaList}
            onOpenMediaReview={onOpenMediaReview}
            limit={limit}
            limitHeight={true}
            placementStyle={(placement === 'aisle') && css.galleryAislePlacement} />
        </div>
        {showViewAll
          ?
          <div className={cn(css.viewAllReviews, { [css.center]: placement === 'aisle' })}>
            <button
              type="button"
              onClick={() => onOpenMediaReview(null, null)}
              data-track-action="Product-Page"
              data-track-label="Customer-Feedback"
              data-track-value="Customer-Reviews-Review-Gallery"
              data-test-id={testId('customerReviewGallery')}>
            View All{placement === 'bottom' ? ' Customer Photos and Videos' : ''}
            </button>
          </div>
          : null
        }
      </div>
    </div>
  ) : null;
};

export default withErrorBoundary('ReviewPhotoGallery', ReviewPhotoGallery);
