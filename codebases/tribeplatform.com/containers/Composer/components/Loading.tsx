import React from 'react'

import { Flex } from '@chakra-ui/react'

import { Spinner } from 'tribe-components'

import ComposerMediaClose from './MediaClose'

interface ComposerLoadingProps {
  handleClose: (e: React.MouseEvent<HTMLInputElement>) => void
}

const ComposerLoading = ({ handleClose }: ComposerLoadingProps) => {
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
      <Spinner speed="0.6s" color="label.secondary" thickness="2px" size="md" />
    </Flex>
  )
}

export default ComposerLoading
