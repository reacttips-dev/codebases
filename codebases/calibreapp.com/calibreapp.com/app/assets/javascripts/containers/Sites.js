import React, { useEffect, useState, Suspense } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'

import { UpdateSession } from '../queries/OrganisationQueries.gql'
import { List as ListSitesQuery } from '../queries/SiteQueries.gql'
import Loader from '../components/Loader'
import { Banner, Section } from '../components/Layout'
import { Flex, Box } from '../components/Grid'
import { Heading } from '../components/Type'
import Button from '../components/Button'
import PageTitle from '../components/PageTitle'
import { LoadingLayout } from '../components/Loading'

import { useSession } from '../providers/SessionProvider'
import useFeedback from '../hooks/useFeedback'

const Pagination = React.lazy(() => import('../components/Pagination'))
const Search = React.lazy(() => import('../components/Forms/Search'))
const SitesTemplate = React.lazy(() => import('../components/templates/Sites'))
const SubscriptionNotification = React.lazy(() =>
  import('../components/templates/Sites/SubscriptionNotification')
)
const Feedback = React.lazy(() => import('../components/templates/Feedback'))
const ErrorHandler = React.lazy(() =>
  import('../components/templates/ErrorHandler')
)
const Welcome = React.lazy(() => import('../components/templates/Welcome'))
const BlankSlate = React.lazy(() => import('../components/BlankSlate'))

const Sites = ({
  match: {
    params: { teamId }
  }
}) => {
  const { feedback, clearFeedback } = useFeedback()
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentUser, can } = useSession({ teamId })
  const [updateSession] = useMutation(UpdateSession)

  const { data, loading, fetchMore, error } = useQuery(ListSitesQuery, {
    variables: { teamId, sitesFilter: { nameContains: searchTerm } },
    pollInterval: 60 * 1000,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      setInitialLoadComplete(true)
      updateSession({
        variables: { session: { team: teamId } }
      })
    }
  }, [loading])

  if (error) {
    return (
      <Suspense fallback={<div />}>
        <ErrorHandler error={error} />
      </Suspense>
    )
  }

  const { team } = data || {}
  const { name: teamName, organisation } = team || {}
  const { slug: orgId, status, trialEndAt } = organisation || {}

  const {
    slug,
    sitesList: { edges, pageInfo }
  } = team || { sitesList: {} }
  const { hasNextPage, endCursor } = pageInfo || {}

  const sites = (edges || []).map(({ node }) => node)

  const hasNoSites = !loading && !searchTerm.length && sites.length === 0

  const onLoadMore = () => {
    fetchMore({
      variables: {
        cursor: endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) =>
        Object.assign({}, prev, {
          team: {
            ...prev.team,
            // To get around a bug in @apollo/client and to force a re-render
            // we update the top level object …
            bustCache: 1,
            sitesList: {
              ...prev.team.sitesList,
              edges: [
                ...prev.team.sitesList.edges,
                ...fetchMoreResult.team.sitesList.edges
              ],
              pageInfo: fetchMoreResult.team.sitesList.pageInfo
            }
          }
        })
    })
  }

  const welcomeActions = []
  if (['canceled'].includes(status)) {
    welcomeActions.splice(
      0,
      0,
      can('updateOrganisations') ? 'plan' : 'canceled'
    )
  } else if (['trial_expired', 'trial_canceled'].includes(status)) {
    welcomeActions.splice(
      0,
      0,
      can('updateOrganisations') ? 'trialPlan' : 'trialCanceled'
    )
  } else {
    if (can('createMembers')) welcomeActions.splice(0, 0, 'team')
    if (can('createSites')) welcomeActions.splice(0, 0, 'site')
  }

  if (!initialLoadComplete) return <LoadingLayout />

  return (
    <>
      <PageTitle id="sites.title" breadcrumbs={[teamName]} />
      <Banner variant="button" flexWrap={['wrap', 'nowrap']}>
        <Box mb={[4, 0]} flex={1}>
          <Heading as="h1" level="md">
            <FormattedMessage id="sites.heading" />
          </Heading>
        </Box>
        <Box flex={1} mb={[4, 0]}>
          <Flex width={1}>
            <Box mx="auto" my="-5px" data-testid="sitesSearch">
              <Suspense fallback={<div />}>
                <Search
                  type="search"
                  onChange={setSearchTerm}
                  placeholder="Filter sites"
                />
              </Suspense>
            </Box>
          </Flex>
        </Box>
        <Box flex={['none', 1]} width={[1, 'auto']}>
          {can('createSites') ? (
            <Flex>
              <Box ml="auto" mr={['auto', 0]}>
                <Button
                  to={`/teams/${slug}/sites/new`}
                  variant="primary"
                  disabled={[
                    'trial_expired',
                    'trial_canceled',
                    'canceled'
                  ].includes(status)}
                >
                  <FormattedMessage id="sites.actions.new" />
                </Button>
              </Box>
            </Flex>
          ) : null}
        </Box>
      </Banner>

      <Section p={undefined}>
        {(['sites', 'organisation'].includes(feedback.location) && (
          <Feedback
            data-qa="sitesFeedback"
            p={null}
            pt={0}
            pb={4}
            duration={0}
            onDismiss={clearFeedback}
            {...feedback}
          />
        )) ||
          null}
        {loading ? (
          <Loader />
        ) : hasNoSites ? (
          <Suspense fallback={<div />}>
            {welcomeActions.length ? (
              <Welcome orgId={orgId} teamId={teamId} actions={welcomeActions} />
            ) : (
              <BlankSlate id="sites" offsets={[150, 150]} />
            )}
          </Suspense>
        ) : sites.length > 0 ? (
          <Suspense fallback={<Loader />}>
            <SubscriptionNotification
              status={status}
              trialEndAt={trialEndAt}
              orgId={orgId}
              isAdmin={can('readPlan')}
            />
            <SitesTemplate
              orgId={teamId}
              sites={sites}
              initialSortBy={currentUser.summarySortBy}
              initialSortDirection={currentUser.summarySortDirection}
            />
            {!hasNextPage || (
              <Flex>
                <Box mx="auto" mt={4} mb="60px">
                  <Pagination pageInfo={pageInfo} onNext={onLoadMore} />
                </Box>
              </Flex>
            )}
          </Suspense>
        ) : (
          <Box textAlign="center">
            <FormattedMessage id="sites.no_results" />
          </Box>
        )}
      </Section>
    </>
  )
}

export default Sites
