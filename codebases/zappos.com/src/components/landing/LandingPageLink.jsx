import React from 'react';
import { Link } from 'react-router';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { checkIfRelativeUrl } from 'helpers';

export const LandingPageLink = ({ url, newWindow, children, fallbackNode, ...linkProps }) => {
  if (url) {
    let elementType = Link;
    if (checkIfRelativeUrl(url)) {
      linkProps['to'] = url;
    } else {
      elementType = 'a';
      linkProps['href'] = url;
    }

    if (newWindow) {
      linkProps.target = '_blank';
      linkProps.rel = 'noopener noreferrer';
    }

    return React.createElement(elementType, linkProps, children);
  } else if (fallbackNode) {
    return React.createElement(fallbackNode, linkProps, children);
  }
  return null;
};

export default withErrorBoundary('LandingPageLink', LandingPageLink);
