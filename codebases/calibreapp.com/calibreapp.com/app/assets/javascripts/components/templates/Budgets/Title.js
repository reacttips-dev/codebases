import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../Grid'
import { Section } from '../../Layout'
import Badge from '../../Badge'
import { Strong, Text } from '../../Type'
import { PlainFormatter } from '../../../utils/MetricFormatter'
import { sortByInteger } from '../../../utils/sort'
import Tooltip from '../../Tooltip'
import { LoadingLine } from '../../Loading'

import { collectionLabel } from '../../../utils/labels'

import { BADGE_STATUS_TYPES } from './statusTypes'

const Wrapper = styled.div`
  display: inline-block;
  vertical-align: text-top;
`

const TestProfiles = ({ numberOfSiteTestProfiles, profiles }) => {
  const profileNames = profiles
    .sort((a, b) => sortByInteger(a.positon, b.position))
    .map(({ name }) => name)

  const label = `${profileNames.join(', ')}.`
  let shortLabel
  if (profileNames.length == numberOfSiteTestProfiles) {
    shortLabel = <FormattedMessage id="budget.form.profiles.all" />
  } else {
    shortLabel = collectionLabel(profileNames)
  }

  return (
    <Wrapper>
      <Tooltip label={label}>
        <div>
          <Text>{shortLabel}</Text>
        </div>
      </Tooltip>
    </Wrapper>
  )
}

const Pages = ({ status, budgets }) => {
  const matchedBudgets = budgets.filter(budget =>
    status === 'met'
      ? budget.withinBudget
      : status === 'unmet'
      ? !budget.withinBudget
      : budget.atRisk
  )

  const pageNames = matchedBudgets
    .map(({ page: { name } }) => name)
    .filter((v, i, a) => a.indexOf(v) === i)

  let label = `${pageNames.join(', ')}.`

  if (matchedBudgets.length == budgets.length && pageNames.length > 2) {
    label = <FormattedMessage id="budget.form.pages.all" />
  } else if (pageNames.length > 2) {
    label = `${pageNames[0]}, ${pageNames[1]} and ${pageNames.length - 2} more`
  } else {
    label = `${pageNames.join(' and ')}`
  }

  return <Text>{label}</Text>
}

const Title = ({ compact, metric, site, value, status, budgets, loading }) => {
  const numberOfSiteTestProfiles = site ? site.testProfiles.length : 0
  return (
    <>
      <Section
        p={null}
        px={4}
        py={4}
        borderBottom={compact ? '1px solid' : 'none'}
      >
        <Flex alignItems="center">
          <Box flex={1}>
            <Strong>{metric.label}</Strong>{' '}
            <Text>
              <FormattedMessage
                id={`budgets.metrics.${metric.budgetThreshold}`}
              />
            </Text>
          </Box>
          <Box ml={2}>
            {!!loading || (
              <Badge type={BADGE_STATUS_TYPES[status]}>
                <FormattedMessage id={`budgets.${status}.title`} />
              </Badge>
            )}
          </Box>
        </Flex>
        <Box>
          <Strong fontSize="60px" lineHeight="1.1">
            <PlainFormatter number={value} formatter={metric.formatter} />
          </Strong>
        </Box>
      </Section>
      <Section
        p={null}
        px={4}
        pt={3}
        pb={4}
        display="flex"
        flexWrap={['wrap', 'nowrap']}
      >
        <Box width={[1, 1 / 2]} mb={[3, 0]} maxWidth="328px">
          <Box mb={1}>
            <Strong>
              <FormattedMessage id={`budgets.${status}.pages`} />
            </Strong>
          </Box>
          {loading ? (
            <Box pt="3px">
              <LoadingLine animated={false} width="100px" />
            </Box>
          ) : (
            <Pages status={status} budgets={budgets} />
          )}
        </Box>
        <Box width={[1, 1 / 2]}>
          <Box mb={1}>
            <Strong>Test Profiles</Strong>
          </Box>
          <TestProfiles
            numberOfSiteTestProfiles={numberOfSiteTestProfiles}
            profiles={[...new Set(budgets.map(({ profile }) => profile))]}
          />
        </Box>
      </Section>
    </>
  )
}
Title.defaultProps = {
  budgets: [],
  compact: false
}

export default Title
