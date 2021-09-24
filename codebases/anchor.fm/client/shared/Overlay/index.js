import React from 'react';

import BootstrapOverlay from 'react-bootstrap/lib/Overlay';
import PropTypes from 'prop-types';

const renderNoop = () => null;
const noop = () => null;

const Overlay = ({ isShowing, onClickOutside, renderContent, ...props }) => (
  <BootstrapOverlay show={isShowing} onHide={onClickOutside} {...props}>
    {renderContent()}
  </BootstrapOverlay>
);

Overlay.defaultProps = {
  isShowing: false,
  onClickOutside: noop,
  renderContent: renderNoop,
};

Overlay.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  onClickOutside: PropTypes.func,
  renderContent: PropTypes.func,
};

export default Overlay;
