import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class BatchEmailControl extends PureComponent {
  static defaultProps = {
    className: 'BatchEmailControl',
    id: 'emails',
    label: 'Emails',
    name: 'invitations[email]',
    placeholder: 'Enter email addresses',
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
        kind="textarea"
        type="text"
        ref={(comp) => { this.control = comp }}
      />
    )
  }
}

export default BatchEmailControl

