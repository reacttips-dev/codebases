import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { CheckIcon, XIcon } from '../assets/Icons'
import { css, hover, media, modifier, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

const controlStyle = css(
  s.inlineBlock,
  s.wv60,
  s.hv30,
  s.lh30,
  s.fontSize14,
  s.center,
  s.nowrap,
  s.colorWhite,
  s.bgcA,
  s.borderA,
  { cursor: 'pointer', borderRadius: 15 },
  { transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s ease' },
  modifier('.isChecked', { backgroundColor: '#0c0', borderColor: '#0c0' }),
  modifier('[disabled]', { opacity: 0.25 }),
  hover(s.colorA, s.bgcWhite, { borderColor: '#aaa' }),
  parent('.isFirefox', { lineHeight: 28 }),
  parent('.Preference', s.absolute, { top: 30, right: 0 }),
  parent('.OnboardingPreference',
    s.absolute,
    s.fullWidth,
    s.fontSize16,
    { top: 75, right: 'auto', left: 0, maxWidth: 290, height: 50, lineHeight: 50, borderRadius: 5 },
  ),
  media(s.minBreak2,
    parent('.OnboardingPreference',
      s.fontSize18,
      { left: 10, width: 'calc(100% - 20px)', maxWidth: 330, height: 70, lineHeight: 70 },
    )),
  media(s.minBreak3, parent('.OnboardingPreference', s.fullWidth, { left: 40 })),
  media(s.minBreak4, parent('.OnboardingPreference', { left: 90 })),
)

const iconStyle = css({
  display: 'inline-block',
  marginRight: 5,
  marginLeft: -25,
})

class ToggleControl extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    isChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
    hasIcon: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isChecked: false,
    isDisabled: false,
    hasIcon: false,
  }

  componentWillMount() {
    const { isChecked } = this.props
    this.state = {
      checked: isChecked,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isChecked } = nextProps
    const { checked } = this.state
    if (checked !== isChecked && typeof isChecked !== 'undefined') {
      this.setState({
        checked: isChecked,
      })
    }
  }

  onChangeControl = () => {
    const { onChange, id } = this.props
    const { checked } = this.state
    const newCheckedState = !checked
    this.setState({ checked: newCheckedState })
    if (typeof onChange === 'function') {
      onChange({ [id]: newCheckedState })
    }
  }

  render() {
    const { id, isDisabled, hasIcon } = this.props
    const { checked } = this.state
    return (
      <label
        className={classNames(`${controlStyle}`, { isChecked: checked })}
        disabled={isDisabled}
        htmlFor={id}
      >
        <input
          checked={checked}
          className="invisible"
          id={id}
          onChange={this.onChangeControl}
          type="checkbox"
        />
        {hasIcon &&
          <span className={iconStyle} style={{ marginTop: checked ? -4 : -2 }}>
            {checked ? <CheckIcon /> : <XIcon />}
          </span>
        }
        <span>{checked ? 'Yes' : 'No'}</span>
      </label>
    )
  }
}

export default ToggleControl

