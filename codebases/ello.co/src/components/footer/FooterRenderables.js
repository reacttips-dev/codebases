import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ChevronIcon, ListIcon, GridIcon, RSSIcon } from '../assets/Icons'
import { FooterForm, FooterLink, FooterTool } from '../footer/FooterParts'
import { before, css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(
  s.fixed,
  { right: 0, bottom: -54, left: 0, height: 69 },
  s.zFooter,
  s.colorA,
  modifier('isPaginatoring', select('.footer-content', { transform: 'translate3d(0, -100%, 0)' })),
  select('.isNavbarHidden ~ &:hover .footer-content',
    {
      transitionDelay: '350ms',
      transform: 'translate3d(0, -100%, 0)',
    }),
  select('&.hide:hover .footer-content',
    {
      transitionDelay: '350ms',
      transform: 'translate3d(0, -100%, 0)',
    }),
  select('.isAuthenticationView ~ &', s.displayNone),
  select('.isOnboardingView ~ &', s.displayNone),
  media(s.maxBreak2,
    { bottom: -40, height: 54 },
    parent('.isEditorFocused', s.displayNone),
    parent('.isOmnibarActive', s.displayNone),
    select('.isProfileMenuActive ~ &', s.displayNone),
    select('&.hide',
      s.relative,
      { bottom: 'auto' },
      select('.footer-content', {
        transform: 'none',
      }),
    ),
  ),
  media(s.minBreak2,
    select('.isOmnibarActive .Omnibar.isFullScreen ~ &', s.displayNone),
  ),
  media(s.minBreak4),
)

const grabberStyle = css(
  s.relative,
  s.block,
  s.fullWidth,
  { height: 0, margin: 0, padding: 0, overflow: 'hidden' },
  select(
    '&:hover',
    { cursor: 'pointer' },
  ),
  select(
    '.isNavbarHidden ~ .Footer &',
    { height: 15, marginTop: 0 },
  ),
  select(
    '.Footer.hide &',
    { height: 15, marginTop: 0 },
    media(s.maxBreak2,
      { display: 'none' },
    ),
  ),
)

const wrapperStyle = css(
  s.relative,
  s.px10,
  s.fullWidth,
  s.bgcE5,
  { transition: 'transform 150ms ease', transform: 'translate3d(0, calc(-100% + 15px), 0)' },
  { height: 54, margin: 0 },
  select('.isNavbarHidden ~ .Footer &', { transform: 'translate3d(0, 0, 0)' }),
  select('.Footer.hide &', { transform: 'translate3d(0, 0, 0)' }),
  media(s.minBreak2,
    s.px20,
  ),
  media(s.minBreak4, s.px40),
)

const containerStyle = css(
  s.relative,
  s.flex,
  s.itemsCenter,
  s.maxSiteWidth,
  s.fullWidth,
  { margin: '0 auto', height: 54 },
)

const linksStyle = css(
  s.relative,
  s.nowrap,
  { flex: 1 },
  { WebkitOverflowScrolling: 'touch', overflowX: 'auto', overflowY: 'hidden' },
)

const toolsStyle = css(
  s.absolute,
  s.flex,
  s.itemsCenter,
  { right: 0, top: 0, height: '100%' },
  before(
    s.absolute,
    s.zIndex2,
    { top: 0, bottom: 0, left: -20, width: 20, content: '""' },
    { background: 'linear-gradient(to right, rgba(229, 229, 229, 0) 0%, rgba(229, 229, 229, 1) 90%)' },
  ),
  media(s.minBreak4, before(s.displayNone)),
  media(s.maxBreak2,
    s.relative,
    s.nowrap,
    { right: 'auto' },
    select('> .LayoutTool', { display: 'none' }),
  ),
)

const rssStyle = css(
  s.displayNone,
  s.mx20,
  s.px5,
  media(s.minBreak2, s.inlineBlock),
  select('.no-touch &:hover rect', { fill: '#000' }),
)

export const Footer = ({
  formActionPath,
  formMessage,
  formStatus,
  isEditorial,
  isPostDetail,
  isDiscoverAll,
  isGridMode,
  isLayoutToolHidden,
  isLoggedIn,
  isMobile,
  isFormDisabled,
  isPaginatoring,
  links,
}, {
  onClickScrollToTop,
  onClickToggleLayoutMode,
}) =>
  (<footer
    className={classNames(`Footer${isPostDetail || isDiscoverAll ? ' hide' : ''} ${baseStyle}`, { isPaginatoring })}
    role="contentinfo"
  >
    <div className={`grabber ${grabberStyle}`} />
    <div className={`footer-content ${wrapperStyle}`}>
      <div className={`footer-container ${containerStyle}`}>
        <div className={linksStyle}>
          { links.map(link =>
            (<FooterLink
              href={link.to}
              label={link.label}
              key={`FooterLink_${link.label}`}
            />),
          )}
        </div>
        <div className={`FooterTools ${toolsStyle}`}>
          { !isLoggedIn &&
            <FooterForm
              {...{
                formActionPath,
                formMessage,
                formStatus,
                isDisabled: isFormDisabled,
                isMobile,
              }}
            />
          }
          { isEditorial &&
            <a className={rssStyle} href="/feeds/editorials">
              <RSSIcon />
            </a>
          }
          { (isLoggedIn || (!isLoggedIn && !isMobile)) && // TODO: move to FooterContainer
            <FooterTool
              className="TopTool"
              icon={<ChevronIcon />}
              label="Top"
              onClick={onClickScrollToTop}
            />
          }
          {!isLayoutToolHidden && (isLoggedIn || (!isLoggedIn && !isMobile)) &&
            <FooterTool
              className="LayoutTool"
              icon={isGridMode ? <ListIcon /> : <GridIcon />}
              label={isGridMode ? 'List View' : 'Grid View'}
              onClick={onClickToggleLayoutMode}
            />
          }
        </div>
      </div>
    </div>
  </footer>)

Footer.contextTypes = {
  onClickScrollToTop: PropTypes.func.isRequired,
  onClickToggleLayoutMode: PropTypes.func.isRequired,
}

Footer.propTypes = {
  formActionPath: PropTypes.string.isRequired,
  formMessage: PropTypes.string.isRequired,
  formStatus: PropTypes.string.isRequired,
  isDiscoverAll: PropTypes.bool.isRequired,
  isEditorial: PropTypes.bool.isRequired,
  isFormDisabled: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool.isRequired,
  isLayoutToolHidden: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isPaginatoring: PropTypes.bool.isRequired,
  isPostDetail: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired,
}

export default Footer

