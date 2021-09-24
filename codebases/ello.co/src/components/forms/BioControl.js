import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FormControl from './FormControl'

class BioControl extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    text: PropTypes.string,
  }

  static defaultProps = {
    className: 'BioControl',
    id: 'unsanitized_short_bio',
    label: 'Bio',
    name: 'user[unsanitized_short_bio]',
    placeholder: 'Bio',
  }

  componentWillMount() {
    const { text } = this.props
    this.state = { textLength: text ? text.length : 0 }
  }

  onChangeControl = (vo) => {
    const { id, onChange } = this.props
    const { textLength } = this.state
    const len = vo[id] ? vo[id].length : 0
    if (textLength !== len) {
      this.setState({ textLength: len })
    }
    if (id && typeof onChange === 'function') {
      onChange(vo)
    }
  }

  isValidBioLength() {
    const { textLength } = this.state
    return textLength > 666
  }

  // For consistency we should probably move the checks up to Validators and
  // let the Container control the state. The component is more portable this
  // way but it's still weird. Exceeding isn't really an error either.
  render() {
    const { label } = this.props
    const { textLength } = this.state
    const hasExceeded = this.isValidBioLength()
    const aLabel = hasExceeded ? `${label} ${textLength}` : label
    return (
      <FormControl
        {...this.props}
        className={classNames({ hasExceeded })}
        autoCapitalize="off"
        autoCorrect="off"
        kind="textarea"
        label={aLabel}
        onChange={this.onChangeControl}
        type="text"
      />
    )
  }
}

export default BioControl

