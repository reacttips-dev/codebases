import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { BadgeFeaturedIcon } from '../assets/Icons'
import { before, css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const backgroundStyles = source => ({
  backgroundImage: `url("${source}")`,
})

// single tab style
const categoryTabStyle = css(
  s.relative,
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fullWidth,
  s.fullHeight,
  s.pt0,
  s.pb0,
  s.pr10,
  s.pl10,
  s.overflowHidden,
  s.alignTop,
  s.bgcBlack,
  s.transitionColor,
  {
    minWidth: 100,
    whiteSpace: 'normal',
    backgroundSize: 'cover',
  },

  before(
    s.absolute,
    s.flood,
    s.zIndex1,
    s.transitionBgColor,
    {
      content: '""',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  ),

  select('& + &',
    {
      borderLeft: '1px solid #fff',
    },
  ),

  // text label
  select('& .text-label-holder',
    s.relative,
    s.inlineBlock,
    s.fullWidth,
    s.center,
    s.zIndex2,
    { paddingTop: 1 },
  ),

  // featured badge
  select('& .featured-badge',
    s.absolute,
    s.zIndex2,
    { top: 2, right: -7 },
    select('& .BadgeFeaturedIcon',
      { transform: 'scale(0.64)' },
    ),
    media(s.maxBreak2,
      { top: -2, right: -12 },
    ),
  ),

  // hover / active states
  select('&.isActive',
    select('& .text-label',
      s.inline, { borderBottom: '2px solid #fff' },
    ),
    before({ backgroundColor: 'rgba(0, 0, 0, 0.8)' }),
  ),
  select('&:active',
    select('& .text-label',
      s.inline, { borderBottom: '2px solid #fff' },
    ),
    before({ backgroundColor: 'rgba(0, 0, 0, 0.8)' }),
  ),
  select('.no-touch &:hover',
    before({ backgroundColor: 'rgba(0, 0, 0, 0.8)' }),
  ),

  // mini
  select('&.mini',
    {
      width: 100,
    },
    media(s.minBreak2,
      {
        width: 120,
      },
    ),
  ),
  select('&.mini.all',
    {
      width: 50,
      minWidth: 50,
      background: 'linear-gradient(50deg, #ff00ff, #1925ff)',
    },
    media(s.minBreak2,
      {
        width: 60,
        minWidth: 60,
      },
    ),
  ),
  select('&.mini.subscribed', {
    background: 'linear-gradient(45deg, #6e00ff, #0054ff, #007bf1, #00beff)',
  }),

  // zero state
  select('&.zero-state',
    {
      width: 'calc(100% - 200px)',
      minWidth: '50%',
      background: 'linear-gradient(85deg, #fd00d2, #6200ff, #0038ff, #0083fc, #00d8c6, #00ff70, #00ff36)',
    },
    media(s.minBreak2,
      {
        width: 'calc(100% - 240px)',
      },
    ),
  ),

  media(s.minBreak2,
    {
      minWidth: 120,
    },
  ),
)

const CategoryTab = ({ isActive, label, source, promo, to }) => (
  <Link
    className={classNames({ isActive }, `${categoryTabStyle}`)}
    to={to}
    style={source ? backgroundStyles(source) : null}
  >
    {promo &&
      <span className="featured-badge">
        <BadgeFeaturedIcon />
      </span>
    }
    <span className="text-label-holder">
      <span className="text-label">{label}</span>
    </span>
  </Link>
)
CategoryTab.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  source: PropTypes.string,
  promo: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
}
CategoryTab.defaultProps = {
  source: null,
}

const AllCategoryTab = ({ pathname }) => {
  const isActive = pathname === '/discover' ||
    pathname === '/discover/trending' ||
    pathname === '/discover/recent' ||
    pathname === '/discover/shop'
  return (
    <Link
      className={classNames('mini all', { isActive }, `${categoryTabStyle}`)}
      to="/discover"
    >
      <span className="text-label-holder">
        <span className="text-label">All</span>
      </span>
    </Link>
  )
}
AllCategoryTab.propTypes = {
  pathname: PropTypes.string.isRequired,
}

const SubscribedCategoryTab = ({ pathname }) => {
  const isActive = pathname === '/discover/subscribed' ||
    pathname === '/discover/subscribed/trending' ||
    pathname === '/discover/subscribed/recent' ||
    pathname === '/discover/subscribed/shop'
  return (
    <Link
      className={classNames('mini subscribed', { isActive }, `${categoryTabStyle}`)}
      to="/discover/subscribed"
    >
      <span className="text-label-holder">
        <span className="text-label">Subscribed</span>
      </span>
    </Link>
  )
}
SubscribedCategoryTab.propTypes = {
  pathname: PropTypes.string.isRequired,
}

const SubscribedZeroStateTab = () => (
  <Link
    className={`zero-state ${categoryTabStyle}`}
    to="/discover/all"
  >
    <span className="text-label-holder">
      <span className="text-label">Find and subscribe to a category</span>
    </span>
  </Link>
)

// main tab bar style
const categoryTabBarStyle = css(
  s.absolute,
  s.zIndex2,
  s.fontSize12,
  s.colorWhite,
  s.nowrap,
  s.bgcBlack,
  s.borderBottom,
  {
    right: 0,
    bottom: -70,
    left: 0,
    height: 70,
    borderColor: '#fff',
  },
  media('(max-width: 23.375em)', // 374 / 16 = 23.375em
    {
      bottom: -50,
      height: 50,
    },
  ),
  media(s.maxBreak2,
    select('.isProfileMenuActive .Navbar ~ &',
      s.displayNone,
    ),
  ),
  media(s.minBreak2,
    s.fontSize14,
    {
      bottom: -80,
      height: 80,
    },
  ),
)

// nav tag that holds all of the tabs style
const categoryTabsHolderStyle = css(
  s.relative,
  s.flex,
  s.fullHeight,
  s.overflowScrollWebX,
  s.nowrap,
  s.alignTop,
  {
    width: 'calc(100% - 70px)',
  },
  media(s.minBreak2,
    s.fontSize14,
    {
      width: 'calc(100% - 90px)',
    },
  ),
)

// tab bar tools style
const categoryTabBarToolsStyle = css(
  s.absolute,
  s.inlineBlock,
  s.fullHeight,
  s.pr10,
  s.rightAlign,
  s.alignTop,
  s.bgcBlack,
  {
    width: 70,
    top: 0,
    right: 0,
  },

  before(
    s.absolute,
    s.zIndex2,
    s.wv20,
    s.fullHeight,
    {
      content: '""',
      top: 0,
      left: -20,
      background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 90%)',
    },
  ),

  media(s.minBreak2,
    s.pr20,
    {
      width: '90px',
    },
    before(
      s.wv30,
      {
        left: -30,
      },
    ),
  ),

  // style Edit link
  select('& .edit',
    s.flex,
    s.fullWidth,
    s.fullHeight,
    s.flexColumn,
    s.justifyCenter,
    s.center,
  ),
)

function isImageSizeLarge(deviceSize, tabsCount) {
  let imageSizeLarge = false

  if (deviceSize === 'mobile') {
    if (tabsCount < 4) {
      imageSizeLarge = true
    }
    return imageSizeLarge
  }

  if (tabsCount < 10) {
    imageSizeLarge = true
  }
  return imageSizeLarge
}

export const CategoryTabBar = ({
  pathname,
  tabs,
  subscribed,
  areCategoriesSubscribed,
  deviceSize,
}) => (
  <div className={categoryTabBarStyle}>
    <nav className={categoryTabsHolderStyle}>
      <AllCategoryTab pathname={pathname} />
      {subscribed && <SubscribedCategoryTab pathname={pathname} />}

      {tabs.map(tab =>
        (<CategoryTab
          isActive={
            (
              tab.activePattern ?
              tab.activePattern.test(pathname) :
              tab.to === pathname.replace('/trending', '').replace('/recent', '').replace('/shop', '')
            )
          }
          key={`CategoryTab_${tab.to}`}
          label={tab.label}
          source={isImageSizeLarge(deviceSize, tabs.length) ? tab.sources.large : tab.sources.small}
          promo={tab.promo}
          to={tab.to}
        />),
      )}

      {subscribed && (tabs.length < 1 || !areCategoriesSubscribed) && <SubscribedZeroStateTab />}
    </nav>
    <div className={categoryTabBarToolsStyle}>
      <Link
        activeClassName="isActive"
        className="edit"
        to="/discover/all"
      >
        <span>Edit</span>
      </Link>
    </div>
  </div>
)
CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  subscribed: PropTypes.bool.isRequired,
  areCategoriesSubscribed: PropTypes.bool.isRequired,
  tabs: PropTypes.array.isRequired,
  deviceSize: PropTypes.string.isRequired,
}

CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}

export default CategoryTabBar
