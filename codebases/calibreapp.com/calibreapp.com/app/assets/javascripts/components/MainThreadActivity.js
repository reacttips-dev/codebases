import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  ChartObserver,
  TimelineChart,
  ProfileLegend,
  LegendProvider
} from './Chart'
import { PlainFormatter } from '../utils/MetricFormatter'
import { Heading, Text } from './Type'
import { Box } from './Grid'
import { InfoIcon } from './Icon'
import truncate from '../utils/smart-truncate'
import { formatMainThreadData } from '../utils/mainThreadActivity'

const Title = ({ description }) => (
  <>
    <Heading as="h3" level="sm">
      <FormattedMessage id="mainThreadActivity.title" />{' '}
      <a
        href="/docs/features/main-thread-execution-timeline"
        className="text-link"
        target="_blank"
        rel="noopener noreferrer"
        title={`Learn about Main thread execution timeline`}
        style={{ verticalAlign: 'middle' }}
      >
        <InfoIcon />
      </a>
    </Heading>
    {!description || (
      <Text as="p" level="xs" color="grey300" mt={1} mb={0}>
        {description}
      </Text>
    )}
  </>
)

const MainThreadActivity = ({ mainThreadActivity }) => {
  const { main_thread_activity: activities, error } = mainThreadActivity

  if (error)
    return (
      <div className="page-section m--0">
        <FormattedMessage id="mainThreadActivity.error">
          {description => <Title description={description} />}
        </FormattedMessage>
      </div>
    )

  if (!activities)
    return (
      <div className="page-section m--0">
        <FormattedMessage id="mainThreadActivity.noData">
          {description => <Title description={description} />}
        </FormattedMessage>
      </div>
    )

  const { segments, series } = formatMainThreadData(activities)

  const formatter = ({ id }) => {
    const segment = segments.find(segment => segment.id === id)
    if (!segment || !segment.name) return []

    const details = [
      `Blocking: ${PlainFormatter({
        number:
          segment.blockingDuration === undefined
            ? segment.duration - 50
            : segment.blockingDuration,
        formatter: 'humanDuration'
      })}`
    ]
    const thirdParty = (segment.third_parties || [])[0]
    const url = (segment.urls || [])[0]

    if (thirdParty) {
      details.push(
        `Source: ${thirdParty.name} (${thirdParty.categories.join(',')})`
      )
    } else if (url) {
      const parts = url.split('/')
      const filename = parts.pop()
      const path = parts.join('/')
      details.push(`Source: ${truncate(filename, 35, 0)}`)
      details.push(`Path: ${path}/`)
    }

    return details
  }

  if (!activities.length)
    return (
      <div className="page-section">
        <FormattedMessage id="mainThreadActivity.notApplicable">
          {description => <Title description={description} />}
        </FormattedMessage>
      </div>
    )

  return (
    <LegendProvider initialState={series}>
      <div className="page-section">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <FormattedMessage id="mainThreadActivity.description">
              {description => <Title description={description} />}
            </FormattedMessage>
          </div>
          <div className="col-xs-12 col-md-6 end-md m--b1">
            <ProfileLegend />
          </div>
        </div>
        <Box pt={3} pb={2}>
          <ChartObserver aspectRatio={40} minHeight={100}>
            <TimelineChart segments={segments} formatter={formatter} />
          </ChartObserver>
        </Box>
      </div>
    </LegendProvider>
  )
}

export default MainThreadActivity
