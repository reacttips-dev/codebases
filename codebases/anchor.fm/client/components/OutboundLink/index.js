import React, { Component } from 'react';

/**
 * Component made for tracking all links out of the site
 * with support for 'target="_blank"' behavior
 */
class OutboundLink extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  // https://support.google.com/analytics/answer/1136920?hl=en
  handleClick(evt) {
    const { to, newWindow, onClick } = this.props;
    /**
     * Function that tracks a click on an outbound link in Analytics.
     * This function takes a valid URL string as an argument, and uses that URL string
     * as the event label. Setting the transport method to 'beacon' lets the hit be sent
     * using 'navigator.sendBeacon' in browser that support it.
     */
    const params = {
      eventCategory: 'Outbound',
      eventAction: 'Click',
      eventLabel: to,
    };
    if (!newWindow) {
      params.transport = 'beacon';
      params.hitCallback = () => {
        document.location = to;
      };
    }
    if (onClick) {
      onClick(evt);
    }
    ga('send', 'event', params);
  }

  render() {
    const {
      children,
      className,
      to,
      newWindow,
      isUserGeneratedContent,
      style = {},
    } = this.props;
    const attrs = {};
    attrs['data-vars-outbound-link'] = to; // AMP outbonud link tracking
    if (newWindow) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }
    if (isUserGeneratedContent) {
      attrs.rel = `${attrs.rel} ugc`;
    }
    // jsOutboundLink class for use with AMP DOM analysis fro outboundLinks trigger
    return (
      <a
        className={`${className || ''} jsOutboundLink`}
        href={to}
        onClick={this.handleClick}
        {...attrs}
        style={{
          ...style,
        }}
      >
        {children}
      </a>
    );
  }
}

export default OutboundLink;
