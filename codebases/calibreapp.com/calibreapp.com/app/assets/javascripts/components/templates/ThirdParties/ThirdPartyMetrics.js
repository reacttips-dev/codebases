import React from 'react'
import styled from 'styled-components'
import { grid } from 'styled-system'
import { FormattedMessage } from 'react-intl'

import Stat from '../../Stat'
import ThirdPartyBreakdown from './ThirdPartyBreakdown'
import { Box } from '../../Grid'

const Grid = styled.div`
  display: grid;
  ${grid}
`
Grid.defaultProps = {
  gridGap: 4,
  gridTemplateColumns: ['1fr', '1fr 1fr 1fr 1fr 1fr']
}

const ThirdPartyMetrics = ({ metrics }) => {
  const thirdPartyMetrics = metrics.filter(metric =>
    metric.name.includes('third_party')
  )

  if (!thirdPartyMetrics.length) return null

  const breakdownMetrics = [
    {
      type: 'totalTransferSize',
      thirdPartyMetric: 'third_party_size_in_bytes',
      pageMetric: 'page_size_in_bytes'
    },
    {
      type: 'totalExecutionTime',
      thirdPartyMetric: 'third_party_main_thread_duration',
      pageMetric: 'js-parse-compile'
    }
  ]

  return (
    <div className="page-section">
      <div>
        <Grid>
          {thirdPartyMetrics.map(metric => (
            <Box key={metric.name}>
              <Stat item={metric} labelProp="labelContext" />
            </Box>
          ))}
          {breakdownMetrics.map(breakdownMetric => (
            <Box key={breakdownMetric.thirdPartyMetric}>
              <FormattedMessage
                id={`thirdParties.${breakdownMetric.type}.title`}
              >
                {label => (
                  <ThirdPartyBreakdown
                    label={label}
                    metrics={metrics}
                    {...breakdownMetric}
                  />
                )}
              </FormattedMessage>
            </Box>
          ))}
        </Grid>
      </div>
    </div>
  )
}
export default ThirdPartyMetrics
