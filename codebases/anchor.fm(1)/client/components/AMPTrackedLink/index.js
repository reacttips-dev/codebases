import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AMPTrackedLink extends Component {
  // click event is for non-AMP usage
  handleClick = evt => {
    const {
      eventAction = 'Click',
      eventCategory,
      eventLabel,
      onClick,
    } = this.props;
    const params = {
      eventAction,
      eventCategory,
      eventLabel,
    };
    if (onClick) {
      onClick(evt);
    }
    ga('send', 'event', params);
  };

  render() {
    const {
      children,
      className,
      eventAction = 'Click',
      eventCategory,
      eventLabel,
      to,
    } = this.props;
    const attrs = {
      to,
    };
    attrs['data-vars-event-action'] = eventAction;
    attrs['data-vars-event-category'] = eventCategory;
    attrs['data-vars-event-label'] = eventLabel;
    // jsAMPTrackedLink class for use with AMP DOM analysis / custom event trigger
    return (
      <Link
        className={`${className || ''} jsAMPTrackedLink`}
        onClick={this.handleClick}
        {...attrs}
      >
        {children}
      </Link>
    );
  }
}

export default AMPTrackedLink;
