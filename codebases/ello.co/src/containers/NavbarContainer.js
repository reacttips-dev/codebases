import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../actions/analytics'
import { logout } from '../actions/authentication'
import { setIsProfileMenuActive, toggleNotifications, resetPromoAlert } from '../actions/gui'
import { checkForNewNotifications, loadAnnouncements } from '../actions/notifications'
import { openOmnibar } from '../actions/omnibar'
import { updateRelationship } from '../actions/relationships'
import { NavbarLoggedIn, NavbarLoggedOut } from '../components/navbar/NavbarRenderables'
import { ADD_NEW_IDS_TO_RESULT, SET_LAYOUT_MODE } from '../constants/action_types'
import { scrollToPosition } from '../lib/jello'
import * as ElloAndroidInterface from '../lib/android_interface'
import { selectCategoryTabs, selectAreCategoriesSubscribed } from '../selectors/categories'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectActiveNotificationsType,
  selectDeviceSize,
  selectInnerWidth,
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsLightBoxActive,
  selectIsNotificationsActive,
  selectIsNotificationsUnread,
  selectIsProfileMenuActive,
} from '../selectors/gui'
import { selectAnnouncementHasBeenViewed } from '../selectors/notifications'
import { selectPage } from '../selectors/pages'
import { selectAvatar, selectUsername, selectIsBrand, selectIsStaff } from '../selectors/profile'
import { selectPathname, selectViewNameFromRoute } from '../selectors/routing'

function mapStateToProps(state, props) {
  const innerWidth = selectInnerWidth(state)
  const isLoggedIn = selectIsLoggedIn(state)
  const pathname = selectPathname(state)
  const pageResult = selectPage(state)
  const hasLoadMoreButton = !!(pageResult && pageResult.get('morePostIds'))
  const viewName = selectViewNameFromRoute(state)
  const categoryTabs = viewName === 'discover' ? selectCategoryTabs(state) : null
  const areCategoriesSubscribed = selectAreCategoriesSubscribed(state)
  const isUnread = selectIsNotificationsUnread(state) || !selectAnnouncementHasBeenViewed(state)
  const isGridMode = selectIsGridMode(state)
  const isLightBoxActive = selectIsLightBoxActive(state)
  const deviceSize = selectDeviceSize(state)

  if (isLoggedIn) {
    return {
      activeTabType: selectActiveNotificationsType(state),
      artistInvitesInProfileMenu: (innerWidth <= 700 && innerWidth >= 640) || innerWidth < 372,
      avatar: selectAvatar(state),
      categoryTabs,
      areCategoriesSubscribed,
      deviceSize,
      hasLoadMoreButton,
      isBrand: selectIsBrand(state),
      isGridMode,
      isLayoutToolHidden: selectIsLayoutToolHidden(state, props),
      isLightBoxActive,
      isLoggedIn,
      isNotificationsActive: selectIsNotificationsActive(state),
      isNotificationsUnread: isUnread,
      isProfileMenuActive: selectIsProfileMenuActive(state),
      isStaff: selectIsStaff(state),
      pathname,
      username: selectUsername(state),
      viewName,
      innerWidth,
    }
  }
  return {
    categoryTabs,
    areCategoriesSubscribed,
    deviceSize,
    hasLoadMoreButton,
    isGridMode,
    isLightBoxActive,
    isLoggedIn,
    pathname,
    viewName,
  }
}

class NavbarContainer extends PureComponent {
  static propTypes = {
    activeTabType: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    innerWidth: PropTypes.number,
    isGridMode: PropTypes.bool.isRequired,
    isLightBoxActive: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isNotificationsActive: PropTypes.bool.isRequired,
    isProfileMenuActive: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    viewName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    activeTabType: '',
    innerWidth: null,
  }

  static contextTypes = {
    onClickScrollToContent: PropTypes.func.isRequired,
    onLaunchNativeEditor: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    onClickArtistInvites: PropTypes.func.isRequired,
    onClickLogin: PropTypes.func.isRequired,
    onClickSignup: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickArtistInvites: this.onClickArtistInvites,
      onClickLogin: this.onClickLogin,
      onClickSignup: this.onClickSignup,
    }
  }

  componentWillMount() {
    this.checkForNotifications(true)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.pathname || !this.props.pathname) { return }
    if (prevProps.pathname !== this.props.pathname) {
      this.checkForNotifications()
    }
  }

  componentWillUnmount() {
    this.deactivateProfileMenu()
  }

  onClickAvatar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { isProfileMenuActive } = this.props
    return isProfileMenuActive ? this.deactivateProfileMenu() : this.activateProfileMenu()
  }

  onClickDocument = () => {
    this.deactivateProfileMenu()
  }

  onClickNotification = (e) => {
    if (e) { e.preventDefault() }
    const { dispatch, isNotificationsActive } = this.props
    dispatch(toggleNotifications({ isActive: !isNotificationsActive }))
  }

  onClickLoadMorePosts = () => {
    const { dispatch, params, pathname } = this.props
    dispatch({ type: ADD_NEW_IDS_TO_RESULT, payload: { resultKey: pathname } })
    // if on user page and more content scroll to top of content
    if (params.username && !params.token) {
      const { onClickScrollToContent } = this.context
      onClickScrollToContent()
    } else {
      scrollToPosition(0, 0)
    }
  }

  onClickNavbarMark = () => {
    const { dispatch } = this.props
    dispatch(push('/'))
    scrollToPosition(0, 0)
  }

  onClickOmniButton = () => {
    const { dispatch } = this.props
    if (ElloAndroidInterface.supportsNativeEditor()) {
      dispatch(trackEvent('opened_omnibar'))
      this.context.onLaunchNativeEditor(null, false, null)
    } else {
      dispatch(openOmnibar())
      scrollToPosition(0, 0)
    }
  }

  onClickArtistInvites = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('clicked_nav_artist_invites'))
  }

  onClickLogin = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('clicked_nav_login'))
    dispatch(resetPromoAlert())
  }

  onClickSignup = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('clicked_join_button'))
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onDragOverOmniButton = (e) => {
    e.preventDefault()
    this.onClickOmniButton()
  }

  onDragOverStreamLink = (e) => {
    e.preventDefault()
    e.target.classList.add('hasDragOver')
  }

  onDragLeaveStreamLink = (e) => {
    e.target.classList.remove('hasDragOver')
  }

  onDropStreamLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.remove('hasDragOver')
    if (e.dataTransfer.types.indexOf('application/json') > -1) {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.userId && data.priority && e.target.getAttribute('href') === '/following') {
        this.props.dispatch(updateRelationship(data.userId, 'friend', data.priority))
      }
    }
  }

  onLogOut = () => {
    const { dispatch } = this.props
    this.deactivateProfileMenu()
    dispatch(logout())
  }

  // if we're viewing notifications, don't change the lightning-bolt link.
  // on any other page, we have the notifications link go back to whatever
  // category you were viewing last.
  getNotificationCategory() {
    const { activeTabType, viewName } = this.props
    return viewName === 'notifications' ? '' : `/${activeTabType}`
  }

  checkForNotifications(isMounting = false) {
    const { dispatch, isLoggedIn } = this.props
    if (isLoggedIn) {
      dispatch(checkForNewNotifications())
      if (!isMounting) { dispatch(loadAnnouncements()) }
    }
  }

  activateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: true }))
    document.addEventListener('click', this.onClickDocument)
  }

  deactivateProfileMenu() {
    const { dispatch, isProfileMenuActive } = this.props
    if (!isProfileMenuActive) { return }
    dispatch(setIsProfileMenuActive({ isActive: false }))
    document.removeEventListener('click', this.onClickDocument)
  }

  render() {
    const { isLoggedIn, isLightBoxActive, innerWidth } = this.props
    if (isLoggedIn) {
      return (
        <NavbarLoggedIn
          {...this.props}
          notificationCategory={this.getNotificationCategory()}
          onClickAvatar={this.onClickAvatar}
          onClickDocument={this.onClickDocument}
          onClickLoadMorePosts={this.onClickLoadMorePosts}
          onClickNavbarMark={this.onClickNavbarMark}
          onClickNotification={this.onClickNotification}
          onClickOmniButton={this.onClickOmniButton}
          onClickToggleLayoutMode={this.onClickToggleLayoutMode}
          onDragLeaveStreamLink={this.onDragLeaveStreamLink}
          onDragOverOmniButton={this.onDragOverOmniButton}
          onDragOverStreamLink={this.onDragOverStreamLink}
          onDropStreamLink={this.onDropStreamLink}
          onLogOut={this.onLogOut}
          isLightBoxActive={isLightBoxActive}
          innerWidth={innerWidth}
        />
      )
    }
    return (
      <NavbarLoggedOut
        {...this.props}
        onClickLoadMorePosts={this.onClickLoadMorePosts}
        onClickNavbarMark={this.onClickNavbarMark}
      />
    )
  }
}

export default connect(mapStateToProps)(NavbarContainer)
