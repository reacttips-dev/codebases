import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { setIsNavbarHidden, setViewportSizeAttributes } from '../actions/gui'
import {
  addPageVisibilityObserver,
  removePageVisibilityObserver,
} from '../components/viewport/PageVisibilityComponent'
import { addResizeObject, removeResizeObject } from '../components/viewport/ResizeComponent'
import { addScrollObject, removeScrollObject } from '../components/viewport/ScrollComponent'
import { Viewport } from '../components/viewport/Viewport'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectHasLaunchedSignupModal,
  selectInnerHeight,
  selectInnerWidth,
  selectIsCategoryDrawerOpen,
  selectIsLightBoxActive,
  selectIsNavbarHidden,
  selectIsNotificationsActive,
  selectIsProfileMenuActive,
  selectScrollOffset,
} from '../selectors/gui'
import { selectModalType } from '../selectors/modal'
import { selectParamsType } from '../selectors/params'
import {
  selectIsAuthenticationView,
  selectIsOnboardingView,
  selectPathname,
  selectViewNameFromRoute,
} from '../selectors/routing'

export const selectUserDetailPathClassName = createSelector(
  [selectViewNameFromRoute, selectPathname], (viewName, pathname) => {
    if (viewName !== 'userDetail') { return null }
    if (/\/following\b/.test(pathname)) { return 'isUserDetailFollowing' }
    if (/\/followers\b/.test(pathname)) { return 'isUserDetailFollowers' }
    if (/\/loves\b/.test(pathname)) { return 'isUserDetailLoves' }
    return 'isUserDetailPosts'
  },
)

function mapStateToProps(state, props) {
  const paramsType = selectParamsType(state, props)
  return {
    hasLaunchedSignupModal: selectHasLaunchedSignupModal(state),
    innerHeight: selectInnerHeight(state),
    innerWidth: selectInnerWidth(state),
    isAuthenticationView: selectIsAuthenticationView(state),
    isCategoryDrawerOpen: selectIsCategoryDrawerOpen(state),
    isDiscoverView: selectViewNameFromRoute(state) === 'discover' && paramsType !== 'all',
    isLightBoxActive: selectIsLightBoxActive(state),
    isLoggedIn: selectIsLoggedIn(state),
    isNavbarHidden: selectIsNavbarHidden(state),
    isNotificationsActive: selectIsNotificationsActive(state),
    isOnboardingView: selectIsOnboardingView(state),
    isProfileMenuActive: selectIsProfileMenuActive(state),
    modalType: selectModalType(state),
    scrollOffset: selectScrollOffset(state),
    userDetailPathClassName: selectUserDetailPathClassName(state, props),
  }
}

class ViewportContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    hasLaunchedSignupModal: PropTypes.bool.isRequired,
    innerHeight: PropTypes.number.isRequired,
    innerWidth: PropTypes.number.isRequired,
    isAuthenticationView: PropTypes.bool.isRequired,
    isCategoryDrawerOpen: PropTypes.bool.isRequired,
    isDiscoverView: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNavbarHidden: PropTypes.bool.isRequired,
    isNotificationsActive: PropTypes.bool.isRequired,
    isOnboardingView: PropTypes.bool.isRequired,
    isProfileMenuActive: PropTypes.bool.isRequired,
    isLightBoxActive: PropTypes.bool.isRequired,
    modalType: PropTypes.string,
    scrollOffset: PropTypes.number.isRequired,
    userDetailPathClassName: PropTypes.string,
  }

  static defaultProps = {
    modalType: null,
    userDetailPathClassName: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    this.hasResized = false
  }

  componentDidMount() {
    addPageVisibilityObserver(this)
    addResizeObject(this)
    addScrollObject(this)
  }

  componentWillUnmount() {
    removePageVisibilityObserver(this)
    removeResizeObject(this)
    removeScrollObject(this)
  }

  onPageVisibilityVisible() {
    const { hasLaunchedSignupModal, isLoggedIn, modalType } = this.props
    if (!isLoggedIn && !hasLaunchedSignupModal && !modalType) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('page-visibility')
    }
  }

  onResize(resizeAttributes) {
    const { innerHeight: prevHeight, innerWidth: prevWidth } = this.props
    const { innerHeight: nextHeight, innerWidth: nextWidth } = resizeAttributes
    if (!this.hasResized || (prevHeight !== nextHeight || prevWidth !== nextWidth)) {
      this.hasResized = true
      this.props.dispatch(setViewportSizeAttributes(resizeAttributes))
    }
  }

  onScrollTop() {
    const { dispatch, isNavbarHidden } = this.props
    if (isNavbarHidden) {
      dispatch(setIsNavbarHidden({ isHidden: false }))
    }
  }

  onScroll({ scrollDirection, scrollY }) {
    const { dispatch, isNavbarHidden, scrollOffset } = this.props

    // Scroll positions less than the height of the viewport, show the navbar
    if (scrollY < scrollOffset) {
      if (isNavbarHidden) {
        dispatch(setIsNavbarHidden({ isHidden: false }))
      }
      return
    }
    if (!isNavbarHidden && scrollDirection === 'down') {
      dispatch(setIsNavbarHidden({ isHidden: true }))
      return
    }
    if (isNavbarHidden && scrollDirection === 'up') {
      dispatch(setIsNavbarHidden({ isHidden: false }))
    }
  }

  render() {
    const props = {
      isAuthenticationView: this.props.isAuthenticationView,
      isCategoryDrawerOpen: this.props.isCategoryDrawerOpen,
      isDiscoverView: this.props.isDiscoverView,
      isNavbarHidden: this.props.isNavbarHidden,
      isNotificationsActive: this.props.isNotificationsActive,
      isOnboardingView: this.props.isOnboardingView,
      isProfileMenuActive: this.props.isProfileMenuActive,
      isLightBoxActive: this.props.isLightBoxActive,
      userDetailPathClassName: this.props.userDetailPathClassName,
    }
    return <Viewport {...props} />
  }
}

export default connect(mapStateToProps)(ViewportContainer)

