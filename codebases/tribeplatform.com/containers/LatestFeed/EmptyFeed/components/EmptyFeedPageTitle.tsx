import React from 'react'

import { HStack } from '@chakra-ui/react'

import { Emoji, Text, TextProps } from 'tribe-components'

interface EmptyFeedPageTitleProps {
  mb?: TextProps['mb']
}

const EmptyFeedPageTitle: React.FC<EmptyFeedPageTitleProps> = ({
  children,
  mb = 2,
}) => (
  <HStack spacing={2} mb={mb}>
    <Text textStyle="bold/4xlarge">{children}</Text>
    <Emoji src="wave" size="lg" />
  </HStack>
)

export default EmptyFeedPageTitle
