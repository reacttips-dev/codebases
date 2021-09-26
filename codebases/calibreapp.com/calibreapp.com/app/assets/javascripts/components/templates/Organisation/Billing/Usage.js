import React, { useState } from 'react'
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl'

import { Flex, Box } from '../../../Grid'
import { Section, Lockup } from '../../../Layout'
import { formattedDate } from '../../../../utils/date'
import { Text, Strong } from '../../../Type'
import Legend from '../../../Chart/Legend'
import HorizontalBarChart from '../../../Chart/HorizontalBarChart'
import { LoadingLine } from '../../../Loading'
import Details from '../../../Details'
import SiteUsage from './SiteUsage'

import theme from '../../../../theme'

const Usage = ({
  orgId,
  loading,
  status,
  periodEndAt,
  estimatedTestsPerMonth,
  total,
  allotment,
  snapshot,
  singlePage
}) => {
  const [showSiteUsage, setShowSiteUsage] = useState(false)
  const intl = useIntl()
  const segments = [
    {
      name: 'Snapshots',
      value: snapshot,
      scaled: allotment ? (snapshot / allotment) * 100 : 0,
      color: theme.colors.blue300,
      label: ' ',
      formatted: intl.formatNumber(snapshot)
    },
    {
      name: 'Single Page Tests',
      value: singlePage,
      scaled: allotment ? (singlePage / allotment) * 100 : 0,
      color: theme.colors.red300,
      label: ' ',
      formatted: intl.formatNumber(singlePage)
    },
    {
      value: allotment - total,
      scaled: allotment ? ((allotment - total) / allotment) * 100 : 100,
      color: theme.colors.grey100
    }
  ]

  const siteUsageAttributes = [
    'team',
    'name',
    'schedule',
    'snapshot',
    'reviewSite'
  ]

  return (
    <Section>
      <Lockup id="organisations.usage" />
      <Box mb={3}>
        {loading ? (
          <LoadingLine />
        ) : ['canceled', 'trial_canceled', 'trial_expired'].includes(
            status
          ) ? null : (
          <Text>
            <FormattedMessage
              id={`organisations.tests.allocation`}
              values={{ date: formattedDate(periodEndAt) }}
            />
          </Text>
        )}
      </Box>
      <Flex mb="15px">
        <Box flex={1}>
          {loading ? (
            <LoadingLine />
          ) : (
            <Text level="xs">
              <FormattedMessage
                id="organisations.tests.usage"
                values={{
                  total: (
                    <Strong>
                      <FormattedNumber value={total} />
                    </Strong>
                  ),
                  allotment: (
                    <Strong>
                      <FormattedNumber value={allotment} />
                    </Strong>
                  ),
                  estimated: (
                    <Strong>
                      <FormattedNumber value={estimatedTestsPerMonth} />
                    </Strong>
                  )
                }}
              />
            </Text>
          )}
        </Box>
        <Box>
          <Legend series={segments.filter(s => s.name)} />
        </Box>
      </Flex>
      <Box mb="15px">
        <HorizontalBarChart level="xs" segments={segments} />
      </Box>
      <Box>
        <FormattedMessage
          id={`organisations.usage.${
            siteUsageAttributes.includes('team') ? 'siteAndTeam' : 'site'
          }`}
        >
          {label => (
            <Details summary={label} onOpen={setShowSiteUsage}>
              {showSiteUsage ? (
                <SiteUsage orgId={orgId} attributes={siteUsageAttributes} />
              ) : (
                <LoadingLine />
              )}
            </Details>
          )}
        </FormattedMessage>
      </Box>
    </Section>
  )
}

export default Usage
