import React from 'react'
import PropTypes from 'prop-types'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const panelStyle = css(
  s.pl30,
  s.overflowHidden,
  select('& > p:first-child', s.mt0),
  select('.TreeButton.isCollapsed + &', { height: 0 }),
  media(s.minBreak3, s.pl0),
)

const TreePanel = ({ children }) =>
  (<div className={`TreePanel ${panelStyle}`}>
    {children}
  </div>)

TreePanel.propTypes = {
  children: PropTypes.node.isRequired,
}

export default TreePanel

