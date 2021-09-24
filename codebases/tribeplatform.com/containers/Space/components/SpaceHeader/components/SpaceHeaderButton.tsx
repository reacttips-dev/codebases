import React from 'react'

import { RemixiconReactIconComponentType } from 'remixicon-react'

import { IconButton, IconButtonProps } from 'tribe-components'

interface SpaceHeaderButtonProps extends IconButtonProps {
  icon: RemixiconReactIconComponentType
}

export const SpaceHeaderButton: React.FC<SpaceHeaderButtonProps> = ({
  icon: Icon,
  ...rest
}) => {
  return (
    <IconButton
      variant="solid"
      size="sm"
      borderRadius="md"
      icon={<Icon size="16px" />}
      highlighted
      {...rest}
    />
  )
}
