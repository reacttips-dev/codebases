import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import LandingPageImage from 'components/landing/LandingPageImage';

export const InstagramPic = ({ index, imageDetails, shouldLazyLoad, onComponentClick, className: parentClassName, slotIndex }) => {
  const { images, link, caption } = imageDetails || {};
  const { small } = images || {};
  const { text } = caption || {};
  const imageProps = { src: small, alt: text, title: text, role: 'listitem', shouldLazyLoad };
  return (
    <a
      className={parentClassName}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onComponentClick}
      data-eventlabel="Instagram"
      data-slotindex={slotIndex}
      data-eventvalue={`instagrampicture-${index}`}
    >
      <LandingPageImage {...imageProps} />
    </a>
  );
};

InstagramPic.propTypes = {
  imageDetails: PropTypes.object.isRequired,
  onComponentClick: PropTypes.func.isRequired
};

export default withErrorBoundary('Instagram', InstagramPic);
