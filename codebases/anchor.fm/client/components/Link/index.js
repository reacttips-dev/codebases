import React from 'react';
import PropTypes from 'prop-types';

import { Link as ReactRouterLink } from 'react-router-dom';

import If from '../../shared/If';

const Link = ({ to, href, children, className, isDownloadLink, ...rest }) => (
  <If
    condition={!!href}
    ifRender={() => (
      <a
        href={to || href}
        {...rest}
        rel={rest && rest.target === '_blank' ? 'noopener noreferrer' : ''}
        className={className}
        download={isDownloadLink}
      >
        {children}
      </a>
    )}
    elseRender={() => (
      <ReactRouterLink to={to} {...rest} className={className}>
        {children}
      </ReactRouterLink>
    )}
  />
);

Link.defaultProps = {
  to: null,
  href: null,
  className: null,
  isDownloadLink: false,
};

Link.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  className: PropTypes.string,
  isDownloadLink: PropTypes.bool,
};

export default Link;
