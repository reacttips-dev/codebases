import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DismissButton } from '../../components/buttons/Buttons'
import { css, hover, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'
import { dialogStyle as baseDialogStyle } from './Dialog'

const dialogStyle = css({ maxWidth: 400 }, media(s.minBreak2, { maxWidth: 800 }))
const columnStyle = media(s.minBreak2, s.inlineBlock, s.alignTop, { maxWidth: 'calc(33.33333% - 30px)' })
const siblingColumnStyle = css(s.mt40, media(s.minBreak2, s.mt0, s.ml30))
const headingStyle = css(s.mb40, s.fontSize18, s.hv30, s.lh30, media(s.minBreak2, s.fontSize24))
const buttonHighlightStyle = css(s.colorWhite, s.bgcBlack, { borderColor: '#000' })
const buttonStyle = css(
  s.fullWidth,
  s.hv40,
  s.lh40,
  s.mb20,
  s.fontSize14,
  s.colorBlack,
  s.center,
  s.nowrap,
  s.bgcWhite,
  s.borderWhite,
  {
    borderRadius: 20,
    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
  },
  hover(s.buttonHighlightStyle),
  modifier('.isActive', buttonHighlightStyle, hover(s.colorBlack, s.bgcWhite, { borderColor: '#fff' })),
)

const BlockMuteDialog = ({
  isBlockActive = false,
  isMuteActive = false,
  onBlock,
  onFlag,
  onMute,
  username,
}) => {
  const blockButtonClasses = classNames({ isActive: isBlockActive }, `${buttonStyle}`)
  const muteButtonClasses = classNames({ isActive: isMuteActive }, `${buttonStyle}`)
  const blockButtonText = isBlockActive ? 'Unblock' : 'Block'
  const muteButtonText = isMuteActive ? 'Unmute' : 'Mute'

  return (
    <div className={`${baseDialogStyle} ${dialogStyle}`}>
      <h2 className={headingStyle}>{`Would you like to mute, block or flag @${username}?`}</h2>
      <div>
        <div className={columnStyle}>
          <button className={muteButtonClasses} onClick={onMute}>
            {muteButtonText}
          </button>
          <p>
            Muting prevents further email notifications from a user and removes
            their past activity from your feed. The user is still able to
            follow you and can still comment on your posts, but you will not
            receive any notifications.
          </p>
        </div>
        <div className={`${columnStyle} ${siblingColumnStyle}`}>
          <button className={blockButtonClasses} onClick={onBlock}>
            {blockButtonText}
          </button>
          <p>
            Blocking mutes a user, and disables them from viewing your profile
            and posts. When blocking, we recommend setting your account to
            &quot;Non-Public&quot; to disable your profile from being viewed by people
            outside of the Ello network.
          </p>
        </div>
        <div className={`${columnStyle} ${siblingColumnStyle}`}>
          <button className={buttonStyle} onClick={onFlag}>
            Flag User
          </button>
          <p>
            Report @{username} for violating our rules.
          </p>
        </div>
      </div>
      <DismissButton />
    </div>
  )
}

BlockMuteDialog.propTypes = {
  isBlockActive: PropTypes.bool.isRequired,
  isMuteActive: PropTypes.bool.isRequired,
  onBlock: PropTypes.func.isRequired,
  onFlag: PropTypes.func.isRequired,
  onMute: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
}

export default BlockMuteDialog

