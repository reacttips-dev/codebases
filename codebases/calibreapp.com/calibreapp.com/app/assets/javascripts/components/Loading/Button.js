import React from 'react'

import ButtonElement from '../Button'

const Button = props => <ButtonElement {...props}>Loading Button</ButtonElement>

Button.defaultProps = {
  variant: 'loading'
}

export default Button
