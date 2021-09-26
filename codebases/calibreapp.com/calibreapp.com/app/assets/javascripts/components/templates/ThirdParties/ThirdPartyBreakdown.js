import React from 'react'
import { useIntl } from 'react-intl'

import { Box } from '../../Grid'
import HorizontalBarChart from '../../Chart/HorizontalBarChart'
import { Text } from '../../Type'
import theme from '../../../theme'

const ThirdPartyBreakdown = ({
  label,
  metrics,
  thirdPartyMetric,
  pageMetric
}) => {
  const intl = useIntl()
  const thirdParty = metrics.find(
    metric => metric.name === thirdPartyMetric
  ) || { value: 0 }
  const page = metrics.find(metric => metric.name === pageMetric) || {
    value: 0
  }
  const percentage = (thirdParty.value / (page.value || 1)) * 100
  const difference = page.value - thirdParty.value

  const formatted = `${intl.formatNumber(percentage, {
    maximumFractionDigits: 2
  })}%`
  const formattedOther = `${intl.formatNumber(100 - percentage, {
    maximumFractionDigits: 2
  })}%`

  const segments = [
    {
      name: 'Third Party',
      value: thirdParty.value,
      scaled: percentage,
      color: theme.colors.blue300,
      formatted
    },
    {
      name: 'Other',
      value: difference,
      scaled: 100 - percentage,
      color: theme.colors.grey100,
      formatted: formattedOther
    }
  ]

  return (
    <>
      <Box mb={2}>
        <Text as="h3" level="xs" mb={2}>
          {label}
        </Text>
      </Box>
      <HorizontalBarChart level="xs" segments={segments} />
      <Text as="div" color="grey400" level="xs" textAlign="right" mt="2px">
        {formatted}
      </Text>
    </>
  )
}

export default ThirdPartyBreakdown
