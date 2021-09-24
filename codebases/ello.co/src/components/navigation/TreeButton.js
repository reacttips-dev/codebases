import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ChevronIcon } from '../assets/Icons'
import { css, hover, media, modifier } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.alignTop,
  s.colorBlack,
  s.fontSize18,
  s.hv40,
  s.nowrap,
  s.pl30,
  s.relative,
  s.sansBlack,
  s.transitionColor,
  hover(s.colorBlack),
  media(s.minBreak2, s.fontSize24, s.pl0),
  modifier('.isCollapsed', s.colorA),
)

export default class TreeButton extends PureComponent {

  static propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    isCollapsed: PropTypes.bool,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    isCollapsed: true,
    onClick: null,
  }

  componentWillMount() {
    const { isCollapsed } = this.props
    this.state = {
      collapsed: isCollapsed,
    }
  }

  onClickTreeButton = (...rest) => {
    const { onClick } = this.props
    const { collapsed } = this.state
    const newCollapsedState = !collapsed
    this.setState({ collapsed: newCollapsedState })
    if (typeof onClick === 'function') {
      onClick(...rest)
    }
  }

  render() {
    const { children, className } = this.props
    const { collapsed } = this.state
    return (
      <button
        className={classNames('TreeButton', className, `${buttonStyle}`, { isCollapsed: collapsed })}
        onClick={this.onClickTreeButton}
      >
        <ChevronIcon />
        {children}
      </button>
    )
  }
}

