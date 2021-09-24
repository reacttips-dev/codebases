import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class EmailControl extends PureComponent {
  static defaultProps = {
    className: 'EmailControl',
    id: 'email',
    name: 'user[email]',
    placeholder: 'Enter your email',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        trimWhitespace
        type="email"
      />
    )
  }
}

export default EmailControl

