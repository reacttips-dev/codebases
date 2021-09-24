import React, { Suspense } from 'react'
import queryString from 'query-string'
import { Switch, Route } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { GetSnapshotTest } from '../../../queries/SnapshotQueries.gql'
import Nav from '../Test/Nav'

const Overview = React.lazy(() => import('./Overview'))
const LighthouseContainer = React.lazy(() =>
  import('../../../containers/LighthouseContainer')
)
const ThirdParties = React.lazy(() => import('./ThirdParties'))

const Snapshot = ({
  teamId,
  siteId,
  snapshotId,
  pageUuid,
  profileUuid,
  url
}) => {
  const { loading, data } = useQuery(GetSnapshotTest, {
    variables: {
      teamId,
      siteId,
      snapshotId,
      pageUuid,
      testProfileUuid: profileUuid
    }
  })

  const { team } = data || {}
  const { site } = team || {}
  const { snapshot } = site || {}
  const { test } = snapshot || {}
  const { measurements } = test || {}

  const query = queryString.stringify({
    page: pageUuid,
    profile: profileUuid
  })

  return (
    <>
      <Nav
        path={`/teams/${teamId}/${siteId}/snapshots/${snapshotId}`}
        query={query}
        loading={loading}
        measurements={measurements}
      />
      <React.Fragment>
        <Switch>
          <Route
            exact
            path={`${url}/`}
            render={() => (
              <Suspense fallback={<div />}>
                <Overview
                  teamId={teamId}
                  siteId={siteId}
                  snapshotId={snapshotId}
                  pageUuid={pageUuid}
                  profileUuid={profileUuid}
                />
              </Suspense>
            )}
          />
          <Route
            exact
            path={`${url}/third-parties`}
            render={props => (
              <Suspense fallback={<div />}>
                <ThirdParties
                  teamId={teamId}
                  siteId={siteId}
                  snapshotId={snapshotId}
                  pageUuid={pageUuid}
                  profileUuid={profileUuid}
                  {...props}
                />
              </Suspense>
            )}
          />
          {['performance', 'pwa', 'best-practices', 'accessibility', 'seo'].map(
            audit => (
              <Route
                key={audit}
                exact
                path={`${url}/${audit}`}
                render={props => (
                  <Suspense fallback={<div />}>
                    <LighthouseContainer
                      params={{
                        teamId,
                        siteId,
                        snapshotId,
                        page: pageUuid,
                        profile: profileUuid
                      }}
                      reportCategory={audit}
                      {...props}
                    />
                  </Suspense>
                )}
              />
            )
          )}
        </Switch>
      </React.Fragment>
    </>
  )
}

export default Snapshot
