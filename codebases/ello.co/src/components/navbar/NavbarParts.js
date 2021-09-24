import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import Avatar from '../assets/Avatar'
import {
  ArrowIcon,
  ElloLogoType,
  PencilIcon,
  XIconLG,
} from '../assets/Icons'
import {
  active,
  after,
  before,
  css,
  hover,
  media,
  modifier,
  parent,
  select,
} from '../../styles/jss'
import * as s from '../../styles/jso'
import * as ENV from '../../../env'

// -------------------------------------

const layoutToolStyle = css(
  s.absolute,
  { top: 2, left: 145 },
  s.colorA,
)
export const NavbarLayoutTool = ({ icon, onClick }) => (
  <button className={layoutToolStyle} onClick={onClick} >
    {icon}
  </button>
)

NavbarLayoutTool.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

// -------------------------------------
const linkLabelStyle = css(
  s.relative,
  s.inlineBlock,
  parent('.NavbarLink.isActive >', s.colorBlack),
  parent('.NavbarLink:active >', s.colorBlack),
  parent('.no-touch .NavbarLink:hover >', s.colorBlack),
  parent('.NavbarLink.isSignUp.isActive >', s.colorWhite),
  parent('.NavbarLink.isSignUp:active >', s.colorWhite),
  parent('.no-touch .NavbarLink.isSignUp:hover >', s.colorWhite),
  select('.NavbarLink.isActive > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink:active > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink:hover > &::after', s.fullWidth, s.bgcCurrentColor),
  select('.NavbarLink.isNotificationsUnread > &::before',
    s.absolute,
    { top: 5, left: -5, width: 5, height: 5, content: '""', borderRadius: '50%' },
    s.bgcRed,
  ),
  select('.no-touch .NavbarLink.isNotificationsUnread:hover > > &::before',
    { left: -7, width: 7, height: 7 },
  ),
  after(
    s.absolute,
    { bottom: 8, left: 0, width: 0, height: 2, content: '""' },
    s.bgcTransparent,
    { transition: `width 0.2s ${s.ease}, background-color 0.2s ease` },
  ),
  parent('.NavbarLink.isSignUp', after(s.displayNone)),
  parent('.no-touch .NavbarLink.IconOnly:hover >', after({ transitionDelay: '0.6s' })),
)

// TODO: Move over styles from Icons
const linkStyle = css(
  s.relative,
  s.hv40,
  s.lh40,
  s.overflowHidden,
  s.fontSize14,
  s.colorA,
  s.nowrap,
  s.alignMiddle,
  { transition: `width 0.2s ${s.ease}, color 0.2s ease, background-color 0.2s ease` },
  before(s.hitarea),
  modifier('.isSignUp',
    { width: 80, borderRadius: 5, right: 0 },
    s.absolute,
    s.hv30,
    s.lh30,
    s.colorWhite,
    s.center,
    s.bgcGreen,
    active({ backgroundColor: '#00b100' }),
    hover({ backgroundColor: '#00b100' }),
    modifier('.isActive', { backgroundColor: '#00b100' }),
  ),
  select('[data-dragging-priority="noise"] &[href="/following"]', s.px10, s.bgcYellow),
  select('[data-dragging-priority="inactive"] &[href="/following"]', s.px10, s.bgcYellow),
  select('[data-dragging-priority="noise"] &.hasDragOver[href="/following"]', { backgroundColor: '#cfc' }),
  select('[data-dragging-priority="inactive"] &.hasDragOver[href="/following"]', { backgroundColor: '#cfc' }),
  select('.isLoggedOut &[href="/enter"]', s.absolute, s.m0, { top: 0, left: 'auto', right: 110 }),
  select('.NavbarLinks > & + &', s.ml30),
  media(s.maxBreak3,
    s.mt30,
    select('.isLoggedOut .NavbarLinks > & + &', { marginLeft: 18 }),
    select('.isLoggedIn &[href^="/notifications"]', s.absolute, s.m0, { top: -3, left: 55 }),
    select('.isLoggedIn &[href^="/search"]', s.absolute, s.m0, { top: -3, left: 100 }),
    select('.isLoggedOut &[href^="/search"]', s.absolute, s.m0, { top: -5, left: 60 }),
    select('.isLoggedOut &[href="/join"]', s.absolute, s.m0, { top: 0, left: 'auto', right: 0 }),
    select('.isLoggedOut &[href="/confirm"]', s.absolute, s.m0, { top: 0, left: 'auto', right: 0 }),
    select('.isLoggedOut &[href="/enter"]', { top: -5, right: 100 }),
  ),
  media(s.minBreak3, modifier('.isSignUp', s.hv40, s.lh40)),
)

const highlightingRules = {
  '/following': /^\/following/,
  '/creative-briefs': /(^\/creative-briefs$)|^\/creative-briefs(?:\/.*\.?.*)/,
  '/discover/subscribed': /^\/discover/,
}

export const NavbarLink = ({
  className = '',
  icon,
  label,
  onClick,
  onDragLeave,
  onDragOver,
  onDrop,
  pathname,
  to,
}) => {
  const klassNames = classNames(
    'NavbarLink',
    className,
    `${linkStyle}`,
    {
      isActive: highlightingRules[to] ? pathname.match(highlightingRules[to]) : pathname === to,
    },
  )
  return (
    <Link
      className={klassNames}
      onClick={onClick}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      to={to}
    >
      {icon || null}
      <span className={linkLabelStyle}>{label}</span>
    </Link>
  )
}

NavbarLink.propTypes = {
  className: PropTypes.string.isRequired,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  pathname: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}
NavbarLink.defaultProps = {
  icon: null,
  onClick: null,
  onDragLeave: null,
  onDragOver: null,
  onDrop: null,
}

// -------------------------------------
const markStyle = css(
  { marginTop: -2 },
  s.relative,
  parent('.isLoggedIn', s.displayNone),
  parent('.isLoggedOut', s.inlineBlock),
  media(s.minBreak3,
    { marginTop: 8 },
    parent('.isLoggedIn', s.inlineBlock),
  ),
)

export const NavbarMark = ({ onClick }) => (
  <Link
    className={`NavbarMark ${markStyle}`}
    draggable
    onClick={onClick}
    to="/"
  >
    <ElloLogoType />
  </Link>
)

NavbarMark.propTypes = {
  onClick: PropTypes.func.isRequired,
}

// -------------------------------------

const moreButtonStyle = css(
  {
    borderRadius: '50%',
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.4s ease',
  },
  s.absolute,
  s.bgcA,
  s.borderA,
  s.colorWhite,
  s.fontSize14,
  s.hv30,
  s.lh30,
  s.nowrap,
  s.wv30,
  s.zIndex3,
  parent('.isLoggedIn', { right: 90 }),
  parent('.isLoggedOut', s.displayNone),
  hover(s.color6),
  media(s.minBreak3,
    s.wv40, s.hv40, s.lh40,
    parent('.isLoggedIn', { right: 'auto', left: 80 }),
    parent('.isLoggedOut', s.inlineBlock, { left: 80 }),
    { width: 'auto', paddingRight: 20, paddingLeft: 15, borderRadius: 20 },
  ),
  media(s.minBreak4,
    parent('.isLoggedIn'),
    parent('.isLoggedOut', { left: 140 }),
  ),
)

const moreSpanStyle = css(
  s.displayNone,
  s.alignMiddle,
  { paddingLeft: 8 },
  media(s.minBreak3, s.inlineBlock),
)

export const NavbarMorePostsButton = ({ onClick }) =>
  (<button className={`NavbarMorePostsButton ${moreButtonStyle}`} onClick={onClick} >
    <ArrowIcon />
    <span className={moreSpanStyle}>New Posts</span>
  </button>)
NavbarMorePostsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

// -------------------------------------

const omniButtonStyle = css(
  s.absolute,
  { top: 0, right: 0, borderRadius: 5 },
  s.hv30,
  s.lh30,
  { paddingRight: 15, paddingLeft: 10 },
  s.fontSize14,
  s.colorWhite,
  s.bgcBlack,
  { transition: 'background-color 0.2s ease' },
  hover(s.bgc6),
  media(s.minBreak3,
    { width: 100 },
    s.hv40,
    s.lh40,
  ),
)

export const NavbarOmniButton = ({ onClick, onDragOver }) =>
  (<button className={`NavbarOmniButton ${omniButtonStyle}`} onClick={onClick} onDragOver={onDragOver}>
    <PencilIcon />
    <span>Post</span>
  </button>)

NavbarOmniButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
}

// -------------------------------------

const profilePopStyle = css(
  s.absolute,
  { top: 0, left: 0 },
  s.zIndex4,
  s.transitionTransform,
  // wtf...?
  media(s.maxBreak3,
    select('.isProfileMenuActive ~ .Navbar .NavbarMain > *:not(.NavbarProfile)', s.displayNone),
  ),
  media(s.minBreak3,
    { top: 0, left: 'auto', right: 130 },
    s.zIndex3,
    hover(before(
      s.absolute,
      { top: 15, left: 0, width: 100, height: 30, content: '""' },
      { backgroundColor: 'rgba(0, 0, 0, 0)', transform: 'translateX(-100%)' },
    )),
    parent('.isOmnibarActive .Navbar >', s.absolute, { transform: 'translate3d(400px, 0, 0)' }),
  ),
)

const profileLinksStyle = css(
  s.absolute,
  s.zIndex2,
  { minWidth: 140 },
  s.py5,
  s.px10,
  s.overflowHidden,
  s.colorA,
  s.pointerNone,
  s.bgcWhite,
  s.borderA,
  { borderTop: 0 },
  s.opacity0,
  s.transitionOpacity,
  modifier('.isActive', s.pointerAuto, s.opacity1),
  media(s.maxBreak3, {
    top: -10,
    left: -10,
    width: '100vw',
    height: '100vh',
    padding: 0,
  }),
  media(s.minBreak3,
    {
      top: 40,
      right: 0,
      left: 'auto',
      maxWidth: 180,
    },
    parent('.no-touch .NavbarProfile:hover', s.pointerAuto, s.opacity1),
  ),
)

const profileLinkStyle = css(
  s.block,
  s.hv30,
  s.lh30,
  s.fontSize14,
  s.truncate,
  hover(s.colorBlack),
  media(s.maxBreak3,
    { height: 50, lineHeight: 50, textIndent: 10 },
    s.colorBlack,
    s.borderBottom,
  ),
)

const profileLinkSmallStyle = css(
  s.block,
  { height: 25, lineHeight: 25 },
  s.fontSize12,
  s.truncate,
  s.colorC,
  hover(s.colorBlack),
  media(s.maxBreak3,
    { textIndent: 10 },
    s.hv30,
    s.lh30,
    s.colorBlack,
  ),
)

const dividerStyle = css(
  { margin: '4px -10px', borderColor: '#ccc' },
  media(s.maxBreak3, { borderColor: 'transparent' }),
)

const closeButtonStyle = css(
  s.displayNone,
  s.absolute,
  { top: 5, right: 5 },
  media(s.maxBreak3, s.block),
)

export const NavbarProfile = ({
  artistInvitesInProfileMenu,
  avatar,
  isBrand,
  isProfileMenuActive,
  isStaff,
  onClickAvatar,
  onLogOut,
  username,
}, { onClickArtistInvites }) => {
  if (avatar && username) {
    return (
      <span className={`NavbarProfile ${profilePopStyle}`}>
        <Avatar sources={avatar} onClick={onClickAvatar} />
        <nav className={classNames(`${profileLinksStyle}`, { isActive: isProfileMenuActive })} >
          <Link className={profileLinkStyle} to={`/${username}`}>{`@${username}`}</Link>
          { artistInvitesInProfileMenu &&
            <Link className={profileLinkStyle} onClick={onClickArtistInvites} to="/creative-briefs">Creative Briefs</Link>
          }
          <Link className={profileLinkStyle} to={`/${username}/loves`}>Loves</Link>
          <Link className={profileLinkStyle} to="/invitations">Invite</Link>
          <Link className={profileLinkStyle} to="/settings">Settings</Link>
          {(isBrand || isStaff) &&
            <a className={profileLinkStyle} href="/manage">Analytics</a>
          }
          <hr className={dividerStyle} />
          <a
            className={profileLinkSmallStyle}
            href={`${ENV.AUTH_DOMAIN}/wtf`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Help
          </a>
          <button className={profileLinkSmallStyle} onClick={onLogOut}>Logout</button>
          <button className={closeButtonStyle}>
            <XIconLG />
          </button>
        </nav>
      </span>
    )
  }
  return (
    <span className={`NavbarProfile ${profilePopStyle}`}>
      <Avatar />
    </span>
  )
}
NavbarProfile.propTypes = {
  artistInvitesInProfileMenu: PropTypes.bool.isRequired,
  avatar: PropTypes.object,
  isBrand: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  isProfileMenuActive: PropTypes.bool.isRequired,
  onClickAvatar: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
  username: PropTypes.string,
}
NavbarProfile.defaultProps = {
  avatar: null,
  username: null,
  innerWidth: null,
}
NavbarProfile.contextTypes = {
  onClickArtistInvites: PropTypes.func.isRequired,
}
