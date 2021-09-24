import React, { Suspense } from 'react'
import queryString from 'query-string'
import { useQuery } from '@apollo/client'
import { isAfter, subDays, parseISO } from 'date-fns'
import { FormattedMessage } from 'react-intl'

import { GetPulsePageData } from '../queries/PulseQueries.gql'
import PageSwitcher from '../components/PageSwitcher'
import { ChevronRightIcon } from '../components/Icon'
import PageTitle from '../components/PageTitle'

import useFeedback from '../hooks/useFeedback'

const SnapshotSummary = React.lazy(() =>
  import('../components/SnapshotSummary')
)
const InitialSnapshotsInProgress = React.lazy(() =>
  import('../components/templates/InitialSnapshotsInProgress')
)
const ErrorHandler = React.lazy(() =>
  import('../components/templates/ErrorHandler')
)
const PulseMetrics = React.lazy(() => import('./PulseMetrics'))
const Feedback = React.lazy(() => import('../components/templates/Feedback'))

const Pulse = ({ match: { params }, location: { search }, history }) => {
  const { feedback, clearFeedback } = useFeedback()
  const { teamId, siteId } = params
  const { page: pageUuid, duration: pulseDuration } = queryString.parse(search)

  const navigate = ({ page = pageUuid, duration = pulseDuration }) => {
    history.push({
      pathname: `/teams/${teamId}/${siteId}`,
      search: `?${queryString.stringify({
        page,
        duration
      })}`
    })
  }

  const durationInDays = pulseDuration || 7

  const { data, loading, error } = useQuery(GetPulsePageData, {
    variables: {
      teamId,
      siteId,
      page: pageUuid
    }
  })

  const childRoute = profile => {
    let search = '?'
    if (pageUuid) search += `page=${pageUuid}&`
    if (profile) search += `profile=${profile}`
    return { pathname: '', search: search.length > 1 ? search : null }
  }

  const snapshotRoute = ({ snapshot, measurement, profile }) => {
    return {
      ...childRoute(profile),
      pathname: `/teams/${teamId}/${siteId}/snapshots/${snapshot}${
        measurement ? `/${measurement}` : ''
      }`
    }
  }

  const snapshotLink = (snapshot, profile) => {
    return snapshotRoute({ snapshot: snapshot, profile: profile })
  }

  if (error)
    return (
      <Suspense>
        <ErrorHandler error={error} />
      </Suspense>
    )

  if (loading || !data) return null

  const {
    currentUser,
    team: { organisation, site }
  } = data

  const { summarySortBy, summarySortDirection } = currentUser || {}
  const { slug: orgId, name: organisationName } = organisation || {}
  const {
    name: siteName,
    testProfiles = [],
    page,
    hasRecentlyCompletedSnapshots,
    createdAt
  } = site

  const initialSnapshotInProgress =
    isAfter(parseISO(createdAt), subDays(new Date(), 1)) &&
    !hasRecentlyCompletedSnapshots

  return (
    <>
      <PageTitle id="pulse.title" breadcrumbs={[siteName, organisationName]} />
      <div className="section-header">
        <div className="type-large">
          <h2 className="type-large m--0" style={{ display: 'inline-block' }}>
            <FormattedMessage id="pulse.heading" />
          </h2>
          <span className="type-dim">
            <ChevronRightIcon ml={2} mr={1} />
          </span>
          <PageSwitcher
            teamId={teamId}
            siteId={siteId}
            onApply={navigate}
            selectedPage={page}
          />
        </div>
      </div>
      {(feedback.location === 'site' && (
        <Suspense fallback={<div />}>
          <Feedback
            data-qa="sitesFeedback"
            duration={0}
            onDismiss={clearFeedback}
            {...feedback}
          />
        </Suspense>
      )) ||
        null}

      {(initialSnapshotInProgress && (
        <Suspense>
          <InitialSnapshotsInProgress
            orgId={orgId}
            siteId={siteId}
            teamId={teamId}
            name={site.name}
            favicon={site.page.favicon}
            scheduleInterval={site.scheduleInterval}
          />
        </Suspense>
      )) ||
        (page && (
          <Suspense>
            <SnapshotSummary
              snapshotRoute={snapshotRoute}
              testProfiles={testProfiles}
              summary={page.measurementSummary}
              initialSortBy={summarySortBy}
              initialSortDirection={summarySortDirection}
            />
            <PulseMetrics
              orgId={orgId}
              teamId={teamId}
              siteId={siteId}
              page={page.uuid}
              childRoute={childRoute}
              duration={durationInDays}
              onChangeDateRange={duration => navigate({ duration })}
              snapshotLink={snapshotLink}
            />
          </Suspense>
        ))}
    </>
  )
}

export default Pulse
