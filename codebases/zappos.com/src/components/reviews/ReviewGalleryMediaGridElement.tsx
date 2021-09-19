import React, { useCallback } from 'react';
import cn from 'classnames';

import { IMAGE, MSA_CC_IMAGES_URL, UPLOADED_BY_REVIEWER_ALT_TEXT, VIDEO } from 'constants/appConstants';
import { LazyBackgroundImage } from 'components/common/BackgroundImage';
import { MSA_IMAGE_ID_FROM_URL } from 'common/regex';
import { constructMSAImageUrl } from 'helpers/index.js';
import useMartyContext from 'hooks/useMartyContext';
import { logError } from 'middleware/logger';

import css from 'styles/components/reviews/reviewGalleryMediaGridElement.scss';

interface VideoThumbnailWithPosterProps {
  url: string;
  label: string | undefined;
  onClick: () => void;
}

// videos shouldn't be nested under buttons, so do some shenanigans to overlay the button on top
export const VideoThumbnailWithPoster = ({ url, label, onClick }: VideoThumbnailWithPosterProps) => (
  <div className={css.videoThumbnailWithPoster}>
    <video className={css.image} src={url} preload="metadata"/>
    <button
      type="button"
      className={cn(css.imageButton, css.playVideoImgOverlay)}
      aria-label={label}
      onClick={onClick}
    >
      <span className={css.playVideoButton} />
    </button>
  </div>
);

interface VideoThumbnailWithoutPosterProps {
  label: string | undefined;
  onClick: () => void;
}

export const VideoThumbnailWithoutPoster = ({ label, onClick }: VideoThumbnailWithoutPosterProps) => (
  <button
    type="button"
    className={css.imageButton}
    onClick={onClick}
    aria-label={label}
  >
    <span className={css.videoPlaceholder}>
      <span className={css.playVideoButton} />
    </span>
  </button>
);

interface ImageThumbnailProps {
  src: string;
  label: string | undefined;
  onClick: () => void;
}

export const ImageThumbnail = ({ src, label, onClick }: ImageThumbnailProps) => {
  const { testId } = useMartyContext();
  const imageId = src.match(MSA_IMAGE_ID_FROM_URL)![0];
  const imgSrc = constructMSAImageUrl(imageId, { width: 220 }, MSA_CC_IMAGES_URL);

  const placeholder = <div className={css.placeholder} />;
  return (
    <button
      type="button"
      className={css.imageButton}
      onClick={onClick}
      aria-label={label}
    >
      <LazyBackgroundImage
        className={css.image}
        data-test-id={testId('reviewerMedia')}
        placeholder={placeholder}
        src={imgSrc}
        alt={UPLOADED_BY_REVIEWER_ALT_TEXT}
        forceLoad={false}
      />
    </button>
  );
};

function makeMediaElement({ mediaItem, showVideoThumbnails }: Props, buttonOnClick: () => void) {
  const { label, type, url } = mediaItem;
  if (type === IMAGE) {
    return <ImageThumbnail src={url} label={label} onClick={buttonOnClick} />;
  } else if (type === VIDEO) {
    return showVideoThumbnails
      ? <VideoThumbnailWithPoster onClick={buttonOnClick} url={url} label={label}/>
      : <VideoThumbnailWithoutPoster onClick={buttonOnClick} label={label}/>;
  }
  logError(`only IMAGE and VIDEO media are currently supported (attempted to render item with mediaType ${type})`);
  return null;
}

interface Props {
  compact?: boolean;
  imageBaseUrl?: string;
  mediaIndex: number;
  mediaItem: {
    url: string;
    type: string;
    label: string | undefined;
  };
  onOpenMediaReview: (reviewId: string, mediaIndex: number) => void;
  reviewId: string;
  showVideoThumbnails?: boolean;
}

function ReviewGalleryMediaGridElement(props: Props) {
  const { compact = false, onOpenMediaReview, mediaIndex, reviewId } = props;
  const buttonOnClick = useCallback(() => onOpenMediaReview(reviewId, mediaIndex), [mediaIndex, onOpenMediaReview, reviewId]);
  return (
    <span className={cn(css.carouselChild, { [css.compact]: compact })}>
      {makeMediaElement(props, buttonOnClick)}
    </span>
  );
}

ReviewGalleryMediaGridElement.defaultProps = {
  compact: false
};

export default ReviewGalleryMediaGridElement;
