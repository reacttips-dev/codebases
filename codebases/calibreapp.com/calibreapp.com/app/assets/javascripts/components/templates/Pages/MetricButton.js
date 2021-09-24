import React from 'react'

import Button from '../../Button'
import { Box } from '../../Grid'

const MetricButton = ({ selectedMetric, onSelectMetric, ...metric }) => {
  const { name, shortLabel, label } = metric

  const handleClick = event => {
    event.preventDefault()
    onSelectMetric(metric)
  }

  return (
    <Box mr="15px" mb={3}>
      <Button
        onClick={handleClick}
        variant={selectedMetric.name === name ? `outlinedActive` : `outlined`}
      >
        {shortLabel || label}
      </Button>
    </Box>
  )
}

export default MetricButton
