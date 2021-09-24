import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { subDays } from 'date-fns'

import {
  Overview as OverviewQuery,
  UpdatePageMetrics as UpdatePageMetricsMutation
} from '../../../queries/PageQueries.gql'

import Breadcrumbs from '../../Breadcrumbs'
import { Lockup, Section, Overlay } from '../../Layout'
import { Flex, Box } from '../../Grid'
import Filters, { FilterList, DeviceFilter } from '../../Filters'
import Button, { CustomiseButton } from '../../Button'
import PageTitle from '../../PageTitle'
import { Search } from '../../Forms'
import safeError from '../../../utils/safeError'

import useToggle from '../../../utils/useToggle'
import { useSession } from '../../../providers/SessionProvider'

import Pages from './Pages'
import ChooseMetric from './ChooseMetric'

const THIRTY_DAYS_AGO = subDays(new Date(), 30)

const Overview = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  const { can } = useSession({ teamId, siteId })
  const [pageMetrics, setPageMetrics] = useState({})
  const [customiseMetrics, toggleCustomiseMetrics] = useToggle(false)
  const [metricToCustomise, setMetricToCustomise] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentDeviceFilter, setCurrentDeviceFilter] = useState()
  const [feedback, setFeedback] = useState()

  const variables = { team: teamId, site: siteId, from: THIRTY_DAYS_AGO }
  const { loading, data } = useQuery(OverviewQuery, { variables })
  const [savePageMetrics, { loading: saving }] = useMutation(
    UpdatePageMetricsMutation,
    {
      onCompleted: ({ updateUserSitePageMetrics }) => {
        setMetricToCustomise(null)
        setFeedback()
        setPageMetrics(updateUserSitePageMetrics)
        window.scrollTo(0, 0)
      },
      onError: error => {
        setFeedback({
          type: 'error',
          message: safeError(error)
        })
      }
    }
  )

  const { team, metricCategories = [], currentUser } = data || {}
  const { name: teamName, site } = team || {}
  const { name: siteName } = site || {}

  const { sitePageMetrics } = currentUser || {}
  useEffect(() => {
    setPageMetrics(sitePageMetrics)
  }, [loading])

  const handleChangeMetric = newMetric => {
    const updatedMetrics = pageMetrics.metrics.map((metric, index) =>
      index === metricToCustomise ? newMetric : metric
    )
    savePageMetrics({
      variables: {
        siteId,
        metrics: updatedMetrics.map(({ value }) => value)
      }
    })
  }

  const handleCustomiseMetric = metric => {
    setMetricToCustomise(pageMetrics.metrics.indexOf(metric))
    toggleCustomiseMetrics()
    window.scrollTo(0, 0)
  }

  if (metricToCustomise !== null)
    return (
      <>
        <PageTitle id="pages.title" breadcrumbs={[siteName, teamName]} />
        <ChooseMetric
          onBack={() => {
            setMetricToCustomise(null)
            window.scrollTo(0, 0)
          }}
          onSave={handleChangeMetric}
          metricCategories={metricCategories}
          currentMetric={pageMetrics.metrics[metricToCustomise]}
          saving={saving}
          feedback={feedback}
        />
      </>
    )

  return (
    <>
      <PageTitle id="pages.title" breadcrumbs={[siteName, teamName]} />
      <Section>
        <Flex alignItems="center" flexWrap="wrap" width="1">
          <Box flex={['auto', 1]} mb={[3, 0]} width={[1, 'auto']}>
            <Breadcrumbs>
              <FormattedMessage id="pages.title" />
            </Breadcrumbs>
          </Box>
          <Box my={[2, '-8px']} width={[1, 'auto']}>
            {customiseMetrics ? (
              <Button variant="tertiary" onClick={toggleCustomiseMetrics}>
                <FormattedMessage id="pages.actions.metrics.close" />
              </Button>
            ) : (
              <CustomiseButton onClick={toggleCustomiseMetrics}>
                <FormattedMessage id="pages.actions.metrics.customise" />
              </CustomiseButton>
            )}
          </Box>
          {!!customiseMetrics || can('updateSites') ? (
            <Box my={[0, '-8px']} ml={[0, '15px']} width={[1, 'auto']}>
              <Button
                to={`/teams/${teamId}/${siteId}/settings/pages`}
                variant="primary"
              >
                <FormattedMessage id="pages.actions.settings" />{' '}
              </Button>
            </Box>
          ) : null}
        </Flex>
      </Section>
      <Section p={null} px={4} pt={4} borderBottom="none">
        <Flex flexWrap={['wrap', 'nowrap']}>
          <Box flex={1}>
            <Filters flexWrap={['wrap', 'wrap', 'nowrap']}>
              <FilterList mb={4}>
                <DeviceFilter
                  currentDeviceFilter={currentDeviceFilter}
                  onChange={setCurrentDeviceFilter}
                />
              </FilterList>
            </Filters>
          </Box>
          <Box width={270} mb={4} data-testid="pagesSearch">
            <FormattedMessage id="pages.actions.search">
              {label => (
                <Search
                  onChange={setSearchTerm}
                  placeholder={label}
                  width={1}
                />
              )}
            </FormattedMessage>
          </Box>
        </Flex>
        {customiseMetrics ? (
          <Overlay backgroundColor="white">
            <Lockup
              id="pages.metrics.lockup"
              mb={0}
              link="/docs/features/pages-leaderboard#customise-displayed-metrics"
            />
          </Overlay>
        ) : null}
      </Section>
      {loading ? null : (
        <Pages
          teamId={teamId}
          siteId={siteId}
          site={site}
          metrics={pageMetrics?.metrics || []}
          sortBy={pageMetrics?.sortBy}
          sortDirection={pageMetrics?.sortDirection}
          from={THIRTY_DAYS_AGO}
          deviceFilter={currentDeviceFilter}
          searchTerm={searchTerm}
          customiseMetrics={customiseMetrics}
          onCustomiseMetric={handleCustomiseMetric}
        />
      )}
    </>
  )
}

export default Overview
