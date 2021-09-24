import React, { FC } from 'react'

import { HStack, StackProps } from '@chakra-ui/react'

export const LayoutHeader: FC<StackProps> = ({ children, ...rest }) => {
  return (
    <HStack
      height={{ base: 20 }}
      pb="6"
      justifyContent="space-between"
      {...rest}
    >
      {children}
    </HStack>
  )
}
