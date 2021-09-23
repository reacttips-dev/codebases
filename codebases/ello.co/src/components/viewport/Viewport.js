import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(s.displayNone, s.hidden)

export const Viewport = props =>
  (<div
    className={classNames(
      'Viewport',
      { isAuthenticationView: props.isAuthenticationView },
      { isCategoryDrawerOpen: props.isCategoryDrawerOpen },
      { isDiscoverView: props.isDiscoverView },
      { isNavbarHidden: props.isNavbarHidden || props.isLightBoxActive },
      { isNotificationsActive: props.isNotificationsActive },
      { isOnboardingView: props.isOnboardingView },
      { isProfileMenuActive: props.isProfileMenuActive },
      props.userDetailPathClassName,
      `${baseStyle}`,
    )}
    role="presentation"
  />)

Viewport.propTypes = {
  isAuthenticationView: PropTypes.bool.isRequired,
  isCategoryDrawerOpen: PropTypes.bool.isRequired,
  isDiscoverView: PropTypes.bool.isRequired,
  isLightBoxActive: PropTypes.bool.isRequired,
  isNavbarHidden: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isOnboardingView: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  userDetailPathClassName: PropTypes.string,
}

Viewport.defaultProps = {
  userDetailPathClassName: null,
}

export default Viewport

