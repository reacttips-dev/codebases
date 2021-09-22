import _ from 'lodash';
import { Link, match } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import stringify from 'fast-json-stable-stringify';
import Retracked from 'js/app/retracked';
import a11yKeyPress from 'js/lib/a11yKeyPress';

const EXTERNAL_URL_RE = new RegExp('^(?:[a-z]+:)?//', 'i');

/**
 * We provide three components:
 *   TrackedA for tracking <a>
 *   TrackedReactLink for tracking <Link> (remember to use `href` instead of `to`)
 *   TrackedLink2: Uses either React Router Link component if there is a matching route for client
 *     side routing, or <a> for the case when there is no matching route. The use case is for
 *     when there are links that may either be a single page navigation, OR a full page reload navigation
 *     depending on what app the link is used in.
 */
class TrackedLinkImpl extends React.Component {
  static propTypes = {
    // when this link is clicked, it will fire an event key made of
    // {group}.{page}.click.{trackingName} (this sets the last part)
    trackingName: PropTypes.string.isRequired,
    className: PropTypes.string,
    href: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // for react router
    ]),
    // All data fields will be injected into the value of the event.
    // This should be a regular JS object.
    data: PropTypes.object,
    onClick: PropTypes.func,
    target: PropTypes.string,
    // linkType can be 'a', 'Link' or 'auto'
    linkType: PropTypes.oneOf(['a', 'Link', 'auto']),
    children: PropTypes.node,
    disableLocalRouting: PropTypes.bool,
    refAlt: PropTypes.func,
    role: PropTypes.string,
    ariaLabel: PropTypes.string,
    ariaExpanded: PropTypes.string,
    ariaCurrent: PropTypes.string,
    ariaSelected: PropTypes.bool,
  };

  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
    router: PropTypes.object,
  };

  static defaultProps = {
    linkType: 'auto',
  };

  state = {
    canRouteLocally: false,
  };

  componentWillMount() {
    this.checkCanRouteLocally();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  checkCanRouteLocally() {
    const { href, linkType, disableLocalRouting } = this.props;
    const { router } = this.context;

    if (!href) {
      return;
    }
    if (linkType === 'auto') {
      if (disableLocalRouting) {
        return;
      }

      const isExternal = EXTERNAL_URL_RE.test(href);
      if (isExternal) {
        return;
      }

      match(
        {
          routes: router.routes,
          location: href,
        },
        (error, redirectLocation, renderProps) => {
          // check if the route it matches is the notfoundroute
          if (!error && renderProps) {
            const { routes } = renderProps;
            const matchedRoute = routes[routes.length - 1];
            if (this._isMounted) {
              this.setState({
                canRouteLocally: matchedRoute.path !== '*',
              });
            }
          }
        }
      );
    }
  }

  trackClick = (e) => {
    const { _eventData, _withTrackingData } = this.context;
    const { trackingName, data, href, onClick } = this.props;
    const propsData = { href, ...data };
    Retracked.trackComponent(_eventData, propsData, trackingName, 'click', _withTrackingData);
    if (onClick) onClick(e);
  };

  render() {
    const {
      className,
      trackingName,
      data,
      href,
      linkType,
      refAlt,
      ariaLabel,
      ariaExpanded,
      ariaCurrent,
      ariaSelected,
      role,
      children,
      ...props
    } = this.props;
    const { canRouteLocally } = this.state;
    const { _eventData } = this.context;

    let LinkType;
    const namespace = (_eventData && _eventData.namespace) || {};
    const { app, page } = namespace;
    const action = 'click';
    const component = trackingName;

    // TODO(zhaojun, cliu): this is a temporary solution to generate data-click-key and data-click-value
    // field for SSR tracking. Longer term, we need a story about SSR tracking.
    const eventKey = [app, page, action, component].join('.');
    const namespaceForSSRTracking = {
      ...namespace,
      component: trackingName,
      action,
    };
    const eventValue = {
      ..._eventData,
      ...data,
      namespace: namespaceForSSRTracking,
      // eslint-disable-next-line camelcase
      schema_type: 'FRONTEND',
      href,
    };

    if (typeof href === 'object') {
      LinkType = Link;
    } else if (linkType === 'auto') {
      LinkType = canRouteLocally ? Link : 'a';
    } else if (linkType === 'a') {
      LinkType = 'a';
    } else if (linkType === 'Link') {
      LinkType = Link;
    } else {
      throw new Error('Unknown LinkType: ' + linkType);
    }

    const configProps = {
      onClick: this.trackClick,
      onKeyPress: (event) => a11yKeyPress(event, this.trackClick),
      'data-click-key': eventKey,
      'data-click-value': stringify(eventValue),
      'data-track': true,
      'data-track-app': app,
      'data-track-page': page,
      'data-track-action': action,
      'data-track-component': component,
      'data-track-href': href,
      href,
      to: href,
      className,
      ref: refAlt,
      ..._.omit(props, 'data', 'linkType', 'onClick', 'trackingName', 'withVisibilityTracking', 'disableLocalRouting'),
    };

    if (role) {
      configProps.role = role;
    }

    if (ariaLabel) {
      configProps['aria-label'] = ariaLabel;
    }

    if (ariaCurrent) {
      configProps['aria-current'] = ariaCurrent;
    }

    if (ariaExpanded) {
      configProps['aria-expanded'] = ariaExpanded;
    }

    if (ariaSelected === true || ariaSelected === false) {
      configProps['aria-selected'] = ariaSelected;
    }

    const body = <LinkType {...configProps}>{children}</LinkType>;

    return body;
  }
}
const TrackedLinkImplWithVisibility = Retracked.withVisibilityTracking(TrackedLinkImpl);

/**
 * Custom extension to React-Router's Link that automatically records click events
 * both in regular CSR context and also in SSR in the sometimes long period between
 * preloader arriving and full rehydration completing. It also fallback to anchor link
 * if ReactRouter doesn't have matched routing rule.
 *
 * The preloader eventing depends on instrumentLinks() in js/app/preloader.
 * See TrackedLinkImpl for all required props.
 */
class TrackedLink2 extends React.Component {
  static propTypes = {
    withVisibilityTracking: PropTypes.bool,
  };

  static defaultProps = {
    withVisibilityTracking: false,
  };

  render() {
    const { withVisibilityTracking } = this.props;
    const TrackedLinkComponent = withVisibilityTracking ? TrackedLinkImplWithVisibility : TrackedLinkImpl;
    return <TrackedLinkComponent linkType="auto" {...this.props} />;
  }
}

/**
 * A wrapper around anchor link for tracking
 * See TrackedLinkImpl for all required props.
 */
class TrackedA extends React.Component {
  static propTypes = {
    withVisibilityTracking: PropTypes.bool,
  };

  static defaultProps = {
    withVisibilityTracking: false,
  };

  render() {
    const { withVisibilityTracking, ...anchorProps } = this.props;
    const TrackedAComponent = withVisibilityTracking ? TrackedLinkImplWithVisibility : TrackedLinkImpl;
    return <TrackedAComponent linkType="a" {..._.omit(anchorProps, 'withVisibilityTracking', 'disableLocalRouting')} />;
  }
}

/**
 * A wrapper around Link for tracking.
 * If you are switching from Link, remember to also change "to" in your props to "href".
 * See TrackedLinkImpl for all required props.
 */
function TrackedReactLink(props) {
  return <TrackedLinkImpl {...props} linkType="Link" />;
}

export { TrackedLink2, TrackedA, TrackedReactLink };
