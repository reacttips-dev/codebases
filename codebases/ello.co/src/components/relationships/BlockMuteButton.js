import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DotsIcon } from '../assets/Icons'
import Hint from '../hints/Hint'
import { css, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.wv30,
  s.hv30,
  modifier('.inUserProfile', s.absolute, { top: 0, right: 0 }),
  media(s.maxBreak2,
    modifier('.inUserProfile', { top: -285, right: 'auto', left: 0 }),
  ),
)


const BlockMuteButton = ({ className, onClick }) =>
  (<button
    className={classNames(`BlockMuteButton ${buttonStyle}`, className)}
    onClick={onClick}
  >
    <DotsIcon />
    <Hint>Block, Mute or Flag</Hint>
  </button>)

BlockMuteButton.propTypes = {
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default BlockMuteButton

