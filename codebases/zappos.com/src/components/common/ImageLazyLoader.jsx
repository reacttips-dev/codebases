import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { SmallLoader } from 'components/Loader';
import { LazyImage } from 'components/common/Image';
import NoScript from 'components/common/NoScript';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/imageLazyLoader.scss';

const Image = ({ src, hydraImagesByZycada, ...rest }) => {
  const { marketplace : { msaImagesUrlZycada, msaImagesUrl } } = useMartyContext();
  const newSrc = hydraImagesByZycada && msaImagesUrlZycada && src ? src.replace(msaImagesUrl, msaImagesUrlZycada) : src;
  return <LazyImage src={newSrc} {...rest} />;
};
class ImageLazyLoader extends Component {

  state = {};

  componentDidMount() {
    this.setState({ jsEnabled: true });
  }

  render() {
    const {
      props: {
        imgProps,
        placeholder,
        className = '',
        pictureProps,
        forceLoad,
        hydraImagesByZycada,
        imageLoadedCallback
      },
      state: { jsEnabled }
    } = this;

    const img = <Image
      {...imgProps}
      onLoad={imageLoadedCallback}
      forceLoad={forceLoad}
      placeholder={placeholder}
      hydraImagesByZycada={hydraImagesByZycada} />;

    if (jsEnabled) {
      if (pictureProps.length) {// no span returned because of landing page component content box positioning;
        return (
          <picture>
            {pictureProps}
            {img}
          </picture>
        );
      }
      return <span>{img}</span>;// span is needed for the OOS modal
    }
    return <span className={cn(css.lazyLoader, className)}>
      <NoScript>
        <img alt="" {...imgProps} />
      </NoScript>
    </span>;
  }
}

ImageLazyLoader.defaultProps = {
  loadThreshold: 1,
  placeholder: <SmallLoader />,
  pictureProps: [],
  forceLoad: false
};

ImageLazyLoader.propTypes = {
  /** these are the props passed to the nested image. you can put anything you want here. */
  imgProps: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
  }).isRequired,

  /** optional className to pass down to containing span */
  className: PropTypes.string,

  /** what to render while the image is loading */
  placeholder: PropTypes.object,

  /** load all images above `loadThreshold * the height of the viewport` */
  loadThreshold: PropTypes.number,

  /** just force render the image tag right away. essentially turns off lazyloading while maintaing the same markup. */
  forceLoad: PropTypes.bool,

  /** make an optional picture element with srcSet. needed for landing pages */
  pictureProps: PropTypes.array,

  hydraImagesByZycada: PropTypes.bool, // just a temporary hydra flag for testing a different msa image source

  imageLoadedCallback: PropTypes.func // function pointer to tell the parent component when the image has loaded.
};

export default ImageLazyLoader;
