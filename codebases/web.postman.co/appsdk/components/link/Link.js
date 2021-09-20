import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationService from '../../../js/services/NavigationService';

const allowedAnchorOptions = ['target', 'title', 'className'],
  defaultAnchorProps = {
    target: '_self',
    referrerPolicy: 'no-referrer',
    rel: 'noreferrer noopener'
  };

/**
 * Determine if the current platform is browser
 * @returns true if current SDK platform is browser, returns false if the current platform is desktop app
 */
function isPlatformBrowser () {
  return Boolean(window && window.SDK_PLATFORM === 'browser');
}

export default class Link extends Component {
  constructor (props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick (e) {

    // If any click handler is registered for the component then execute the click handler
    this.props.onClick && this.props.onClick(e);

    // If the default behavior is prevented from the on click handler then prevent executing rest of the code
    if (e.defaultPrevented) {
      return;
    }

    // The route object/string passed as props
    let route = this.props.to;

    // Case when click is done with Cmd or Ctrl key. We continue with the default link behaviour for
    // the case of browser
    if (isPlatformBrowser() && (e.metaKey || e.ctrlKey)) {
      return;
    }

    // If the route is not given
    if (!route) {
      return;
    }

    // A hash fragment is considered as valid URL, but for hash fragment just fallback to default link behavior
    if (typeof route === 'string' && route.startsWith('#')) {
      return;
    }

    // Otherwise it is a normal click and we need to initiate navigation accordingly
    // Prevent the default anchor tag behaviour, otherwise it will trigger a page reload
    e.preventDefault();

    // Trigger navigation
    _openURL(route, { ...this.props.options, ...this._getAllowedAnchorOptions(), relative: this.props.relative });
  }

  _constructURLFromRoute (route) {
    // For case of desktop, we don't need to give the URL to the anchor tag. This is because
    // we don't have support for link behaviour like cmd+click, right click -> open on the desktop
    if (!isPlatformBrowser()) {
      return '';
    }

    // Case when route is not given. In this case, the URL returned will be undefined.
    // So, the anchor tag won't be treated as a link
    if (!route) {
      return;
    }

    // If the route given is a string
    if (typeof route === 'string') {
      return route;
    }

    // Otherwise, the route given is an intent object
    // Get the base URL, for example - https://teamname.postman.co
    let url = NavigationService.getBaseURL();

    // Construct the URL from route identifier, route params and query params
    let resolvedURL = NavigationService.getURLForRoute(route.routeIdentifier, route.routeParams, route.queryParams, route.hashFragment);

    if (resolvedURL) {
      // For desktop app the base URL will be empty, in that case the url will be same as the constructed URL from route info
      url = _.isEmpty(url) ? resolvedURL : `${url}/${resolvedURL}`;
    }

    return url;
  }

  _getAllowedAnchorOptions () {
    let optionsWithDefaults = _.defaults(this.props, defaultAnchorProps);

    return _.pick(optionsWithDefaults, allowedAnchorOptions);
  }

  render () {
    let anchorProps = this._getAllowedAnchorOptions();

    return (
      <a
        {...anchorProps}
        href={this._constructURLFromRoute(this.props.to)}
        onClick={this.onClick}
      >
        {this.props.children}
      </a>
    );
  }
}

/**
 *
 * @param {*} route
 * @param {*} options
 */
function _openURL (route, options) {
  // If we got an intent object from the consumer, we use NavigationService.transitionTo to
  // navigate to the internal workflow
  if (typeof route === 'object') {
    NavigationService.transitionTo(route.routeIdentifier, route.routeParams, route.queryParams, options, route.hashFragment);
    return;
  }

  // Now we should only have the case when the route (could be internal or external) is given as a string
  if (typeof route !== 'string' || route === '') {
    return;
  }

  if (options.relative) {
    NavigationService.transitionToURL(route, {});
    return;
  }

  // We call NavigationService.openURL to transition to the url
  NavigationService.openURL(route, _.omit(options, 'relative'));
}


Link.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]).isRequired,
  relative: PropTypes.bool,
  options: PropTypes.object
};
