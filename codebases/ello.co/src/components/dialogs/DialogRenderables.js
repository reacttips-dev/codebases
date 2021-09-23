/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import ImageAsset from '../../components/assets/ImageAsset'
import { DismissButton } from '../../components/buttons/Buttons'
import { dialogStyle as baseDialogStyle } from './Dialog'
import { css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const textDialogStyle = css(
  { maxWidth: 480 },
  s.fontSize18,
  select('& p', s.fontSize18),
  select('& a', s.fontSize18),
)

export const TextMarkupDialog = ({ html }) =>
  (<div className={`${baseDialogStyle} ${textDialogStyle}`}>
    <div dangerouslySetInnerHTML={{ __html: html }} />
    <DismissButton />
  </div>)

TextMarkupDialog.propTypes = {
  html: PropTypes.string.isRequired,
}

// -------------------------------------

const catLinkStyle = css(
  s.colorWhite, s.borderBottom, s.transitionColor, { lineHeight: 1 },
  hover(s.colorA),
)

const getCategoryLinks = (categories) => {
  const len = categories.size
  return categories.map((category, index) => {
    let postfix = ''
    if (index < len - 2) {
      postfix = ', '
    } else if (index < len - 1) {
      postfix = ' & '
    }
    return [
      <Link className={catLinkStyle} to={`/discover/${category.get('slug')}`}>
        {category.get('name')}
      </Link>,
      postfix,
    ]
  })
}

const badgeDialogStyle = css(
  s.fullWidth,
  { maxWidth: 600 },
  media(s.maxBreak2, { padding: '0 25px !important' }),
  select('> .CloseModal', s.fixed),
)
const badgeCellStyle = css(
  s.relative, s.px40, s.py20, { borderBottom: '1px solid #aaa' },
  media(s.minBreak2, s.flex, s.itemsCenter, s.justifySpaceBetween, s.pr0),
)
const labelsCellStyle = css(s.relative)
const moreCellStyle = css(s.relative)
const badgeImgStyle = css(s.absolute, { top: 0, left: -40 })
const learnMoreStyle = css(
  s.colorA, s.borderBottom, s.transitionColor, { lineHeight: 1 },
  hover(s.colorWhite),
)

export const BadgeSummaryDialog = ({ badges, trackEvent }) => (
  <div className={`${baseDialogStyle} ${badgeDialogStyle}`}>
    { badges.map(badge =>
      (<div className={badgeCellStyle} key={`BadgeSummary_${badge.get('slug')}`}>
        <div className={labelsCellStyle}>
          <ImageAsset
            className={badgeImgStyle}
            alt={badge.get('name')}
            src={badge.getIn(['image', 'url'])}
            width={24}
            height={24}
          />
          <span>{badge.get('name')}</span>
          { badge.get('featuredIn') && <span> in </span> }
          { badge.get('featuredIn') && getCategoryLinks(badge.get('featuredIn')) }
        </div>
        { badge.get('learnMoreHref') &&
          <div className={moreCellStyle}>
            <a
              className={learnMoreStyle}
              href={badge.get('learnMoreHref')}
              onClick={() => trackEvent('badge-learn-more-clicked', { badge: badge.get('slug') })}
              target="_blank"
              rel="noopener noreferrer"
            >
              {badge.get('learnMoreCaption', 'Learn More')}
            </a>
          </div>
        }
      </div>),
    )}
    <DismissButton />
  </div>
)
BadgeSummaryDialog.propTypes = {
  badges: PropTypes.object.isRequired,
  trackEvent: PropTypes.func.isRequired,
}

