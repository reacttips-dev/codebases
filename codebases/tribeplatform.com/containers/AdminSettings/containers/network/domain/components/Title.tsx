import React, { ReactNode } from 'react'

import { Text } from 'tribe-components'

interface TitleProps {
  children: ReactNode
  subdomain: string
}

const Title: React.FC<TitleProps> = ({ children, subdomain }) => (
  <>
    <Text mb={1} textStyle="regular/medium">
      {children}
    </Text>

    <Text color="label.secondary" mb={7} textStyle="regular/small">
      {subdomain}
    </Text>
  </>
)

export default Title
