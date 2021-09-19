import React, { FunctionComponent, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { EmblaCarouselType } from 'embla-carousel/vanilla';

import useWindowSize from 'hooks/useWindowSize';
import useMartyContext from 'hooks/useMartyContext';
import { getPDPTrackingPropsFormatted, PDP_GALLERY_CONFIG } from 'helpers/ProductUtils';
import { PDPCarouselRef, PDPFeaturedImage, PDPFeaturedVideo } from 'types/product';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import videoThumbnail from 'images/videoThumbnail.svg';

import css from 'styles/components/productdetail/productGallery/productGalleryThumbnails.scss';

interface NavArrowProps {
  label: string;
  zoomIsActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

/**
 * PDP Assets gallery thumbnails carousel arrow controls
 * @returns {FunctionComponent}
 */
const NavArrow: FunctionComponent<NavArrowProps> = ({
  label,
  zoomIsActive,
  onClick
}) => {
  const { testId } = useMartyContext();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-test-id={testId('imageAngleScrollButton')}
      className={cn(css.nav, { [css.zoomMode] : zoomIsActive })}
      {...getPDPTrackingPropsFormatted(`Arrow-${label}`, 'Button-Click')}
    />
  );
};

interface ThumbnailImageProps {
  image: PDPFeaturedImage;
}

/**
 * PDP Assets gallery thumbnail image
 * @returns {FunctionComponent}
 */
const ThumbnailImage: FunctionComponent<ThumbnailImageProps> = ({
  image
}) => (
  <img
    alt={image.alt}
    src={image.thumbnail.src}
    srcSet={image.thumbnail.retinaSrc}
  />
);

interface ThumbnailVideoProps {
  video: PDPFeaturedVideo;
}

/**
 * PDP Assets gallery thumbnail image
 * @returns {FunctionComponent}
 */
const ThumbnailVideo: FunctionComponent<ThumbnailVideoProps> = ({
  video
}) => (
  <img
    alt={video.alt}
    src={videoThumbnail}
  />
);

interface Props {
  zoomIsActive: boolean;
  selectedAsset: number;
  productAssets: (PDPFeaturedImage | PDPFeaturedVideo)[];
  productThumbnailsRef: PDPCarouselRef;
  productFeaturedCarousel: EmblaCarouselType | undefined;
  productThumbnailsCarousel: EmblaCarouselType | undefined;
  hasHorizontalThumbnails?: boolean;
}

/**
 * PDP Assets gallery thumbnails container (carousel controls + thumbnail image + thumbnails video)
 * @returns {FunctionComponent}
 */
const ProductGalleryThumbnails: FunctionComponent<Props> = ({
  zoomIsActive,
  selectedAsset,
  productAssets,
  productThumbnailsRef,
  productThumbnailsCarousel,
  productFeaturedCarousel,
  hasHorizontalThumbnails
}) => {
  const { testId } = useMartyContext();

  // === CAROUSEL CONFIG
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  useEffect(() => {
    if (windowHeight && windowWidth && productThumbnailsCarousel) {
      const debounced = debounce(() => {
        productThumbnailsCarousel.reInit({
          loop: false,
          selectedClass: '',
          containScroll: 'keepSnaps',
          // Variable settings
          axis: windowWidth > PDP_GALLERY_CONFIG.carouselThreshold && !hasHorizontalThumbnails ? 'y' : 'x', // View port determines vertical/horizontal thumbs
          speed: zoomIsActive || windowWidth > PDP_GALLERY_CONFIG.carouselThreshold ? 20 : 100, // 1: slowest 100: instant
          draggable: zoomIsActive || windowWidth > PDP_GALLERY_CONFIG.carouselThreshold // View port determines dragging
        });
      }, 250);
      debounced();
    }
  }, [windowHeight, windowWidth, zoomIsActive, productThumbnailsCarousel, hasHorizontalThumbnails]);

  // ==== CAROUSEL EVENTS
  const [isReady, setIsReady] = useState(false);
  const onInit = useCallback(() => setTimeout(() => setIsReady(true), 750), []);
  productThumbnailsCarousel?.on('init', onInit);

  // Whether or not the arrows should be displayed
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const checkArrowsNeeded = () => {
    if (windowWidth && productThumbnailsCarousel) {
      const scroll = productThumbnailsCarousel.scrollProgress();
      if (Math.abs(scroll) !== Infinity) {
        setShowNext(scroll < .95);
        setShowPrev(scroll > .05);
      }
    }
  };
  productThumbnailsCarousel?.on('reInit', checkArrowsNeeded);
  productThumbnailsCarousel?.on('scroll', checkArrowsNeeded);
  productThumbnailsCarousel?.on('resize', checkArrowsNeeded);

  // When the thumbnail is selected, the correspondent featured item is selected as well
  const onThumbnailSelect = (index: number) => productFeaturedCarousel?.scrollTo(index);

  return (
    <div
      id="productThumbnails"
      className={cn(css.productThumbnails, { [css.zoomMode] : zoomIsActive, [css.horizontal]: hasHorizontalThumbnails })}
    >
      <div className={css.carousel} ref={productThumbnailsRef}>
        <ul className={cn(css.slides, { [css.zoomMode] : zoomIsActive, [css.mounting] : !isReady })}>
          {productAssets.map((asset, index) => (
            <li className={css.slide} key={index}>
              <button
                type="button"
                aria-label={asset.alt}
                aria-current={selectedAsset === asset.index}
                onClick={() => onThumbnailSelect(asset.index)}
                data-media={asset.type}
                data-test-id={testId(`${asset.type}Thumbnail`)}
                className={cn(css.slideThumb, { [css.zoomMode] : zoomIsActive })}
                {...getPDPTrackingPropsFormatted(`Thumbnail-${asset.type}`, `${asset.type}-Click`)}
              >
                {'thumbnail' in asset ? (
                  <ThumbnailImage image={asset} />
                ) : (
                  <ThumbnailVideo video={asset} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showPrev && <NavArrow
        label={'previous'}
        zoomIsActive={zoomIsActive}
        onClick={() => productThumbnailsCarousel?.scrollTo(productThumbnailsCarousel.selectedScrollSnap() - productThumbnailsCarousel.slidesInView().length)}/>}
      {showNext && <NavArrow
        label={'next'}
        zoomIsActive={zoomIsActive}
        onClick={() => productThumbnailsCarousel?.scrollTo(productThumbnailsCarousel.selectedScrollSnap() + productThumbnailsCarousel.slidesInView().length)} />}
    </div>
  );
};

export default withErrorBoundary('ProductGalleryThumbnails', ProductGalleryThumbnails);
