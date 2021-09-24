import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import { Overview as OverviewQuery } from '../../../queries/BudgetQueries.gql'

import Breadcrumbs from '../../Breadcrumbs'
import { Section } from '../../Layout'
import { Flex, Box } from '../../Grid'
import Feedback from '../Feedback'
import Filters, { FilterList, Filter, DeviceFilter } from '../../Filters'
import Button from '../../Button'
import PageTitle from '../../PageTitle'
import Budgets from './Budgets'

import useFeedback from '../../../hooks/useFeedback'
import { useSession } from '../../../providers/SessionProvider'

const STATUS_FILTERS = ['all', 'unmet', 'met', 'risk']

const Overview = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const { can } = useSession({ teamId, siteId })
  const [currentStatusFilter, setCurrentStatusFilter] = useState(
    STATUS_FILTERS[0]
  )
  const [currentDeviceFilter, setCurrentDeviceFilter] = useState()
  const { feedback, clearFeedback } = useFeedback()
  const variables = { team: teamId, site: siteId }
  const { data, loading } = useQuery(OverviewQuery, { variables })

  const { team } = data || {}
  const { site, organisation } = team || {}
  const { name: organisationName } = organisation || {}
  const { metricBudgetsList = { edges: [] }, name: siteName } = site || {}

  const budgets = metricBudgetsList.edges
    .map(({ node }) => node)
    .filter(
      ({ status, budgets }) =>
        (currentStatusFilter === 'all' || status === currentStatusFilter) &&
        (!currentDeviceFilter ||
          currentDeviceFilter === 'all' ||
          budgets.filter(({ profile: { device } }) =>
            currentDeviceFilter === 'mobile'
              ? device && device.isMobile
              : !device || (device && !device.isMobile)
          ).length)
    )

  return (
    <>
      <PageTitle
        id="budgets.title"
        breadcrumbs={[siteName, organisationName]}
      />
      <Section>
        <Flex flexWrap={['wrap', 'nowrap']} alignItems="center">
          <Box flex={1} mb={[4, 0]}>
            <Breadcrumbs>
              <FormattedMessage id="budgets.title" />
            </Breadcrumbs>
          </Box>
          {can('createMetricBudgets') ? (
            <Box width={[1, 'auto']} my="-8px">
              <Button
                to={`/teams/${teamId}/${siteId}/budgets/new`}
                variant="primary"
              >
                <FormattedMessage id="budgets.actions.new" />{' '}
              </Button>
            </Box>
          ) : null}
        </Flex>
      </Section>
      <Section p={null} px={4} pt={4}>
        <Filters flexWrap={['wrap', 'wrap', 'nowrap']}>
          <FilterList mr={4} mb={4}>
            {STATUS_FILTERS.map(filter => (
              <Filter
                key={filter}
                selected={currentStatusFilter === filter}
                onClick={() => setCurrentStatusFilter(filter)}
              >
                <FormattedMessage id={`budgets.${filter}.title`} />
              </Filter>
            ))}
          </FilterList>
          <FilterList mb={4}>
            <DeviceFilter
              currentDeviceFilter={currentDeviceFilter}
              onChange={setCurrentDeviceFilter}
            />
          </FilterList>
        </Filters>
      </Section>
      {(feedback.location === 'budget' && (
        <Feedback
          data-qa="budgetFeedback"
          p={null}
          pt={3}
          px={0}
          pb={0}
          duration={0}
          onDismiss={clearFeedback}
          {...feedback}
        />
      )) ||
        null}
      <Budgets
        teamId={teamId}
        siteId={siteId}
        site={site}
        budgets={budgets}
        loading={loading}
        filter={currentStatusFilter}
      />
    </>
  )
}

export default Overview
