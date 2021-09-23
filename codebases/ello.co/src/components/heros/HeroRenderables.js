/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import BackgroundImage from '../assets/BackgroundImage'
import CategoryInfoTriggerContainer from '../../containers/CategoryInfoTriggerContainer'
import CategorySubscribeButtonContainer from '../../containers/CategorySubscribeButtonContainer'
import { CategorySubscribedIcon } from '../categories/CategoryRenderables'
import {
  HeroAppStores,
  HeroPromotionCredits,
  HeroPromotionCTA,
  HeroScrollToContentButton,
  HeroShareUserButton,
  HeroUserRolesButton,
} from './HeroParts'
import Hint from '../hints/Hint'
import { BadgeFeaturedIcon } from '../assets/Icons'
import { ZeroStream } from '../zeros/Zeros'
import UserContainer from '../../containers/UserContainer'
import { css, media, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

// -------------------------------------

const heroStyle = css(
  { paddingTop: 85 },
  s.bgcWhite,
  select('.isOnboardingView ~ &', { paddingTop: '0 !important' }),
  select('.isAuthenticationView ~ &', { paddingTop: '0 !important' }),
  select('.isDiscoverView ~ &', { paddingTop: '160px !important' }),
  media(s.maxBreak2,
    parent('.isLoggedOut', { paddingTop: 80 }),
    select('.isDiscoverView ~ &', { paddingTop: '150px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '120px !important' }),
    select('.isProfileMenuActive ~ &', s.displayNone),
  ),
  media('(max-width: 23.375em)',
    select('.isDiscoverView ~ &', { paddingTop: '130px !important' }),
    select('.isLogged .isDiscoverView ~ &', { paddingTop: '100px !important' }),
  ),
  media(s.minBreak2,
    { paddingTop: 80 },
  ),
)

export const Hero = ({ children }) => (
  <div className={`Hero ${heroStyle}`}>
    {children}
  </div>
)
Hero.propTypes = {
  children: PropTypes.array.isRequired,
}

// -------------------------------------

export const HeroBroadcast = ({ broadcast, onDismiss }) =>
  <ZeroStream onDismiss={onDismiss}>{broadcast}</ZeroStream>

HeroBroadcast.propTypes = {
  broadcast: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// -------------------------------------
const profileStyle = css(
  s.relative, s.flex, s.overflowHidden,
  media(s.minBreak2, { height: 'calc(100vh - 80px)', minHeight: 540 }),
)

export const HeroProfile = ({ dpi, sources, userId, useGif, isRoleAdministrator, userHasRoles }) =>
  (userId === '2694355' || userId === 2694355 ? null : (
    <div className={profileStyle}>
      <BackgroundImage
        className="inHeroProfile hasOverlay6"
        dpi={dpi}
        sources={sources}
        useGif={useGif}
      />
      <UserContainer userId={userId} type="profile" />
      <HeroUserRolesButton isRoleAdministrator={isRoleAdministrator} userHasRoles={userHasRoles} />
      <HeroShareUserButton />
      <HeroScrollToContentButton />
    </div>
  )
  )

HeroProfile.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
  userId: PropTypes.string,
  useGif: PropTypes.bool.isRequired,
  isRoleAdministrator: PropTypes.bool.isRequired,
  userHasRoles: PropTypes.bool.isRequired,
}
HeroProfile.defaultProps = {
  sources: null,
  userId: null,
}

// -------------------------------------

const promotionAuthStyle = css(s.fullscreen)

export const HeroPromotionAuth = (props) => {
  const { creditSources, creditUsername, dpi, sources } = props
  return (
    <div className={promotionAuthStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      {creditUsername ?
        <HeroPromotionCredits sources={creditSources} username={creditUsername} /> : null
      }
      <HeroAppStores />
    </div>
  )
}

HeroPromotionAuth.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object,
}
HeroPromotionAuth.defaultProps = {
  creditSources: null,
  creditUsername: null,
  sources: null,
}

// -------------------------------------
const promotionStyle = css(
  s.relative,
  s.flex,
  s.fullWidth,
  { minHeight: 240 },
  s.overflowHidden,
  s.colorWhite,
  media(s.minBreak2,
    s.itemsCenter,
    {
      minHeight: 380,
    },
  ),
)

const captionStyle = css(
  s.relative, s.py20, s.mx10, s.fontSize14,
  media(s.minBreak2, s.mx20),
  media(s.minBreak4, s.pr40, s.mx40),
)

const categoryCaptionStyle = css(
  s.relative,
  s.py20,
  s.fontSize14,

  media(s.maxBreak2,
    s.px10,
    { minHeight: 200 },
  ),
  media(s.minBreak2,
    s.px0,
    s.mxAuto,
  ),
  media(s.minBreak3,
    s.mxAuto,
    s.px40,
  ),
  media(s.minBreak4,
    s.px40,
  ),
)

const categoryCaptionCollapsedStyle = css(
  { ...categoryCaptionStyle },
  s.flex,
  s.p0,
  s.itemsCenter,
)

const categoryHeadingStyle = css(
  s.sansBlack,
  select('& .category-check',
    select('& svg .svg-stroke-bevel, & svg circle',
      { stroke: '#fff' },
    ),
    select('& svg circle',
      {
        fill: '#00d100',
        stroke: '#00d100',
      },
    ),
  ),
  select('&.unsubscribed',
    select('& .category-check',
      select('& svg circle',
        {
          stroke: '#fff',
          fill: 'none',
        },
      ),
    ),
  ),

  // desktop version
  media(s.minBreak2,
    s.inlineBlock,
    s.center,
    s.pr40,
    s.pl40,
    { paddingTop: 35 },
    select('& .category-check',
      {
        marginLeft: 15,
        marginTop: -2,
        width: 30,
        transform: 'scale(1.75)',
      },
      media(s.maxBreak5,
        {
          marginTop: 14,
        },
      ),
      media(s.maxBreak4,
        {
          marginTop: 10,
        },
      ),
      media(s.maxBreak3,
        {
          marginTop: 8,
          marginLeft: 10,
          transform: 'scale(1.25)',
        },
      ),
    ),
    select('& .label',
      {
        fontSize: 144,
        lineHeight: 1,
        borderBottom: '8px solid',
      },
      media(s.maxBreak5,
        {
          fontSize: '10vw',
          lineHeight: 1.2,
        },
      ),
      media(s.maxBreak4,
        {
          fontSize: '9vw',
          lineHeight: 1.3,
          borderBottom: '7px solid',
        },
      ),
      media(s.maxBreak3,
        {
          fontSize: '8.5vw',
          lineHeight: 1.2,
          borderBottom: '5px solid',
        },
      ),
    ),
  ),

  // mobile version
  media(s.maxBreak2,
    s.pr20,
    s.pl0,
    s.pt0,
    select('& .label',
      s.fontSize56,
      {
        lineHeight: 1,
      },
      select('&.open',
        s.inlineBlock,
        s.pb10,
      ),
    ),
    select('& .category-check',
      {
        marginLeft: 0,
        marginTop: -2,
        width: 26,
        transform: 'scale(1.25)',
      },
    ),
  ),
  media('(max-width: 420px)',
    s.pr0,
    select('& .label',
      {
        fontSize: '13.15vw',
        lineHeight: 1,
      },
      select('&.open',
        s.pr20,
      ),
    ),
  ),
)

const mobileActionStyle = css(s.fullWidth, s.p0, s.fontSize14, s.selfEnd)
const subscribeHolderStyle = css(
  s.relative,
  s.flex,
  s.fullWidth,
  s.justifyCenter,
  s.mt30,
  media(s.maxBreak2,
    s.mt20,
  ),

  select('& .featured-badge',
    s.absolute,
    {
      top: 5,
      left: -38,
    },
  ),
  select('& .subscribe-inner-holder',
    s.relative,
  ),
)

const promotionCategoryStyle = css(
  { ...promotionStyle },
  media(s.maxBreak2, s.flexColumn),
  media(s.minBreak2,
    s.flex,
    s.alignCenter,
  ),
  // category info trigger style (only shows on mobile header)
  select('& .category-info',
    s.absolute,
    s.m0,
    s.p0,
    s.bgcModal,
    {
      padding: '10px 20px 10px 20px',
      bottom: 10,
      left: 10,
      borderRadius: 40,
    },
    select('& .label',
      s.block,
      s.fontSize14,
      s.colorWhite,
      s.p0,
      {
        lineHeight: 12,
      },
    ),
    select('& .icon', s.displayNone),

    // close version
    select('&.close-trigger',
      s.p0,
      {
        top: 10,
        right: 10,
        left: 'auto',
        bottom: 'auto',
        width: 30,
        height: 30,
      },
      select('& .label',
        s.displayNone,
      ),
      select('& .icon',
        s.flex,
        s.itemsCenter,
        s.justifyCenter,
        s.p0,
        select('& svg',
          s.block,
          select('& line',
            { stroke: '#fff' },
          ),
        ),
      ),
    ),
  ),
)

const promotionCategoryCollapsedStyle = css(
  { ...promotionCategoryStyle },
  media(s.maxBreak2,
    s.flex,
    s.justifyCenter,
  ),
)

export const HeroPromotionCategory = (props) => {
  const {
    categoryId,
    creditLabel,
    creditSources,
    creditUsername,
    creditTrackingLabel,
    dpi,
    name,
    sources,
    isPromo,
    isMobile,
    isInfoCollapsed,
    isSubscribed,
  } = props

  // desktop version
  if (!isMobile) {
    return (
      <div className={promotionCategoryStyle}>
        <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
        <div className={categoryCaptionStyle}>
          <h1 className={`${isSubscribed ? 'subscribed' : 'unsubscribed'} ${categoryHeadingStyle}`}>
            <span className="label">{name}</span>
            <CategorySubscribedIcon isSubscribed />
          </h1>
          <span className={subscribeHolderStyle}>
            <span className="subscribe-inner-holder">
              {isPromo &&
                <span className="featured-badge contains-hint">
                  <BadgeFeaturedIcon />
                  <Hint>Featured Category</Hint>
                </span>
              }
            </span>
          </span>
        </div>
        {creditUsername &&
          <HeroPromotionCredits
            collapsed={isInfoCollapsed}
            label={creditLabel}
            sources={creditSources}
            username={creditUsername}
            trackingLabel={creditTrackingLabel}
          />
        }
      </div>
    )
  }

  // mobile version
  return (
    <div>
      <div className={isInfoCollapsed ? promotionCategoryCollapsedStyle : promotionCategoryStyle}>
        <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
        <div className={isInfoCollapsed ? categoryCaptionCollapsedStyle : categoryCaptionStyle}>
          <h1 className={`${isSubscribed ? 'subscribed' : 'unsubscribed'} ${categoryHeadingStyle}`}>
            <span className={`label ${isInfoCollapsed ? 'collapsed' : 'open'}`}>{name}</span>
            {isInfoCollapsed &&
              <CategorySubscribedIcon isSubscribed />
            }
          </h1>
          {!isInfoCollapsed &&
            <CategorySubscribeButtonContainer
              categoryId={categoryId}
            />
          }
        </div>
        <div className={`HeroPromotionMobileActions ${mobileActionStyle}`}>
          {creditUsername &&
            <HeroPromotionCredits
              collapsed={isInfoCollapsed}
              label={creditLabel}
              sources={creditSources}
              username={creditUsername}
              trackingLabel={creditTrackingLabel}
            />
          }
        </div>
        <CategoryInfoTriggerContainer
          name={name}
        />
      </div>
    </div>
  )
}

HeroPromotionCategory.propTypes = {
  categoryId: PropTypes.string.isRequired,
  creditLabel: PropTypes.string.isRequired,
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  creditTrackingLabel: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  isInfoCollapsed: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  sources: PropTypes.object,
  isSubscribed: PropTypes.bool.isRequired,
  isPromo: PropTypes.bool.isRequired,
}
HeroPromotionCategory.defaultProps = {
  creditSources: null,
  creditUsername: null,
  sources: null,
}

// -------------------------------------

const promotionHeadingStyle = css(s.fontSize18, media(s.minBreak2, s.fontSize48))
const promotionSubheadingStyle = css(s.fontSize14, media(s.minBreak2, s.fontSize28))

export const HeroPromotionPage = (props) => {
  const { creditSources, creditUsername, dpi, header, sources, subheader } = props
  const { ctaCaption, ctaHref } = props
  return (
    <div className={promotionStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
      <div className={captionStyle}>
        <h1 className={promotionHeadingStyle}>{header}</h1>
        <h2 className={promotionSubheadingStyle}>{subheader}</h2>
        <HeroPromotionCTA
          caption={ctaCaption}
          to={ctaHref}
          trackingLabel="general"
        />
      </div>
      {creditUsername &&
        <HeroPromotionCredits
          sources={creditSources}
          username={creditUsername}
          trackingLabel="general"
        />
      }
    </div>
  )
}

HeroPromotionPage.propTypes = {
  creditSources: PropTypes.object,
  creditUsername: PropTypes.string,
  ctaCaption: PropTypes.string,
  ctaHref: PropTypes.string,
  dpi: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
  sources: PropTypes.object,
  subheader: PropTypes.string,
}
HeroPromotionPage.defaultProps = {
  creditSources: null,
  creditUsername: null,
  ctaCaption: null,
  ctaHref: null,
  sources: null,
  subheader: null,
}

const headerStyle = css(
  s.relative,
  s.px10,
  s.fullWidth,
  s.colorWhite,
  s.mxAuto,
  { marginTop: 0 },
  { height: 430, maxWidth: 1440 },
  parent('.Editorial', s.px0),
  media(
    s.minBreak2,
    s.px20,
    parent('.Editorial', s.px20),
    { marginTop: 0 },
  ),
  media(
    s.minBreak4,
    { height: 600 },
    s.px40,
    parent('.Editorial', s.px40, s.mb20),
    { marginTop: 0 },
  ),
)

const imageContainerStyle = css(
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.relative,
  { height: 430 },
  media(s.minBreak4, { height: 600 }),
)

const HeroHeaderCaptionStyle = css(
  s.absolute, s.pl20, s.pr20, { width: '100%', left: 0, top: 80 },
  media(s.minBreak2, { paddingLeft: 60, paddingRight: 60, top: 40 }),
  media(s.minBreak3, s.containedAlignMiddle, { paddingLeft: 80, paddingRight: 80, left: 0 }),
  media(s.minBreak4, { paddingLeft: 100, paddingRight: 100 }),
)

const HeroHeaderHeadingStyle = css(
  s.sansBlack, s.fontSize38, { lineHeight: 38 },
  media(s.minBreak2, { fontSize: 60, lineHeight: 60 }),
  media(s.minBreak3, { fontSize: 90, lineHeight: 90 }),
)

const HeroHeaderSubHeadingStyle = css(
  s.sansRegular,
  s.fontSize18,
  { lineHeight: 24, margin: 0 },
  media(s.minBreak2, s.fontSize24, { lineHeight: 30 }),
)

export const HeroHeader = ({
  dpi,
  headerText,
  subHeaderText,
  sources,
  avatarSources,
  username,
}) => (
  <div className={`HeroHeader ${headerStyle}`}>
    <div className={imageContainerStyle}>
      <BackgroundImage className="hasOverlay4" dpi={dpi} sources={sources} />
    </div>
    <div className={HeroHeaderCaptionStyle}>
      <h1 className={HeroHeaderHeadingStyle}>{headerText}</h1>
      <p
        className={HeroHeaderSubHeadingStyle}
        dangerouslySetInnerHTML={{ __html: subHeaderText }}
      />
    </div>
    <HeroPromotionCredits
      label="Posted by"
      sources={avatarSources}
      username={username}
    />
  </div>
)
HeroHeader.propTypes = {
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object.isRequired,
  avatarSources: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired,
  subHeaderText: PropTypes.string.isRequired,
}

