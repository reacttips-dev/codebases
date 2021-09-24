import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import UserContainer from '../../containers/UserContainer'
import CategoryInfoTriggerContainer from '../../containers/CategoryInfoTriggerContainer'
import CategorySubscribeButtonContainer from '../../containers/CategorySubscribeButtonContainer'
import CategoryRolesContainer from '../../containers/CategoryRolesContainer'
import {
  BadgeFeaturedIcon,
  CheckCircleIcon,
  ChevronIcon,
  XIcon,
} from '../assets/Icons'
import { RoundedRectLink } from '../buttons/Buttons'
import { HeroPromotionCTA } from './../heros/HeroParts'
import { before, css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const categoryCheckStyle = css(
  s.absolute,
  s.inlineBlock,
  {
    marginLeft: -44,
    marginTop: -6,
    width: 40,
    transform: 'scale(1.6)',
  },
  select('& .svg-stroke-bevel', s.strokeGreen),
  select('& circle', s.strokeGreen),

  media(s.maxBreak2,
    {
      marginLeft: -28,
      marginTop: -2,
      width: 28,
      transform: 'none',
    },
  ),
  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    {
      marginLeft: -25,
      marginTop: -2,
      width: 26,
      transform: 'scale(0.86)',
    },
  ),
)

export function CategorySubscribedIcon({ isSubscribed }) {
  if (!isSubscribed) { return null }
  return (
    <span className={`category-check ${categoryCheckStyle}`}>
      <CheckCircleIcon />
    </span>
  )
}
CategorySubscribedIcon.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
}

const categorySubscribeButtonStyle = css(
  s.bgcGreen,
  s.colorWhite,
  {
    padding: '5px 15px 5px 6px',
    borderRadius: 100,
    transition: `background-color 0.2s ${s.ease}`,
  },
  hover(s.bgcDarkGreen),
  select('&.subscribed',
    s.bgcA,
    hover(s.bgcBlack),
  ),
  select('& .label',
    s.fontSize12,
    s.inlineBlock,
    s.pl10,
    { paddingTop: 4 },
  ),
  select('& .CheckCircleIcon', s.inlineBlock, { marginTop: -2 }),
)

export function CategorySubscribeButton({ isSubscribed, subscribe, unsubscribe }) {
  return (
    <button
      className={`${categorySubscribeButtonStyle} subscribe-button${isSubscribed ? ' subscribed' : ''}`}
      onClick={!isSubscribed ? subscribe : unsubscribe}
    >
      <CheckCircleIcon />
      <span className="label">
        {!isSubscribed ? 'Subscribe' : 'Subscribed'}
      </span>
    </button>
  )
}
CategorySubscribeButton.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}

const categorySubNavStyle = css(
  s.relative,
  s.fullWidth,
  s.pt20,
  s.pb0,
  s.center,
  s.resetList,

  media(s.minBreak2,
    s.pt40,
    s.pb20,
  ),

  select('& li',
    s.inlineBlock,
    {
      marginRight: 15,
      marginLeft: 15,
    },
    select('& a',
      s.fontSize16,
      s.colorA,
      {
        border: 'none',
      },

      media(s.minBreak2,
        s.fontSize18,
      ),
    ),

    select('&.selected',
      select('& a',
        s.colorBlack,
        s.borderBottom,
        { borderBottomWidth: 2 },
      ),
    ),
  ),

  // style mobile-specific version
  media(s.maxBreak2,
    s.flex,
    s.flexNoWrap,
    s.pr10,
    s.pl10,

    select('& li',
      s.relative,
      s.inlineBlock,
      s.fullWidth,
      s.m0,
      s.center,
      s.borderBottom,
      {
        borderColor: '#aaa',
      },
      select('& a',
        s.fontSize14,
        { borderWidth: '0' },
      ),
      select('&.selected',
        { borderColor: '#000' },
        select('& a',
          { borderWidth: '0' },
        ),
      ),
    ),
    select('&.global li',
      { width: '33.3333333%' },
    ),
  ),
)

export function CategorySubNav({ stream, kind }) {
  if (stream === 'global') {
    return (
      <ul className={`category-sub-nav global ${categorySubNavStyle}`}>
        <li className={classNames({ selected: kind === 'featured' })}>
          <Link to="/discover">
            Featured
          </Link>
        </li>
        <li className={classNames({ selected: kind === 'trending' })}>
          <Link to="/discover/trending">
            Trending
          </Link>
        </li>
        <li className={classNames({ selected: kind === 'recent' })}>
          <Link to="/discover/recent">
            Recent
          </Link>
        </li>
        <li className={classNames({ selected: kind === 'shop' })}>
          <Link to="/discover/shop">
            Shop
          </Link>
        </li>
      </ul>
    )
  }
  return (
    <ul className={`category-sub-nav ${categorySubNavStyle}`}>
      <li className={classNames({ selected: kind === 'featured' })}>
        <Link to={`/discover/${stream}`}>
          Featured
        </Link>
      </li>
      <li className={classNames({ selected: kind === 'trending' })}>
        <Link to={`/discover/${stream}/trending`}>
          Trending
        </Link>
      </li>
      <li className={classNames({ selected: kind === 'recent' })}>
        <Link to={`/discover/${stream}/recent`}>
          Recent
        </Link>
      </li>
      <li className={classNames({ selected: kind === 'shop' })}>
        <Link to={`/discover/${stream}/shop`}>
          Shop
        </Link>
      </li>
    </ul>
  )
}
CategorySubNav.propTypes = {
  stream: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
}

const categoryCardLinkStyle = css(
  s.absolute,
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  s.fullHeight,
  s.bgcBlack,
  { backgroundSize: 'cover' },
  before(
    s.absolute,
    s.flood,
    s.zIndex2,
    s.transitionBgColor,
    { content: '""', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  ),
  hover(before({ backgroundColor: 'rgba(0, 0, 0, 0.3)' })),

  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    s.block,
  ),
)

const CategoryCardLink = ({ children, imageUrl, to }) => (
  <Link
    className={categoryCardLinkStyle}
    to={to}
    style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : null}
  >
    {children}
  </Link>
)
CategoryCardLink.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string,
  to: PropTypes.string.isRequired,
}

CategoryCardLink.defaultProps = {
  imageUrl: null,
}

const categoryCardTitleStyle = css(
  s.relative,
  s.block,
  s.mAuto,
  s.colorWhite,
  s.fontSize32,
  s.center,
  s.zIndex3,
  { width: 'calc(100% - 100px)' },

  media(s.maxBreak2,
    s.fontSize18,
  ),
  media('(max-width: 26.25em)', // 420 / 16 = 26.25em
    s.fontSize16,
    { width: 'calc(100% - 50px)' },
  ),

  select('& .category-check',
    { marginTop: -6 },
    media(s.maxBreak2,
      { marginTop: -2 },
    ),
  ),
)

const CategoryCardTitle = ({ name, isSubscribed }) => (
  <span className={`${categoryCardTitleStyle} title-holder`}>
    <CategorySubscribedIcon isSubscribed={isSubscribed} />
    <span className="label">{name}</span>
  </span>
)
CategoryCardTitle.propTypes = {
  name: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool,
}
CategoryCardTitle.defaultProps = {
  isSubscribed: false,
}

// Card for /discover/all
const categoryCardStyle = css(
  s.relative,
  s.block,
  {
    margin: '0 20px 40px 20px',
    width: 'calc(25% - 40px)',
    paddingBottom: 'calc(25% - 40px)',
  },

  media(s.maxBreak4,
    {
      margin: '0 10px 20px 10px',
      width: 'calc(33.3333333% - 20px)',
      paddingBottom: 'calc(33.3333333% - 20px)',
    },
  ),
  media(s.maxBreak3,
    {
      width: 'calc(50% - 20px)',
      paddingBottom: 'calc(50% - 20px)',
    },
  ),
  media(s.maxBreak2,
    {
      margin: '0 5px 10px 5px',
      width: 'calc(50% - 10px)',
      paddingBottom: 'calc(50% - 10px)',
    },
  ),

  media(s.minBreak5,
    {
      width: 'calc(20% - 40px)',
      paddingBottom: 'calc(20% - 40px)',
    },
  ),
  media(s.minBreak6,
    {
      width: 'calc(16.666666667% - 40px)',
      paddingBottom: 'calc(16.666666667% - 40px)',
    },
  ),
  media(s.minBreak7,
    {
      width: 'calc(14.28571429% - 40px)',
      paddingBottom: 'calc(14.28571429% - 40px)',
    },
  ),

  // featured badge
  select('& .featured-badge',
    s.absolute,
    s.zIndex2,
    { top: 10, right: -5 },
    media(s.maxBreak2,
      { top: 3, right: -7 },
      select('& .BadgeFeaturedIcon',
        { transform: 'scale(0.64)' },
      ),
    ),
  ),

  // subscribe button positioning
  select('& .button-holder',
    s.absolute,
    s.flex,
    s.justifyCenter,
    s.fullWidth,
    s.zIndex3,
    { bottom: 40 },

    media(s.maxBreak2,
      { bottom: 20 },
    ),
  ),
  select('& .title-holder',
    media('(max-width: 26.25em)', // 420 / 16 = 26.25em
      { top: 20 },
    ),
  ),
)

export const CategoryCard = ({
  categoryId,
  imageUrl,
  isSubscribed,
  isPromo,
  name,
  to,
}) => (
  <li className={categoryCardStyle}>
    <CategoryCardLink imageUrl={imageUrl} to={to}>
      {isPromo &&
        <span className="featured-badge">
          <BadgeFeaturedIcon />
        </span>
      }
      <CategoryCardTitle
        className="title-holder"
        name={name}
        isSubscribed={isSubscribed}
      />
      <span className="button-holder">
        <CategorySubscribeButtonContainer
          categoryId={categoryId}
        />
      </span>
    </CategoryCardLink>
  </li>
)
CategoryCard.propTypes = {
  categoryId: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  isSubscribed: PropTypes.bool.isRequired,
  isPromo: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

CategoryCard.defaultProps = {
  imageUrl: null,
}

// footer for /discover/all style
const categoryAllFooterStyle = css(
  s.fixed,
  s.flex,
  s.fullWidth,
  s.itemsCenter,
  s.justifyCenter,
  s.bgcF2,
  s.zIndex4,
  {
    bottom: 0,
    left: 0,
    height: 50,
  },
  media(s.minBreak2,
    { height: 80 },
  ),
)

export const CategoryAllFooter = () => (
  <footer className={categoryAllFooterStyle}>
    <p>
      <RoundedRectLink
        to="/discover/subscribed"
        className=""
      >
        View Subscriptions
      </RoundedRectLink>
    </p>
  </footer>
)

const categoryInfoCollapsedStyle = css(
  s.absolute,
  s.m0,
  s.pt20,
  s.zIndex2,
  { top: 0, right: 20 },

  media(s.minBreak2,
    s.pt40,
    { right: 40 },
  ),

  select('& .label',
    s.fontSize16,
    s.colorA,

    media(s.minBreak2,
      s.fontSize18,
    ),
  ),
  select('& .icon',
    s.inlineBlock,
    s.rotate180,
    s.ml10,
    {
      paddingBottom: 18,
      width: 16,
      height: 16,
    },
    select('& svg polyline',
      { stroke: '#aaa' },
    ),
  ),

  // hide on mobile
  media(s.maxBreak2, s.displayNone),
)

const categoryInfoExpandedStyle = css(
  s.relative,
  s.pr20,
  s.pl20,
  s.mt40,
  s.mb20,
  { borderLeft: '1px solid #f2f2f2' },

  media(s.maxBreak2,
    s.pr10,
    s.pl10,
    s.mt20,
  ),

  select('& h2',
    s.m0,
    s.mb20,
    s.fullWidth,
    s.fontSize16,
    s.colorA,
    {
      paddingBottom: 5,
      borderBottom: '1px solid #f2f2f2',
    },

    media(s.minBreak2,
      s.fontSize18,
    ),

    media(s.maxBreak2,
      s.displayNone,
    ),
  ),

  select('& h3, & h4',
    s.pt10,
    s.sansBlack,
    s.fontSize14,
    s.colorA,
  ),

  select('& h4',
    s.mb10,
  ),

  select('& .subscribe-button',
    s.mb20,
    media(s.maxBreak2, s.displayNone),
  ),

  select('& .description',
    s.mb20,
    { borderBottom: '1px solid #f2f2f2' },
    select('& p',
      s.colorA,
    ),

    select('& .main',
      select('& p',
        s.colorBlack,
      ),
    ),
  ),

  select('& .users-holder',
    s.relative,
    s.mb20,
    {
      paddingBottom: 15,
      borderBottom: '1px solid #f2f2f2',
    },
    select(':last-child',
      s.mb0,
      s.pb0,
      { borderBottomWidth: 0 },
    ),
    select('& .roles-holder',
      select('& .open-trigger',
        s.absolute,
        { top: 9, right: 0 },
      ),
    ),
    select('& .remove-role',
      s.absolute,
      { top: 10, right: 0 },
    ),
  ),

  select('& .moderators, & .curators',
    s.resetList,
  ),

  select('& .close-trigger',
    s.absolute,
    s.block,
    {
      top: 0,
      right: 20,
      width: 16,
      height: 20,
    },
    select('& .label',
      s.displayNone,
    ),
    select('& .icon svg line',
      s.block,
      {
        stroke: '#aaa',
        transition: 'stroke 0.2s ease',
      },
    ),
    hover(
      select('& .icon svg line',
        { stroke: '#000' },
      ),
    ),
    // hide on mobile
    media(s.maxBreak2, s.displayNone),
  ),
)

export function CategoryInfo({
  category,
  ctaCaption,
  ctaHref,
  ctaTrackingLabel,
  categoryUsers,
  collapsed,
  innerWidth,
  name,
}) {
  const isCloseable = !category.get('brandAccountId')
  const categoryCurators = categoryUsers.filter(categoryUser => categoryUser.get('role') === 'CURATOR')
  const categoryModerators = categoryUsers.filter(categoryUser => categoryUser.get('role') === 'MODERATOR')
  const categoryId = category.get('id')
  const description = category.get('description')
  const showRules = false // hide this for now

  if (collapsed && isCloseable) {
    return (
      <p className={categoryInfoCollapsedStyle}>
        <CategoryInfoTriggerContainer
          isCloseable={isCloseable}
          name={name}
        />
      </p>
    )
  }
  return (
    <aside className={`sidebar ${categoryInfoExpandedStyle}`}>
      <CategoryInfoTriggerContainer
        isCloseable={isCloseable}
        name={name}
      />
      <h2>
        Info
      </h2>
      <CategorySubscribeButtonContainer
        categoryId={categoryId}
      />
      {(description || showRules) &&
        <article className="description">
          {description &&
            <section className="main">
              <p>
                {description}
              </p>
              <p>
                <HeroPromotionCTA
                  caption={ctaCaption}
                  to={ctaHref}
                  label={ctaTrackingLabel}
                />
              </p>
            </section>
          }

          {showRules &&
            <section className="sub-section">
              <h3>Rules</h3>
              <p>
                Discover a diverse range of visual and performance work that explores many forms,
                genres, and styles including traditional techniques such as painting, drawing,
                and sculpting, as well as more contemporary forms such as site specific art,
                digital, and virtual reality.
              </p>
            </section>
          }
        </article>
      }
      <section className="moderators-curators">
        <CategoryUsers
          categoryId={categoryId}
          categoryModerators={categoryModerators}
          innerWidth={innerWidth}
        />
        <CategoryUsers
          categoryId={categoryId}
          categoryCurators={categoryCurators}
          innerWidth={innerWidth}
        />
      </section>
    </aside>
  )
}
CategoryInfo.propTypes = {
  category: PropTypes.object.isRequired,
  categoryUsers: PropTypes.array.isRequired,
  collapsed: PropTypes.bool.isRequired,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  ctaTrackingLabel: PropTypes.string,
  innerWidth: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}
CategoryInfo.defaultProps = {
  ctaCaption: null,
  ctaHref: null,
  ctaTrackingLabel: null,
}

const categoryUsersStyle = css(
  select('& li.category-user',
    s.relative,
    s.mb0,
    select('& .UserCompact',
      s.m0,
      // hack to kill Edit Profile button
      select('& .RelationshipContainer a.FollowButton', s.displayNone),
      // adjust Relationship button height
      select('& .RelationshipContainer button.FollowButton',
        { marginTop: 5 },
        select('& span', s.displayNone),
      ),
    ),

    media(s.minBreak3,
      s.mb10,
      select(':last-child',
        s.m0,
      ),
    ),
  ),
)

const CategoryUsers = ({ categoryId, categoryCurators, categoryModerators }) => {
  const kind = categoryCurators ? 'curators' : 'moderators'
  const title = kind === 'curators' ? 'Curators' : 'Moderators'
  const categoryUsers = categoryCurators || categoryModerators

  if (!categoryUsers.length > 0) {
    return null
  }

  return (
    <nav className={`${kind}-holder users-holder`}>
      <CategoryRolesContainer
        actionType="add"
        categoryId={categoryId}
        roleType={kind}
      />
      <h4>{title}</h4>
      <ul className={`${kind} ${categoryUsersStyle}`}>
        {categoryUsers.map((categoryUser) => {
          const key = categoryUser.get('id')
          const userId = categoryUser.get('userId')

          return (
            <li
              key={key}
              className="category-user"
            >
              <UserContainer
                categoryId={categoryId}
                roleType={kind}
                userId={userId}
                type="roles"
                useSmallRelationships
              />
              <CategoryRolesContainer
                actionType="remove"
                categoryId={categoryId}
                roleType={kind}
                userId={userId}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
CategoryUsers.propTypes = {
  categoryId: PropTypes.string.isRequired,
  categoryCurators: PropTypes.array,
  categoryModerators: PropTypes.array,
}
CategoryUsers.defaultProps = {
  categoryCurators: null,
  categoryModerators: null,
}

export function CategoryInfoTrigger({
  collapsed,
  handleTriggerClick,
  name,
  isCloseable,
}) {
  if (collapsed && isCloseable) {
    return (
      <button
        className="category-info open-trigger"
        title={`${name} info`}
        onClick={handleTriggerClick}
      >
        <span className="label">
          Info
        </span>
        <span className="icon">
          <ChevronIcon />
        </span>
      </button>
    )
  }

  return (
    <button
      className="category-info close-trigger"
      title={`Close ${name} info`}
      onClick={handleTriggerClick}
    >
      <span className="label">
        Close
      </span>
      {isCloseable &&
        <span className="icon">
          <XIcon />
        </span>
      }
    </button>
  )
}
CategoryInfoTrigger.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  handleTriggerClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isCloseable: PropTypes.bool.isRequired,
}
