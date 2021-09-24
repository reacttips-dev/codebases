import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class PasswordControl extends PureComponent {
  static defaultProps = {
    className: 'PasswordControl',
    id: 'password',
    label: 'Password',
    name: 'user[password]',
    placeholder: 'Enter your password',
  }

  clear() {
    if (this.control.clear) {
      this.control.clear()
    }
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        type="password"
        ref={(comp) => { this.control = comp }}
      />
    )
  }
}

export default PasswordControl

