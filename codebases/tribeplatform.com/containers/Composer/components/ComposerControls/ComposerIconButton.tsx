import React from 'react'

import { RemixiconReactIconComponentType } from 'remixicon-react'

import { IconButton, IconButtonProps } from 'tribe-components'

type ComposerIconButtonProps = IconButtonProps & {
  icon: RemixiconReactIconComponentType
}

/**
 * Square button that contains only an icon
 */
export const ComposerIconButton = ({
  icon: Icon,
  ...props
}: ComposerIconButtonProps) => (
  <IconButton
    icon={<Icon size="16px" />}
    border="1px solid"
    borderColor="border.base"
    h={8}
    w={10}
    px={0}
    py={0}
    borderRadius="md"
    {...props}
  />
)
