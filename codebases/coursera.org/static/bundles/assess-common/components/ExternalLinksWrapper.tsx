import React from 'react';

import ExternalLinks from 'js/lib/coursera.externallinks';

/**
 * Captures link clicks on child elements and uses `ExternalLinks.safelyOpenUrl` to handle them.
 */
class ExternalLinksWrapper extends React.Component {
  handleClick = (e: React.SyntheticEvent<HTMLElement>) => {
    // Get the anchor element.
    let anchorEl = e.target as HTMLLinkElement | null;
    while (anchorEl && anchorEl.nodeName !== 'A') {
      anchorEl = anchorEl.parentNode as HTMLLinkElement | null;
    }

    // Ignore clicks from non-a anchorElements.
    if (!anchorEl) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    const href = anchorEl.getAttribute('href');
    if (href) {
      ExternalLinks.safelyOpenUrl(href);
    }
  };

  render() {
    const { children } = this.props;
    return <div onClick={this.handleClick}>{children}</div>;
  }
}

export default ExternalLinksWrapper;
