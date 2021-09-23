import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class TextControl extends PureComponent {
  static defaultProps = {
    className: 'TextControl',
    id: 'textControl',
    name: 'text',
    placeholder: 'Text',
  }

  render() {
    return (
      <FormControl
        {...this.props}
        autoCapitalize="off"
        autoCorrect="off"
        type="text"
      />
    )
  }
}

export default TextControl

