import React from 'react'
import { string } from 'prop-types'
import { Link } from 'react-router'

import { Button } from '@invisionapp/helios'

const HomeButton = props => <Button element={props.href ? Link : null} {...props} />

HomeButton.propTypes = {
  href: string
}
export default HomeButton
