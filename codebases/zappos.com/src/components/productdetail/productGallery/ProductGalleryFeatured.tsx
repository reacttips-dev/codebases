import React, { Dispatch, FunctionComponent, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { EmblaCarouselType } from 'embla-carousel/vanilla';

import useWindowSize from 'hooks/useWindowSize';
import useMartyContext from 'hooks/useMartyContext';
import { getPDPTrackingPropsFormatted, PDP_GALLERY_CONFIG } from 'helpers/ProductUtils';
import { PDPCarouselRef, PDPFeaturedImage, PDPFeaturedVideo } from 'types/product';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import { ImageFeaturedZoom } from 'components/productdetail/productGallery/ProductGalleryZoomController';

import css from 'styles/components/productdetail/productGallery/productGalleryFeatured.scss';

interface ImageFeaturedProps {
  image: PDPFeaturedImage;
  zoomIsActive: boolean;
  isSelected: boolean;
  showInstructions: boolean;
  setShowInstructions: Dispatch<React.SetStateAction<boolean>>;
}

/**
 * PDP Assets gallery featured image container with a11y
 * @returns {FunctionComponent}
 */
const ImageFeatured: FunctionComponent<ImageFeaturedProps> = ({
  image,
  zoomIsActive,
  isSelected,
  showInstructions,
  setShowInstructions
}) => {
  if (!isSelected) {
    return null;
  }
  if (zoomIsActive) {
    return <ImageFeaturedZoom image={image} showInstructions={showInstructions} setShowInstructions={setShowInstructions} />;
  }
  return (
    <img
      alt={image.alt}
      src={image.featured.src}
      srcSet={image.featured.retinaSrc} />
  );
};

interface VideoFeaturedProps {
  video: PDPFeaturedVideo;
  isSelected: boolean;
}

/**
 * PDP Assets gallery featured video container with a11y
 * @returns {FunctionComponent}
 */
const VideoFeatured: FunctionComponent<VideoFeaturedProps> = ({
  video,
  isSelected
}) => <>{isSelected && <MelodyVideoPlayer {...video}/>}</>;

interface Props {
  zoomIsActive: boolean;
  setZoomIsActive: Dispatch<React.SetStateAction<boolean>>;
  selectedAsset: number;
  productAssets: (PDPFeaturedImage | PDPFeaturedVideo)[];
  setSelectedAsset: Dispatch<React.SetStateAction<number>>;
  productFeaturedRef: PDPCarouselRef;
  productFeaturedCarousel: EmblaCarouselType | undefined;
  productThumbnailsCarousel: EmblaCarouselType | undefined;
}

/**
 * PDP Assets gallery featured container (featured image + featured video)
 * @returns {FunctionComponent}
 */
const ProductGalleryFeatured: FunctionComponent<Props> = ({
  zoomIsActive,
  setZoomIsActive,
  productAssets,
  selectedAsset,
  setSelectedAsset,
  productFeaturedRef,
  productFeaturedCarousel,
  productThumbnailsCarousel
}) => {
  const { testId } = useMartyContext();

  // Controls the zoom instructions message
  const [showInstructions, setShowInstructions] = useState(true);

  // === CAROUSEL CONFIG
  const { width: windowWidth } = useWindowSize();
  useEffect(() => {
    if (windowWidth && productFeaturedCarousel) {
      productFeaturedCarousel.reInit({
        loop: true,
        speed: 100,
        selectedClass: '',
        // Variable settings
        draggable: !zoomIsActive && windowWidth <= PDP_GALLERY_CONFIG.carouselThreshold
      });
    }
  }, [windowWidth, zoomIsActive, productFeaturedCarousel, selectedAsset]);

  // ==== CAROUSEL EVENTS
  const onFeaturedSelect = useCallback(() => {
    // When the asset in the featured section is selected, the correspondent thumbnail is selected as well
    if (productFeaturedCarousel && productThumbnailsCarousel) {
      setSelectedAsset(productFeaturedCarousel.selectedScrollSnap());
      productThumbnailsCarousel.scrollTo(productFeaturedCarousel.selectedScrollSnap());
    }
  }, [productFeaturedCarousel, productThumbnailsCarousel, setSelectedAsset]);
  productFeaturedCarousel?.on('select', onFeaturedSelect);

  return (
    <div
      id="productFeatured"
      className={css.productFeatured}
    >
      <div className={css.carousel} ref={productFeaturedRef}>
        <ul className={css.slides}>
          {productAssets.map((asset, index) => {
            const isSelected = selectedAsset === asset.index;
            return (
              <li className={css.slide} key={index}>
                <button
                  type="button"
                  aria-label={`${asset.alt} Zoom`}
                  aria-current={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setZoomIsActive(isSelected)}
                  data-media={asset.type}
                  data-test-id={testId(`${asset.type}Featured`)}
                  className={cn(css.slideFeatured, { [css.zoomMode] : zoomIsActive })}
                  {...getPDPTrackingPropsFormatted('Zoom-In', `${asset.type}-Click`)}
                >
                  {'thumbnail' in asset ? (
                    <ImageFeatured
                      image={asset}
                      isSelected={isSelected}
                      zoomIsActive={zoomIsActive}
                      showInstructions={showInstructions}
                      setShowInstructions={setShowInstructions} />
                  ) : (
                    <VideoFeatured video={asset} isSelected={isSelected} />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default withErrorBoundary('ProductGalleryFeatured', ProductGalleryFeatured);
