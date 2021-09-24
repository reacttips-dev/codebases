import React from 'react'

import { Flex } from '@chakra-ui/layout'
import CloseIcon from 'remixicon-react/CloseLineIcon'

import { Icon } from 'tribe-components'

export interface ComposerMediaCloseProps {
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void
}
const ComposerMediaClose = ({ onClick }: ComposerMediaCloseProps) => {
  return (
    <Flex
      onClick={onClick}
      pos="absolute"
      bg="bg.base"
      justify="center"
      align="center"
      cursor="pointer"
      zIndex="docked"
      sx={{
        top: '12px',
        right: '12px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
      }}
    >
      <Icon boxSize={5} color="label.primary" as={CloseIcon} />
    </Flex>
  )
}

export default ComposerMediaClose
