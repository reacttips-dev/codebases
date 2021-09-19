import PropTypes from 'prop-types';

import LandingPageImage from 'components/landing/LandingPageImage';
import MelodyVideoPlayer from 'components/common/melodyVideo/MelodyVideoPlayer';

const LandingPageMedia = ({ type, sources, src, srcset, alt, poster, autoplay, loop, embeddedRatio, shouldLazyLoad, isEmbedded, tracks, ...otherProps }) => {
  if (type === 'image') {
    return <LandingPageImage
      {...otherProps}
      sources={sources}
      src={src}
      srcset={srcset}
      alt={alt}
      shouldLazyLoad={shouldLazyLoad}
    />;
  } else if (type === 'video') {
    const slotDetails = { src, poster, isEmbedded, autoplay, loop, embeddedRatio, tracks };
    return <MelodyVideoPlayer
      {...otherProps}
      slotDetails={slotDetails}
      shouldLazyLoad={shouldLazyLoad}
    />;
  } else {
    return null;
  }
};

LandingPageMedia.propTypes = {
  type: PropTypes.oneOf(['image', 'video']),
  sources: PropTypes.array,
  src: PropTypes.string,
  alt: PropTypes.string,
  poster: PropTypes.string,
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  embeddedRatio: PropTypes.string,
  shouldLazyLoad: PropTypes.bool,
  isEmbedded: PropTypes.bool,
  tracks: PropTypes.array
};

export default LandingPageMedia;
