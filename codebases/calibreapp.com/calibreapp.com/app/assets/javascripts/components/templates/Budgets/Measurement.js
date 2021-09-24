import React from 'react'

import { Text, Strong } from '../../Type'

const Measurement = ({ metric, value, metadata }) => (
  <>
    <Text as="div" color="grey50">
      <Strong color="grey50">{metric.shortLabel || metric.label}</Strong>
    </Text>
    <Text as="div" color="grey50" level="lg" mb={3}>
      {value}
    </Text>
    <Text as="div" level="xs" color="grey100">
      {metadata}
    </Text>
  </>
)

export default Measurement
