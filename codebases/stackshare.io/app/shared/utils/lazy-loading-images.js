import React, {useContext} from 'react';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import {PortalContext} from '../library/modals/base/portal';

const LazyLoadImage = ({children}) => {
  const portalContext = useContext(PortalContext);

  // If the image is rendered inside a portal, skipping lazy-loading as we need
  // to pass in a scrollContainer and passing in portalContext.current didn't
  // seem to work
  return portalContext && portalContext.current ? (
    <>{children}</>
  ) : (
    <LazyLoad offset={100}>{children}</LazyLoad>
  );
};

LazyLoadImage.propTypes = {
  children: PropTypes.any
};

export default LazyLoadImage;
