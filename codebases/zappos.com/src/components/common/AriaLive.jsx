import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ARIA_LIVE_REGION_ROOT } from 'constants/appConstants';
import PortalFactory from 'components/common/PortalFactory';

// include both implicit roles and explicit aria-live + aria-atomic roles as it results in a more consistent browser experience
export const AlertRoot = () =>
  <div
    id={`${ARIA_LIVE_REGION_ROOT}-alert`}
    className="screenReadersOnly"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"/>;

export const StatusRoot = () =>
  <div
    id={`${ARIA_LIVE_REGION_ROOT}-status`}
    className="screenReadersOnly"
    role="status"
    aria-live="polite"
    aria-atomic="true"/>;

export const LogRoot = () =>
  <div
    id={`${ARIA_LIVE_REGION_ROOT}-log`}
    className="screenReadersOnly"
    role="log"
    aria-live="polite"
    aria-atomic="false"/>;

// This component is for reporting client side changes to the screen reader using the aria-live feature.
// You can provide anything as children to this component and it will render it to the Aria Live root
const AriaLive = ({ children, role = 'log', ...props }) => React.createElement(PortalFactory(`${ARIA_LIVE_REGION_ROOT}-${role}`), props, children);
AriaLive.propTypes = { role : PropTypes.oneOf(['alert', 'status', 'log']) };
export default AriaLive;

// Will render normally and to the Aria Live element
// Use with caution to avoid rendering elements with ids or things that affect SEO to the Aria Live element (headings, titles, etc)
export const AriaLiveTee = ({ children, ...props }) => <>{children}<AriaLive {...props}>{children}</AriaLive></>;

export const ClientRouteOnlyAriaLive = connect(state => ({ active : state.pageView.clientRoutedUrls.length }))(AriaLive);
