import React from 'react'
import { FormattedMessage } from 'react-intl'
import { scale } from 'chroma-js'

import ThirdPartySummary from './ThirdPartySummary'
import ThirdPartyCategories from './ThirdPartyCategories'
import { Heading, Text } from '../../Type'
import ThirdPartyMetrics from './ThirdPartyMetrics'
import MainThreadActivity from '../../MainThreadActivity'
import { barChartColors } from '../../../theme'
import CategoryProvider from '../../CategoryProvider'
import { Box } from '../../Grid'

const MEASUREMENTS = [
  'third_party_count',
  'third_party_size_in_bytes',
  'third_party_main_thread_duration',
  'page_size_in_bytes',
  'js-parse-compile'
]

const ThirdPartyData = ({
  measurements,
  thirdParties,
  error,
  total,
  blockedThirdParties,
  mainThreadActivity
}) => {
  const metrics = measurements
    .filter(measurement => MEASUREMENTS.includes(measurement.name))
    .sort((a, b) => MEASUREMENTS.indexOf(a.name) - MEASUREMENTS.indexOf(b.name))

  const colourScale = scale(barChartColors)

  const categoryNames = [
    ...new Set(thirdParties.map(thirdParty => thirdParty.categories[0]))
  ]
  const categories = categoryNames.map((name, index) => ({
    name,
    color: colourScale(index / (categoryNames.length - 1)).hex()
  }))

  if (error)
    return (
      <div className="page-section m--0">
        <h2 className="type-medium m--0">
          <FormattedMessage id="thirdParties.error" values={{ error }} />
        </h2>
      </div>
    )

  if (!thirdParties)
    return (
      <div className="page-section m--0">
        <h2 className="type-medium m--0">
          <FormattedMessage id="thirdParties.noData" />
        </h2>
      </div>
    )

  if (!thirdParties.length)
    return (
      <div className="page-section m--0">
        <h2 className="type-medium m--0">
          <FormattedMessage id="thirdParties.notApplicable" />
        </h2>
      </div>
    )

  return (
    <>
      <ThirdPartyMetrics metrics={metrics} />

      <MainThreadActivity mainThreadActivity={mainThreadActivity} />

      <CategoryProvider initialState={categories}>
        <div className="page-section">
          <Box mb={4}>
            <ThirdPartyCategories thirdParties={thirdParties} total={total} />
          </Box>

          <ThirdPartySummary
            thirdParties={thirdParties}
            blockedThirdParties={blockedThirdParties}
          />
        </div>
      </CategoryProvider>
    </>
  )
}

const ThirdParties = props => {
  return (
    <>
      <div className="page-section">
        <Heading as="h1" level="md">
          <FormattedMessage id="thirdParties.title" />
        </Heading>
        <Text as="p" color="grey300" mt={1} mb={0}>
          <FormattedMessage id="thirdParties.description" />
        </Text>
      </div>

      <ThirdPartyData {...props} />
    </>
  )
}

export default ThirdParties

ThirdParties.defaultProps = {
  error: null,
  thirdParties: null,
  total: {},
  blockedThirdParties: [],
  metrics: []
}
