import React, { PureComponent } from 'react'
import FormControl from './FormControl'

class LinksControl extends PureComponent {
  static defaultProps = {
    className: 'LinksControl',
    id: 'external_links',
    label: 'Links',
    name: 'user[links]',
    placeholder: 'Links',
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

export default LinksControl

