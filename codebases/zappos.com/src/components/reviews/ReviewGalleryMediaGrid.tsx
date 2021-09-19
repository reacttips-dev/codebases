import React from 'react';
import cn from 'classnames';

import ReviewGalleryMediaGridElement from 'components/reviews/ReviewGalleryMediaGridElement';
import { SmallLoader } from 'components/Loader';
import { MediaListMedia } from 'reducers/reviews/reviewGallery';

import css from 'styles/components/reviews/reviewGalleryMediaGrid.scss';

const makeReviewGalleryMediaGridElement = ({ compactThumbnails, onOpenMediaReview, showVideoThumbnails }: Props, mediaItem: MediaListMedia) => (
  <ReviewGalleryMediaGridElement
    key={mediaItem.url}
    compact={compactThumbnails}
    mediaIndex={mediaItem.mediaIndex}
    mediaItem={mediaItem}
    onOpenMediaReview={onOpenMediaReview}
    showVideoThumbnails={showVideoThumbnails}
    reviewId={mediaItem.reviewId}
  />
);

function makeMedia(props: Props) {
  const { mediaList } = props;
  return mediaList.map(item => makeReviewGalleryMediaGridElement(props, item));
}

interface Props {
  compactThumbnails?: boolean;
  isLoading?: boolean;
  limit?: number;
  limitHeight?: boolean;
  mediaList: MediaListMedia[];
  onOpenMediaReview: (reviewId: string, mediaIndex: number) => void;
  placementStyle?: string;
  productId?: string;
  showVideoThumbnails?: boolean;
}

const ReviewGalleryMediaGrid = (props: Props) => {
  const { isLoading, limit, limitHeight = false, placementStyle = '' } = props;

  const allMedia = makeMedia(props);
  const shownMedia = limit ? allMedia.slice(0, limit) : allMedia;
  return (
    <div className={cn(css.overlayImagesContainer, { [css.limitHeight]: limitHeight }, { [css.loadingMedia]: isLoading })}>
      {isLoading && <SmallLoader/>}
      {!isLoading && <div className={cn(css.reviewsImagesAndVideos, { [placementStyle]: !!placementStyle })}>
        {shownMedia}
      </div>}
    </div>
  );
};

export default ReviewGalleryMediaGrid;
