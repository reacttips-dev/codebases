import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isElloAndroid } from '../../lib/jello'
import { trackEvent } from '../../actions/analytics'
import {
  BoltIcon,
  CircleIcon,
  GridIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon,
} from '../assets/Icons'
import {
  NavbarLayoutTool,
  NavbarLink,
  NavbarMark,
  NavbarMorePostsButton,
  NavbarOmniButton,
  NavbarProfile,
} from './NavbarParts'
import { CategoryTabBar } from '../tabs/CategoryTabBar'
import NotificationsContainer from '../../containers/NotificationsContainer'
import { css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const navbarStyle = css(
  s.fixed,
  s.fullWidth,
  { height: 80, top: -80, right: 0, left: 0 },
  s.zNavbar,
  s.bgcWhite,
  modifier('isPaginatoring', select('.navbar-content', { transform: 'translate3d(0, 100%, 0)' })),
  select('.isNavbarHidden ~ &:hover .navbar-content',
    {
      transitionDelay: '350ms',
      transform: 'translate3d(0, 100%, 0)',
    }),
  select('&.hide:hover .navbar-content',
    {
      transitionDelay: '350ms',
      transform: 'translate3d(0, 100%, 0)',
    }),
  parent('.isOmnibarActive', s.overflowHidden, s.pointerNone, s.bgcTransparent, s.opacity0),
  select('.isOnboardingView ~ &', s.displayNone),
  media(s.minBreak3,
    select('.no-touch .isNavbarHidden ~ .Discover + &:hover .navbar-content', { transitionDelay: '1.5s' }),
  ),
)

const grabberStyle = css(
  s.relative,
  s.block,
  s.fullWidth,
  s.p0,
  {
    height: 0,
    margin: 0,
    overflow: 'hidden',
  },
  select(
    '&:hover',
    { cursor: 'pointer' },
  ),
  select(
    '.isNavbarHidden ~ .Navbar &',
    { height: 15, marginTop: 0 },
  ),
  select(
    '.Navbar.hide &',
    { height: 15, marginTop: 0 },
    media(s.maxBreak3,
      { display: 'none' },
    ),
  ),
)

const wrapperStyle = css(
  s.relative,
  s.p10,
  s.fullWidth,
  s.bgcWhite,
  { transition: 'transform 350ms ease', transform: 'translate3d(0, calc(100%), 0)' },
  { height: 80, margin: 0 },
  select('.isNavbarHidden ~ .Navbar &', { transform: 'translate3d(0, 0, 0)' }),
  select('.Navbar.hide &', { transform: 'translate3d(0, 0, 0)' }),
  media(s.minBreak3,
    s.p20,
    { borderBottom: '1px solid #f2f2f2' },
  ),
)

const containerStyle = css(
  s.relative,
  s.block,
  s.maxSiteWidth,
  s.fullWidth,
  { margin: '0 auto' },
)

const mainStyle = css(
  s.maxSiteWidth,
  s.mxAuto,
  s.relative,
)

const linksStyle = css(
  s.absolute,
  { top: 0, left: 0 },
  s.nowrap,
  media(s.minBreak3,
    parent('.isLoggedIn', { top: 'calc(50% + 5px)', right: 200, left: 'auto', marginTop: -20 }),
    parent('.isLoggedOut', { top: 'calc(50% + 5px)', right: 175, left: 'auto', marginTop: -20 }),
    parent('.isOmnibarActive .Navbar >', s.absolute, { transform: 'translate3d(400px, 0, 0)' }),
  ),
)

export const NavbarLoggedOut = ({
  categoryTabs,
  areCategoriesSubscribed,
  deviceSize,
  dispatch,
  isLightBoxActive,
  hasLoadMoreButton,
  onClickLoadMorePosts,
  onClickNavbarMark,
  pathname,
}, { onClickArtistInvites, onClickLogin, onClickSignup }) => {
  const isTruncatedHeader = deviceSize === 'mobile' || deviceSize === 'tablet'
  const elloBlogPath = '/elloblog'
  const trackBlogLink = () => {
    dispatch(trackEvent('elloblog-nav-link-clicked'))
  }
  return (
    <nav className={`Navbar ${navbarStyle}`} >
      <div className={`navbar-content ${wrapperStyle}`}>
        <div className={`navbar-container ${containerStyle}`}>
          <div className={`NavbarMain ${mainStyle}`}>
            <NavbarMark onClick={onClickNavbarMark} />
            {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
            <div className={`NavbarLinks ${linksStyle}`}>
              {isTruncatedHeader &&
                <NavbarLink
                  className="LabelOnly"
                  label="Editorial"
                  pathname={pathname}
                  to="/"
                />
              }
              <NavbarLink
                className="LabelOnly"
                label="Creative Briefs"
                onClick={onClickArtistInvites}
                pathname={pathname}
                to="/creative-briefs"
              />
              {innerWidth > 700
                  ? <NavbarLink
                    className="LabelOnly"
                    label="Blog"
                    pathname={pathname}
                    to={elloBlogPath}
                    onClick={trackBlogLink}
                  /> : null }
              <NavbarLink
                className="LabelOnly"
                icon={<SparklesIcon />}
                label="Discover"
                pathname={pathname}
                to="/discover"
              />
              <NavbarLink
                className="IconOnly"
                icon={<SearchIcon />}
                label="Search"
                pathname={pathname}
                to="/search"
              />
            </div>
            <NavbarLink
              className="LabelOnly isLogin"
              label="Login"
              onClick={onClickLogin}
              pathname={pathname}
              to="/enter"
            />
            <NavbarLink
              className="LabelOnly isSignUp"
              label="Sign Up"
              onClick={onClickSignup}
              pathname={pathname}
              to="/join"
            />
          </div>
        </div>
        {categoryTabs && !isLightBoxActive &&
          <CategoryTabBar
            pathname={pathname}
            tabs={categoryTabs}
            areCategoriesSubscribed={areCategoriesSubscribed}
            subscribed={false}
            deviceSize={deviceSize}
          />
        }
      </div>
    </nav>
  )
}

NavbarLoggedOut.propTypes = {
  categoryTabs: PropTypes.array,
  areCategoriesSubscribed: PropTypes.bool,
  deviceSize: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  isLightBoxActive: PropTypes.bool,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
}
NavbarLoggedOut.defaultProps = {
  categoryTabs: null,
  isLightBoxActive: false,
  areCategoriesSubscribed: false,
}
NavbarLoggedOut.contextTypes = {
  onClickArtistInvites: PropTypes.func.isRequired,
  onClickLogin: PropTypes.func.isRequired,
  onClickSignup: PropTypes.func.isRequired,
}

export const NavbarLoggedIn = ({
  artistInvitesInProfileMenu,
  avatar,
  categoryTabs,
  areCategoriesSubscribed,
  deviceSize,
  dispatch,
  hasLoadMoreButton,
  isBrand,
  isGridMode,
  isLightBoxActive,
  isLayoutToolHidden,
  isNotificationsActive,
  isNotificationsUnread,
  isProfileMenuActive,
  isStaff,
  notificationCategory,
  onClickAvatar,
  onClickLoadMorePosts,
  onClickNavbarMark,
  onClickNotification,
  onClickOmniButton,
  onClickToggleLayoutMode,
  onDragLeaveStreamLink,
  onDragOverOmniButton,
  onDragOverStreamLink,
  onDropStreamLink,
  onLogOut,
  pathname,
  username,
  innerWidth,
}, { onClickArtistInvites }) => {
  const isTruncatedHeader = deviceSize === 'mobile' || deviceSize === 'tablet'
  const elloBlogPath = '/elloblog'
  const trackBlogLink = () => {
    dispatch(trackEvent('elloblog-nav-link-clicked'))
  }
  return (
    <nav className={`Navbar ${navbarStyle}`}>
      <div className={`navbar-content ${wrapperStyle}`}>
        <div className={`navbar-container ${containerStyle}`}>
          <div className={`NavbarMain ${mainStyle}`}>
            <NavbarMark onClick={onClickNavbarMark} />
            {hasLoadMoreButton ? <NavbarMorePostsButton onClick={onClickLoadMorePosts} /> : null}
            <div className={`NavbarLinks ${linksStyle}`}>
              {isTruncatedHeader &&
                <NavbarLink
                  className="LabelOnly"
                  label="Editorial"
                  pathname={pathname}
                  to="/"
                />
              }
              {!artistInvitesInProfileMenu &&
                <NavbarLink
                  className="LabelOnly"
                  label="Creative Briefs"
                  onClick={onClickArtistInvites}
                  pathname={pathname}
                  to="/creative-briefs"
                />
              }
              {innerWidth > 700
                  ? <NavbarLink
                    className="LabelOnly"
                    label="Blog"
                    pathname={pathname}
                    to={elloBlogPath}
                    onClick={trackBlogLink}
                  /> : null }
              <NavbarLink
                className="LabelOnly"
                icon={<SparklesIcon />}
                label="Discover"
                pathname={pathname}
                to="/discover/subscribed"
              />
              <NavbarLink
                className="LabelOnly"
                icon={<CircleIcon />}
                label="Following"
                onDragLeave={onDragLeaveStreamLink}
                onDragOver={onDragOverStreamLink}
                onDrop={onDropStreamLink}
                pathname={pathname}
                to="/following"
              />
              <NavbarLink
                className={classNames('IconOnly', { isNotificationsUnread })}
                icon={<BoltIcon />}
                label="Notifications"
                onClick={isElloAndroid() || isTruncatedHeader ? null : onClickNotification}
                pathname={pathname}
                to={`/notifications${notificationCategory}`}
              />
              <NavbarLink
                className="IconOnly"
                icon={<SearchIcon />}
                label="Search"
                pathname={pathname}
                to="/search"
              />
            </div>
            <NavbarProfile
              artistInvitesInProfileMenu={artistInvitesInProfileMenu}
              avatar={avatar}
              isBrand={isBrand}
              isProfileMenuActive={isProfileMenuActive}
              isStaff={isStaff}
              onClickAvatar={onClickAvatar}
              onLogOut={onLogOut}
              username={username}
              innerWidth={innerWidth}
            />
            {isTruncatedHeader && !isLayoutToolHidden ?
              <NavbarLayoutTool
                icon={isGridMode ? <ListIcon /> : <GridIcon />}
                onClick={onClickToggleLayoutMode}
              /> : null
            }
            <NavbarOmniButton
              onClick={onClickOmniButton}
              onDragOver={onDragOverOmniButton}
            />
            {!isTruncatedHeader && isNotificationsActive ?
              <NotificationsContainer isModal /> : null
            }
          </div>
        </div>
        {categoryTabs && !isLightBoxActive &&
          <CategoryTabBar
            pathname={pathname}
            tabs={categoryTabs}
            areCategoriesSubscribed={areCategoriesSubscribed}
            subscribed
            deviceSize={deviceSize}
          />
        }
      </div>
      <div className={`grabber ${grabberStyle}`} />
    </nav>
  )
}

NavbarLoggedIn.propTypes = {
  artistInvitesInProfileMenu: PropTypes.bool.isRequired,
  avatar: PropTypes.object,
  categoryTabs: PropTypes.array,
  areCategoriesSubscribed: PropTypes.bool,
  deviceSize: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  hasLoadMoreButton: PropTypes.bool.isRequired,
  isBrand: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool,
  isLightBoxActive: PropTypes.bool,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isNotificationsActive: PropTypes.bool.isRequired,
  isNotificationsUnread: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  notificationCategory: PropTypes.string.isRequired,
  onClickAvatar: PropTypes.func.isRequired,
  onClickLoadMorePosts: PropTypes.func.isRequired,
  onClickNavbarMark: PropTypes.func.isRequired,
  onClickNotification: PropTypes.func.isRequired,
  onClickOmniButton: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
  onDragLeaveStreamLink: PropTypes.func.isRequired,
  onDragOverOmniButton: PropTypes.func.isRequired,
  onDragOverStreamLink: PropTypes.func.isRequired,
  onDropStreamLink: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  username: PropTypes.string,
  innerWidth: PropTypes.number,
}
NavbarLoggedIn.defaultProps = {
  avatar: null,
  categoryTabs: null,
  areCategoriesSubscribed: false,
  isGridMode: false,
  isLightBoxActive: false,
  username: null,
  innerWidth: null,
}
NavbarLoggedIn.contextTypes = {
  onClickArtistInvites: PropTypes.func.isRequired,
}
