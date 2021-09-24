import React from 'react'

import { Text, TextProps } from 'tribe-components'

interface EmptyFeedTitleProps {
  mb?: TextProps['mb']
}

const EmptyFeedTitle: React.FC<EmptyFeedTitleProps> = ({
  children,
  mb = 2,
}) => (
  <Text textStyle="bold/2xlarge" mb={mb}>
    {children}
  </Text>
)

export default EmptyFeedTitle
