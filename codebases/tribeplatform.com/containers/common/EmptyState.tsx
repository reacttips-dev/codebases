import React from 'react'

import { Image } from '@chakra-ui/image'
import { Box, VStack } from '@chakra-ui/react'

import { Button, Text } from 'tribe-components'

export interface EmptyStateProps {
  image: string
  title: string
  subtitle: string
  cta: string
  onClick: () => void
}

export const HeroEmptyState = ({
  image,
  title,
  subtitle,
  cta,
  onClick,
}: EmptyStateProps) => (
  <VStack spacing="8" pb="2">
    <Box w="200px" h="200px" position="relative">
      <Image
        objectFit="cover"
        src={image}
        position="absolute"
        bottom="0"
        zIndex="overlay"
      />
      <Box
        bg="stroke"
        top="0"
        bottom="0"
        left="0"
        right="0"
        borderRadius="full"
        position="absolute"
      />
    </Box>
    <VStack spacing="4" pb="2">
      <Text textStyle="semantic/h1" textAlign="center" maxW="md">
        {title}
      </Text>
      <Text color="tertiary" textAlign="center" maxW="xs">
        {subtitle}
      </Text>
    </VStack>
    <Button onClick={onClick}>{cta}</Button>
  </VStack>
)
