import React from 'react'

import { Text, TextProps } from 'tribe-components'

interface EmptyFeedSubtitleProps {
  mb?: TextProps['mb']
}

const EmptyFeedSubtitle: React.FC<EmptyFeedSubtitleProps> = ({
  children,
  mb = 6,
}) => (
  <Text textStyle="regular/large" mb={mb} color="label.secondary">
    {children}
  </Text>
)

export default EmptyFeedSubtitle
