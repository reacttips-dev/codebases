import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getSelectionContainerElement } from '../editor/SelectionUtil'
import { css, hover, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const buttonStyle = css(
  s.block,
  s.fullWidth,
  s.p10,
  s.overflowHidden,
  s.colorWhite,
  s.leftAlign,
  s.ellipsis,
  s.nowrap,
  { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
  s.transitionBgColor,
  select('& + &', s.borderTop),
  hover(s.bgc4),
  modifier('.isActive', s.bgc4),
)

const labelStyle = css(s.ml10)

export default class Completion extends PureComponent {

  static propTypes = {
    asset: PropTypes.element.isRequired,
    className: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  onClickCompletion = (e) => {
    const { onClick } = this.props
    const node = getSelectionContainerElement()
    onClick({ value: this.getValue(), e })
    if (node) { node.focus() }
  }

  getValue() {
    return this.props.label
  }

  render() {
    const { asset, label, className } = this.props
    return (
      <button
        className={classNames('Completion', className, `${buttonStyle}`)}
        onClick={this.onClickCompletion}
      >
        {asset}
        <span className={labelStyle}>{label}</span>
      </button>
    )
  }
}

