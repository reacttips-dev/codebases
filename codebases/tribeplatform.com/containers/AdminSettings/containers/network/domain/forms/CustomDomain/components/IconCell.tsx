import React from 'react'

import CheckboxCircleLineIcon from 'remixicon-react/CheckboxCircleLineIcon'
import ErrorWarningLineIcon from 'remixicon-react/ErrorWarningLineIcon'

import { Icon } from 'tribe-components'

interface IconCellProps {
  success: boolean
}

const IconCell: React.FC<IconCellProps> = ({ success }) => (
  <Icon
    as={success ? CheckboxCircleLineIcon : ErrorWarningLineIcon}
    h="4"
    w="4"
    color={success ? 'success.base' : 'warning.base'}
  />
)

export default IconCell
