import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { css, hover } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(s.py10, s.fontSize14, s.color9, s.transitionColor, hover(s.colorBlack))
const labelStyle = css(s.ml5, s.borderBottom)

export default class ContentWarningButton extends PureComponent {

  static propTypes = {
    contentWarning: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.state = {
      isOpen: false,
    }
  }

  onClickToggle = () => {
    const { isOpen } = this.state
    const newIsOpen = !isOpen
    this.setState({ isOpen: newIsOpen })
  }

  render() {
    const { contentWarning } = this.props
    const { isOpen } = this.state
    const classes = classNames('ContentWarningButton', { isOpen }, `${buttonStyle}`)
    return (
      <button className={classes} onClick={this.onClickToggle}>
        <span>
          {contentWarning}
        </span>
        <span className={labelStyle}>
          {isOpen ? 'Hide' : 'View'}
        </span>
      </button>
    )
  }
}

