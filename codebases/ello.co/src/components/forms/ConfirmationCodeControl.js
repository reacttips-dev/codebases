import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class ConfirmationCodeControl extends PureComponent {
  static defaultProps = {
    className: 'ConfirmationCodeControl',
    id: 'confirmation_code',
    name: 'user[confirmation_code]',
    placeholder: 'Enter your confirmation_code',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        trimWhitespace
        type="text"
      />
    )
  }
}

export default ConfirmationCodeControl

