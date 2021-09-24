import React from 'react'

import { Flex } from '@chakra-ui/react'

import ComposerMediaClose from './MediaClose'

interface ComposerMediaErrorProps {
  handleClose: (e: React.MouseEvent<HTMLInputElement>) => void
}

const ComposerMediaError = ({ handleClose }: ComposerMediaErrorProps) => {
  return (
    <Flex
      width="100%"
      my={3}
      height="200px"
      bg="bg.secondary"
      justify="center"
      align="center"
      pos="relative"
    >
      <ComposerMediaClose onClick={handleClose} />
    </Flex>
  )
}

export default ComposerMediaError
