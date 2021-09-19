/* eslint-disable jsx-a11y/anchor-is-valid */
// unsure why TS is yelling at me for this, no changes made /shrug
import React, { Component } from 'react';
import cn from 'classnames';

import { A11Y_IMAGE_TRANSLATIONS, DESKTOP_PDP_VIDEO } from 'constants/appConstants';
import ImageZoom from 'components/productdetail/ImageZoom';
import { Video as VideoIcon } from 'components/icons';
import ImageLazyLoader from 'components/common/ImageLazyLoader';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';
import { constructMSAImageUrl } from 'helpers/index.js';
import ProductUtils from 'helpers/ProductUtils';
import { ProductStyle, ProductVideo } from 'types/cloudCatalog';
import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/desktopImageCarousel.scss';

const { buildAngleThumbnailImages, MAIN_IMAGE_PARAMS, generateRetinaImageParams } = ProductUtils;

const productViewTypes = {
  'PAIR': 'both shoes',
  'TOPP': 'top',
  'BOTT': 'bottom',
  'LEFT': 'left',
  'BACK': 'back',
  'RGHT': 'right',
  'FRNT': 'front'
};

interface Props {
  closeSpotlight: () => void;
  hydraBlueSkyPdp: boolean;
  isSpotlightActive: boolean;
  isYouTubeVideo: boolean;
  makeSpotlight: () => React.ReactNode;
  onProductImageClick?: (lowResImageSrc: string, hiResImageSrc: string, lowResImageWidth: number, lowResImageHeight: number, mouseCoordinates: {
    pageX: number;
    pageY: number;
  }) => void;
  onThumbnailClick: () => void;
  style: ProductStyle;
  videos: ProductVideo[];
  youtubeSrc: string | undefined;
}

interface State {
  currentSlide: number | 'video';
}
class DesktopImageCarousel extends Component<Props, State> {
  state: State = {
    currentSlide: 0
  };

  componentDidUpdate(prevProps: Props) {
    const { style } = this.props;
    const { style: prevStyle } = prevProps;
    if (prevStyle !== style) {
      const { currentSlide } = this.state;
      const images = this.getMsaImages(style);
      if (currentSlide === 'video' || typeof images[currentSlide] === 'undefined') {
        this.setState({ currentSlide: 0 });
      }
    }
  }

  onSlideChange = (slideIndex: number | 'video', event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.setState({ currentSlide: slideIndex });
  };

  getMsaImages = (style: ProductStyle) => style.images;

  handleThumbnailClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onThumbnailClick } = this.props;
    const dataIndex = event.currentTarget.getAttribute('data-index');
    if (dataIndex) {
      const index = parseInt(dataIndex, 10);
      this.setState({ currentSlide: index });
      onThumbnailClick();
    }
  };

  makeAccessLabel(type: string, index: number, length: number) {
    const productView = productViewTypes[type as keyof typeof productViewTypes] || index;
    return `View ${productView}, ${index} of ${length}`;
  }

  makeThumbnailImg = ({
    image,
    imageNumber,
    totalImages
  }: {
    image: {
      filename: string;
      imageId: string;
      type: string;
    };
    imageNumber: number;
    totalImages: number;
  }) => {
    const { type, filename } = image;
    const src = filename;
    const loaderProps = {
      imgProps: { alt: A11Y_IMAGE_TRANSLATIONS[type as keyof typeof A11Y_IMAGE_TRANSLATIONS] || `View #${imageNumber} of #${totalImages}`, src },
      placeholder: <div className={css.thumbnailPlaceholder} />
    };
    return <ImageLazyLoader {...loaderProps} />;
  };

  makeVideoPlayer = (
    slotDetails: {
      src: string | undefined;
      productId: string;
      componentName: string;
      autoplay: boolean;
    },
    isYouTubeVideo: boolean
  ) => (
    <div className={css.productVideoContainer}>
      <MelodyVideoPlayer
        slotDetails={slotDetails}
        isYouTubeVideo={isYouTubeVideo}
        heightValue={'270px'} />
    </div>
  );

  render() {
    const {
      props: {
        closeSpotlight,
        hydraBlueSkyPdp,
        isSpotlightActive,
        isYouTubeVideo,
        makeSpotlight,
        onProductImageClick,
        style,
        videos,
        youtubeSrc
      },
      state: { currentSlide }
    } = this;
    const { productId } = style;
    const msaImages = buildAngleThumbnailImages(style, 106, 78);
    const video = videos && videos.length ? videos.find(video => video.videoEncodingExtension === 'mp4') : undefined;

    const msaNumberOfImages = msaImages.length;
    return (
      <MartyContext.Consumer>
        {({ testId, marketplace: { desktopBaseUrl } }) => {
          const videoSrcUrl = isYouTubeVideo ? youtubeSrc : video && video.filename ? `${desktopBaseUrl}${video.filename}` : undefined;
          const slotDetails = {
            src: videoSrcUrl,
            productId,
            componentName: DESKTOP_PDP_VIDEO,
            autoplay: true
          };

          return (
            <div className={cn(css.imageCarousel, { [css.blueSky]: hydraBlueSkyPdp })}>
              <ul id="thumbnailsList" className={css.thumbnailsList}>
                {msaImages.map((image, index) => (
                  <li key={`${image.imageId}-${index}`}>
                    <a
                      href={image?.filename}
                      data-index={index}
                      className={cn(css.thumbnail, { [css.active]: currentSlide === index })}
                      onClick={this.handleThumbnailClick}
                      data-test-id={testId('desktopImageThumbnail')}
                      aria-current={currentSlide === index}
                      aria-label={this.makeAccessLabel(msaImages[index].type, index, msaImages.length)}>
                      {this.makeThumbnailImg({ image, imageNumber: index + 1, totalImages: msaNumberOfImages })}
                    </a>
                  </li>
                ))}
                {video && (
                  <li>
                    <a
                      href={videoSrcUrl}
                      className={cn(css.videoThumbnail, { [css.active]: currentSlide === 'video' })}
                      onClick={this.onSlideChange.bind(null, 'video')}
                      data-test-id={testId('desktopVideoThumbnail')}
                      aria-current={currentSlide === 'video'}
                      aria-label="View product video"
                    >
                      <span className={css.videoIcon}>
                        <VideoIcon/> Video
                      </span>
                    </a>
                  </li>
                )}
              </ul>
              <div className={css.productImageContainer}>
                <div className={css.productImage}>
                  <div className={css.slider}>
                    {currentSlide !== 'video' && msaImages[currentSlide] && (
                      <ImageZoom
                        altText={A11Y_IMAGE_TRANSLATIONS[(msaImages[currentSlide].type as keyof typeof A11Y_IMAGE_TRANSLATIONS)] || 'Product Image'}
                        closeSpotlight={closeSpotlight}
                        hiResImageSrc={constructMSAImageUrl(msaImages[currentSlide].imageId, generateRetinaImageParams(MAIN_IMAGE_PARAMS, 3))}
                        isSpotlightActive={isSpotlightActive}
                        lowResImageSrc={constructMSAImageUrl(msaImages[currentSlide].imageId, MAIN_IMAGE_PARAMS)}
                        retinaImageSrc2x={constructMSAImageUrl(msaImages[currentSlide].imageId, generateRetinaImageParams(MAIN_IMAGE_PARAMS, 2))}
                        onProductImageClick={onProductImageClick}
                      />
                    )}
                    {(video && currentSlide === 'video') ? this.makeVideoPlayer(slotDetails, isYouTubeVideo) : null}
                  </div>
                  {makeSpotlight()}
                </div>
              </div>
            </div>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

export default DesktopImageCarousel;
