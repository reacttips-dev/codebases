import React from 'react'
import { numberFormat } from 'humanize'

import { TextLink, Strong } from '../../../../Type'
import FeedbackBlock from '../../../../FeedbackBlock'

const DAYS_PER_MONTH = 30
const HOURS_PER_MONTH = 730

const calculateMonthlyUsage = ({
  testsPerRun,
  scheduleInterval,
  scheduleAnchor
}) => {
  switch (scheduleInterval) {
    case 'off':
      return 0
    case 'daily':
      return testsPerRun * DAYS_PER_MONTH
    case 'hourly':
      return testsPerRun * HOURS_PER_MONTH
    case 'every_x_hours':
      return testsPerRun * (HOURS_PER_MONTH / scheduleAnchor)
  }
}

const EstimatedUsage = ({
  usageUrl,
  numberOfPages,
  numberOfProfiles,
  scheduleInterval,
  scheduleAnchor
}) => {
  const testsPerMonth = calculateMonthlyUsage({
    testsPerRun: numberOfPages * numberOfProfiles,
    scheduleInterval,
    scheduleAnchor
  })
  if (testsPerMonth && isFinite(testsPerMonth))
    return (
      <FeedbackBlock data-testid="estimated-usage" type="info" mb={0}>
        This configuration will generate{' '}
        <Strong color="blue400">{numberFormat(testsPerMonth, 0)}</Strong> tests
        per month. Monitor your usage in{' '}
        <TextLink to={usageUrl}>Billing → Overview</TextLink>.
      </FeedbackBlock>
    )

  return null
}

EstimatedUsage.defaultProps = {
  usageUrl: ''
}

export default EstimatedUsage
