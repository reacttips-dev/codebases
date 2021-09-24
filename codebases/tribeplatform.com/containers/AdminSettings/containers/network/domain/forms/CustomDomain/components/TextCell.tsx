import React from 'react'

import { Text } from 'tribe-components'

const TextCell: React.FC = ({ children }) => (
  <Text textStyle="regular/small">{children}</Text>
)

export default TextCell
