import React from 'react'

import { Box, HStack } from '@chakra-ui/react'
import { forwardRef } from '@chakra-ui/system'

import { Icon } from 'tribe-components'

import { DragIcon } from 'icons/svg'

export type DraggableItemProps = {
  isDragging: boolean
}
export const StyledDraggableItem = forwardRef<DraggableItemProps, 'div'>(
  ({ children, isDragging, ...props }, ref) => {
    return (
      <HStack
        ref={ref}
        border="1px"
        borderColor="border.base"
        borderRadius="md"
        py={2}
        px={3}
        opacity={
          isDragging
            ? 'var(--tribe-opacity-invisible)'
            : 'var(--tribe-opacity-none)'
        }
        cursor={isDragging ? 'grabbing' : 'grab'}
        {...props}
      >
        <Icon pos="relative" top="2px" as={DragIcon} color="label.primary" />
        <Box flex="1">{children}</Box>
      </HStack>
    )
  },
)
