import { css } from 'emotion';
import React from 'react';
import {
  LG_SCREEN_MIN,
  MD_SCREEN_MAX,
  MD_SCREEN_MIN,
  SM_SCREEN_MAX,
} from '../../modules/Styleguide';
import If from '../If';

// const getDimensionsFromImageFile = imageFileObj =>
//   new Promise((resolve, reject) => {
//     const fr = new FileReader();

//     fr.onload = function() {
//       // file is loaded
//       const img = new Image();

//       img.onload = function() {
//         resolve({ width: img.naturalWidth, height: img.naturalHeight });
//         // alert(img.width); // image is loaded; sizes are available
//       };

//       img.src = fr.result; // is the data URL because called with readAsDataURL
//     };

//     fr.readAsDataURL(imageFileObj); // I'm using a <input type="file"> for demonstrating
//   });

const noop = () => null;

interface ImageProps {
  renderLoadingPlaceholder: () => React.ReactNode;
  height?: number | string;
  width?: number | string;
  smWidth?: number | string;
  mdWidth?: number | string;
  lgWidth?: number | string;
  smHeight?: number | string;
  mdHeight?: number | string;
  lgHeight?: number | string;
  imageUrl: string;
  altText?: string;
  retinaImageUrl: string;
  objectFit: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}
interface ImageState {
  isImageLoaded: boolean;
}

const defaultProps = {
  retinaImageUrl: null,
  renderLoadingPlaceholder: noop,
  height: 'auto',
  width: '100%',
  objectFit: 'fill',
};

class Image extends React.Component<ImageProps, ImageState> {
  public static defaultProps = defaultProps;
  constructor(props: ImageProps) {
    super(props);
    this.state = {
      isImageLoaded: false,
    };
  }

  public handleImageLoaded = () => {
    this.setState(() => ({
      isImageLoaded: true,
    }));
  };

  public render() {
    const { isImageLoaded } = this.state;
    const {
      renderLoadingPlaceholder,
      height,
      width,
      imageUrl,
      objectFit,
      retinaImageUrl,
      altText,
      smWidth,
      mdWidth,
      lgWidth,
      smHeight,
      mdHeight,
      lgHeight,
    } = this.props;
    const smStyles: React.CSSProperties = {};
    const mdStyles: React.CSSProperties = {};
    const lgStyles: React.CSSProperties = {};
    if (width || smWidth || mdWidth || lgWidth) {
      smStyles.width = smWidth || width || 0;
      mdStyles.width = mdWidth || width || 0;
      lgStyles.width = lgWidth || width || 0;
    }
    if (height || smHeight || mdHeight || lgHeight) {
      smStyles.height = smHeight || height || 0;
      mdStyles.height = mdHeight || height || 0;
      lgStyles.height = lgHeight || height || 0;
    }
    const heightAndWidthStyle = {
      [`@media (max-width: ${SM_SCREEN_MAX}px)`]: {
        ...smStyles,
      },
      [`@media (min-width: ${MD_SCREEN_MIN}px) and (max-width: ${MD_SCREEN_MAX}px)`]: {
        ...mdStyles,
      },
      [`@media (min-width: ${LG_SCREEN_MIN}px)`]: {
        ...lgStyles,
      },
    };
    const rootClassName = css({
      display: 'inline-block',
      ...heightAndWidthStyle,
    });
    const imageContainerClassName = css({
      height,
      width,
      display: isImageLoaded ? 'block' : 'none',
    });
    const imageClassName = css({
      ...heightAndWidthStyle, // TODO: maybe just make this 100% width and height
      verticalAlign: 'top', // Why? https://stackoverflow.com/questions/5804256/image-inside-div-has-extra-space-below-the-image/5804278
      objectFit,
    });
    const loadingPlaceholderContainerClassName = css({
      display: 'inline-block',
      ...heightAndWidthStyle,
    });

    return (
      <div className={rootClassName}>
        <div className={imageContainerClassName}>
          <img
            srcSet={
              retinaImageUrl ? `${imageUrl} 1x, ${retinaImageUrl} 2x` : ''
            }
            src={imageUrl}
            alt={altText || ''}
            onLoad={() => {
              this.handleImageLoaded();
            }}
            className={imageClassName}
          />
        </div>
        {renderLoadingPlaceholder && (
          <div
            className={`${loadingPlaceholderContainerClassName}`}
            style={{
              display: isImageLoaded ? 'none' : 'block',
            }}
          >
            {renderLoadingPlaceholder()}
          </div>
        )}
      </div>
    );
  }
}

export { Image as default, Image };
