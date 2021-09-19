import React, { Component } from 'react';
import cn from 'classnames';

import { onEvent } from 'helpers/EventHelpers';
import { MartyContext } from 'utils/context';

import css from 'styles/components/productdetail/imageZoom.scss';

interface Props {
  altText: string;
  closeSpotlight: () => void;
  hiResImageSrc: string;
  isSpotlightActive: boolean;
  lowResImageSrc: string;
  onProductImageClick?: (lowResImageSrc: string, hiResImageSrc: string, lowResImageWidth: number, lowResImageHeight: number, mouseCoordinates: {
    pageX: number;
    pageY: number;
  }) => void;
  retinaImageSrc2x: string;
}

interface State {
  width: number;
  height: number;
  hasLoaded: boolean;
}

class ImageZoom extends Component<Props, State> {
  state = {
    width: 0,
    height: 0,
    hasLoaded: false
  };

  componentDidMount = () => {
    if (this.image && this.image.complete && !this.state.hasLoaded) {
      // If image is cached by browser it won't fire the standard onload event, so we need to manually do it
      this.handleOnLoad();
    }
  };

  outerEl: HTMLElement | null | undefined;
  image: HTMLImageElement | null | undefined;

  handleGlobalClick = (event: MouseEvent) => {
    const {
      outerEl,
      props: {
        closeSpotlight,
        hiResImageSrc,
        isSpotlightActive,
        lowResImageSrc,
        onProductImageClick
      },
      state: {
        hasLoaded,
        height,
        width
      }
    } = this;

    if (outerEl && hasLoaded) {
      const mouseCoordinates = { pageX: event.pageX, pageY: event.pageY };
      const isLocalClick = outerEl.contains(event.target as Node);
      if (onProductImageClick) {
        if (isSpotlightActive) {
          closeSpotlight();
        } else if (isLocalClick) {
          onProductImageClick(lowResImageSrc, hiResImageSrc, width, height, mouseCoordinates);
        }
      }
    }
  };

  handleOnLoad = () => {
    if (this.image) {
      onEvent(document, 'click', this.handleGlobalClick, undefined, this);
      const { width, height } = this.image;
      this.setState({ width, height, hasLoaded: true });
    }
  };

  makeImg = () => {
    const {
      props: { lowResImageSrc, altText: alt, retinaImageSrc2x },
      handleOnLoad
    } = this;
    return (
      <img
        src={lowResImageSrc}
        srcSet={`${retinaImageSrc2x} 2x`}
        className={css.image}
        alt={alt}
        onLoad={handleOnLoad}
        ref={el => this.image = el} />
    );
  };

  render() {
    const { makeImg, props: { isSpotlightActive, onProductImageClick } } = this;
    return (
      <MartyContext.Consumer>
        {({ testId }) => (
          <button
            type="button"
            className={cn(css.button, { [css.disabledSpotlight]: !onProductImageClick })}
            tabIndex={isSpotlightActive ? -1 : 0}
            aria-label="Zoom into product image"
            data-test-id={testId('imageZoom')}
            ref={el => this.outerEl = el}>
            {makeImg()}
          </button>
        )}
      </MartyContext.Consumer>
    );
  }
}

export default ImageZoom;
