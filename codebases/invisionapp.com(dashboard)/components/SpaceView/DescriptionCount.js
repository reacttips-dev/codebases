import React from 'react'
import PropTypes from 'prop-types'

import { Text } from '@invisionapp/helios'

import { DESCRIPTION_CHARACTER_LIMIT } from '../../constants/DescriptionConstants'

const DescriptionCount = props => {
  if (props.small && props.count > DESCRIPTION_CHARACTER_LIMIT) return null

  return (
    <Text order='body' color={props.count > DESCRIPTION_CHARACTER_LIMIT ? 'danger' : 'text-lighter'}>
      {`${props.count} of ${DESCRIPTION_CHARACTER_LIMIT}${props.small ? '' : ' characters'}`}
    </Text>
  )
}

DescriptionCount.propTypes = {
  count: PropTypes.number.isRequired,
  small: PropTypes.bool
}

DescriptionCount.defaultProps = {
  small: false
}

export default DescriptionCount
