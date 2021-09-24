import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ToggleButton } from '../../Button'
import { Flex, Box } from '../../Grid'
import { Heading } from '../../Type'
import useToggle from '../../../utils/useToggle'

import MetricButton from './MetricButton'
import { Link as MetricLink } from '../../Metric'

const MetricCategory = ({
  label,
  docsPath,
  recommendedMetrics,
  otherMetrics,
  onSelectMetric,
  selectedMetric
}) => {
  const [showMetrics, toggleShowMetrics] = useToggle(false)

  return (
    <>
      <Box mb={3}>
        <Flex alignItems="center">
          <Box mr="5px">
            <Heading as="h2" level="md">
              {label}
            </Heading>
          </Box>
          <Box>
            <MetricLink docsPath={docsPath} label={label} />
          </Box>
        </Flex>
      </Box>
      <Flex flexWrap="wrap">
        {recommendedMetrics.map(metric => (
          <MetricButton
            key={metric.value}
            {...metric}
            selectedMetric={selectedMetric}
            onSelectMetric={onSelectMetric}
          />
        ))}
        {showMetrics
          ? otherMetrics.map(metric => (
              <MetricButton
                key={metric.value}
                {...metric}
                selectedMetric={selectedMetric}
                onSelectMetric={onSelectMetric}
              />
            ))
          : null}
      </Flex>
      {otherMetrics.length ? (
        <Flex>
          <ToggleButton onClick={toggleShowMetrics} open={showMetrics}>
            <FormattedMessage
              id={`pages.metrics.customise.${showMetrics ? 'close' : 'open'}`}
            />
          </ToggleButton>
        </Flex>
      ) : null}
    </>
  )
}

export default MetricCategory
