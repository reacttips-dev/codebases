import PropTypes from 'prop-types';
import React from 'react';

export type HeaderRightNavButtonType = {
  label: string;
  name: string;
  href?: string;
  showIfLoggedIn?: boolean;
  showIfLoggedOut?: boolean;
  mobileOnly?: boolean;
};

export default PropTypes.shape({
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  href: PropTypes.string,
  showIfLoggedIn: PropTypes.bool,
  showIfLoggedOut: PropTypes.bool,
  mobileOnly: PropTypes.bool,
});
