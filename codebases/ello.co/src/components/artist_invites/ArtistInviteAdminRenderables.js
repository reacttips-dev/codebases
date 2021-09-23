/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import { css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import { XIcon } from '../assets/Icons'

const tabStyle = css(
  s.block,
  { border: 0 },
  select('& .label',
    s.relative,
    s.block,
    s.fullWidth,
    s.colorA,
    s.fontSize24,
    s.sansBlack,
    s.truncate,
    s.borderBottom,
    s.transitionColor,
    {
      lineHeight: 30,
    },
    media(s.minBreak2,
      { borderWidth: 2 },
    ),
    media(s.minBreak3,
      s.fontSize38,
      { lineHeight: 48 },
    ),
  ),

  select('& .explainer',
    s.block,
    s.mt20,
    s.fullWidth,
    s.colorA,
    s.fontSize14,
    media(s.minBreak2,
      { marginTop: 25 },
    ),
    media(s.maxBreak2,
      s.displayNone,
      s.colorBlack,
      modifier('.open',
        s.block,
        s.mb30,
      ),
    ),
  ),

  modifier('.isActive', select('& .explainer', s.colorBlack)),
  modifier('.approvedSubmissions', hover(select('& .label', s.colorGreen))),
  modifier('.selectedSubmissions', hover(select('& .label', s.colorYellow))),
  modifier('.unapprovedSubmissions', hover(select('& .label', s.colorBlack))),
  modifier('.declinedSubmissions', hover(select('& .label', s.colorRed))),
  modifier('.approvedSubmissions.isActive', select('& .label', s.colorGreen)),
  modifier('.selectedSubmissions.isActive', select('& .label', s.colorYellow)),
  modifier('.unapprovedSubmissions.isActive', select('& .label', s.colorBlack)),
  modifier('.declinedSubmissions.isActive', select('& .label', s.colorRed)),
)

const toggleButtonStyle = css(
  s.absolute,
  s.hv20,
  s.wv20,
  s.lh20,
  s.colorWhite,
  s.bgcA,
  s.transitionBgColor,
  {
    top: 5,
    right: 0,
    borderRadius: 20,
  },
  select('& .question',
    s.block,
    s.sansRegular,
    s.fontSize12,
    { lineHeight: 23 },
  ),
  select('& .SVGIcon',
    s.displayNone,
  ),

  hover(
    s.colorWhite,
    s.bgcBlack,
  ),

  modifier('.open',
    s.colorWhite,
    s.bgcBlack,
    select('& .SVGIcon',
      s.block,
    ),
    select('& .question',
      s.displayNone,
    ),
  ),
)

const SelectionTabSwitcher = ({
  dataKey,
  isActive,
  label,
  onClick,
  onClickExplainerToggle,
  explainerKeyOpen,
  innerWidth,
}) => {
  const className = `${tabStyle} ${dataKey} ${isActive ? 'isActive' : ''}`
  const href = `?submissionType=${dataKey}`

  let explainerText = null
  switch (dataKey) {
    case 'unapprovedSubmissions':
      explainerText = 'Submissions to be Accepted or Declined. Not publicly visible.'
      break
    case 'approvedSubmissions':
      explainerText = 'Accepting a submission sends an email to the artist letting them know you have received their work. It also notifies the followers of the artist that their submission was accepted for further consideration. Accepting a submission makes it publicly visible on the Invite.'
      break
    case 'selectedSubmissions':
      explainerText = 'Submissions may be “selected” at any point during the submission period. We recommend using this tab to save top submissions for final review when the Invite closes. You can remove submissions from the Selected tab by toggling the selected icon. All selected submissions will remain visible on the Accepted tab while selected. Not publicly visible.'
      break
    case 'declinedSubmissions':
      explainerText = 'We encourage only declining work that is incomplete, inappropriate, or extremely off-brand. Not publicly visible.'
      break
    default:
      explainerText = null
  }

  const explainerIsOpen = explainerKeyOpen === dataKey

  return (
    <li>
      <a
        href={href}
        className={className}
        onClick={onClick}
      >
        <span className="label">
          {label}
          {innerWidth < 640 &&
            <button
              className={`${toggleButtonStyle}${explainerIsOpen ? ' open' : ''}`}
              onClick={onClickExplainerToggle}
            >
              <span className="question">?</span>
              <XIcon />
            </button>
          }
        </span>
        <span className={`explainer${explainerIsOpen ? ' open' : ''}`}>
          {explainerText}
        </span>
      </a>
    </li>
  )
}
const propTypes = {
  dataKey: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onClickExplainerToggle: PropTypes.func,
  explainerKeyOpen: PropTypes.string,
  innerWidth: PropTypes.number.isRequired,
}
const defaultProps = {
  isActive: false,
  onClickExplainerToggle: null,
  explainerKeyOpen: null,
}
SelectionTabSwitcher.propTypes = propTypes
SelectionTabSwitcher.defaultProps = defaultProps

export default SelectionTabSwitcher
