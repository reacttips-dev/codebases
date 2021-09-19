import React, { Component } from 'react';
import loadable from '@loadable/component';

import { trackLegacyEvent } from 'helpers/analytics';
import MelodyCarousel from 'components/common/MelodyCarousel';
import ImageLazyLoader from 'components/common/ImageLazyLoader';
import DesktopImageCarousel from 'components/productdetail/DesktopImageCarousel';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { A11Y_IMAGE_TRANSLATIONS } from 'constants/appConstants';
import { ProductStyle, ProductVideo } from 'types/cloudCatalog';
import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/productImages.scss';

const MobileImageZoom = loadable(() => import('components/productdetail/MobileImageZoom'));

interface Props {
  carouselIndex?: number;
  closeSpotlight: () => void;
  colorId: string | undefined;
  hydraBlueSkyPdp: boolean;
  id: string;
  images: Image[];
  isSpotlightActive: boolean;
  isYouTubeVideo: boolean;
  makeSpotlight: () => React.ReactNode;
  onProductImageClick?: (lowResImageSrc: string, hiResImageSrc: string, lowResImageWidth: number, lowResImageHeight: number, mouseCoordinates: {
    pageX: number;
    pageY: number;
  }) => void;
  onStyleChange?: (event: React.MouseEvent<Element>) => void;
  onThumbnailClick: () => void;
  productId: string;
  reconfigureCarousel: boolean;
  styleId: string;
  style: ProductStyle;
  videos: ProductVideo[];
  youtubeSrc: string | undefined;
}

interface State {
  isZoomOpen: boolean;
  imageId: string;
  type: string;
}

interface Image {
  filename: string;
  retinaSrc: string;
  imageId: string;
  type: string;
}

const productImageTypeAlt = (type: string) => A11Y_IMAGE_TRANSLATIONS[type as keyof typeof A11Y_IMAGE_TRANSLATIONS] || 'Product View';
export class ProductImages extends Component<Props, State> {

  state: State = {
    isZoomOpen: false,
    imageId: '',
    type: ''
  };

  showImageZoom = (imageId: string, type: string) => {
    this.setState({ isZoomOpen: true, imageId, type });
  };

  hideImageZoom = () => {
    this.setState({ isZoomOpen: false, imageId: '', type: '' });
  };

  onImageChange = () => {
    trackLegacyEvent('Product-Page', 'PrImage', 'Thumbnail-Swap-Click');
  };

  makeImage = (src: string, shouldForceLoad: boolean, type: string, retinaSrc: string) => {
    const { testId } = this.context;
    const imgProps = {
      'data-track-action': 'Product-Page',
      'data-track-label': 'Zoom-In',
      'data-track-value': 'Image-Click',
      'alt': productImageTypeAlt(type),
      'data-test-id': testId('mobileProductImageDetails'),
      src,
      'srcSet': `${retinaSrc} 2x`
    };
    return <ImageLazyLoader
      imgProps={imgProps}
      shouldStartLoading={true}
      forceLoad={shouldForceLoad}
      productImages={true}
    />;
  };

  makeImageCarousel = (images: Image[], videos: ProductVideo[]) => {
    const {
      carouselIndex,
      closeSpotlight,
      hydraBlueSkyPdp,
      id,
      isSpotlightActive,
      isYouTubeVideo,
      makeSpotlight,
      onThumbnailClick,
      onProductImageClick,
      reconfigureCarousel,
      style,
      youtubeSrc
    } = this.props;
    const returnArrowOverrideObj = { display: 'none' };
    if (images && images.length > 0) {
      return (
        <div id={id}>
          <div className={css.mobileCarousel}>
            <MelodyCarousel
              afterSlide={this.onImageChange}
              showDots={true}
              arrowStyleOverrides={returnArrowOverrideObj}
              slideIndex={carouselIndex}
              reconfigure={reconfigureCarousel}
              reconfigureNonce={style.styleId}
            >
              {images.filter(({ type }) => type !== 'SWATCH').map(this.makeImageButton)}
            </MelodyCarousel>
          </div>
          <div className={css.desktopCarousel}>
            <DesktopImageCarousel
              closeSpotlight={closeSpotlight}
              isSpotlightActive={isSpotlightActive}
              isYouTubeVideo={isYouTubeVideo}
              makeSpotlight={makeSpotlight}
              onProductImageClick={onProductImageClick}
              onThumbnailClick={onThumbnailClick}
              style={style}
              videos={videos}
              youtubeSrc={youtubeSrc}
              hydraBlueSkyPdp={hydraBlueSkyPdp}
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  makeImageButton = ({ imageId, filename, retinaSrc, type }: Image, index: number) => {
    const {
      makeImage,
      showImageZoom
    } = this;

    const { testId } = this.context;

    return (
      <div key={index} className={css.mobileCarouselElement}>
        <button
          type="button"
          className={css.mobileCarouselButton}
          data-test-id={testId('productImageButton')}
          onClick={() => showImageZoom(imageId, type)}
        >
          {makeImage(filename, index === 0, type, retinaSrc)}
        </button>
      </div>
    );
  };

  render() {
    const { images, videos } = this.props;
    const { imageId, isZoomOpen, type } = this.state;
    const imageMicroFormat = images && images.length > 0 ? <meta itemProp="image" content={images[0].filename}/> : null;
    return (
      <MartyContext.Consumer>
        {context => {
          this.context = context;
          const { testId } = context;

          return (
            <div className={css.productImages} data-test-id={testId('productImages')}>
              {imageMicroFormat}
              {this.makeImageCarousel(images, videos)}
              {isZoomOpen &&
                <MobileImageZoom
                  alt={productImageTypeAlt(type)}
                  imageId={imageId}
                  isOpen={isZoomOpen}
                  onClose={this.hideImageZoom}
                />
              }
            </div>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

export default withErrorBoundary('ProductImages', ProductImages);
