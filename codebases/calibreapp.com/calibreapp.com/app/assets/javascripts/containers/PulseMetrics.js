import React, { Suspense } from 'react'
import { Query, Mutation } from '@apollo/client/react/components'
import { isAfter, subDays, parseISO } from 'date-fns'
import styled from 'styled-components'

import { GetPulseMetricsData } from '../queries/PulseQueries.gql'
import { UpdateUserSettings } from '../queries/UserQueries.gql'
import Error from '../components/Error'
import Button from '../components/Button'
import { formatDeployMarkers } from '../utils/deploys'
import Bugtracker from '../utils/bugtracker'
import { downloadTimeSeriesCSV } from '../utils/download'
import filteredMetrics from '../utils/filteredMetrics'

const Container = styled.div`
  min-height: 100vh;
`

import LegendProvider from '../components/Chart/Legend/Provider'
import PulseMetric from '../components/templates/PulseMetric'
import Loader from '../components/Loader'

const CustomiseMetrics = React.lazy(() =>
  import('../components/templates/CustomisePulseMetrics')
)

class Pulse extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      customiseMetrics: false
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err, info) {
    console.error(err, info)
    Bugtracker.notify(err)
  }

  get from() {
    const { duration } = this.props
    return subDays(new Date(), duration)
  }

  metricRoute = (measurement, profile) => {
    const { teamId, siteId, childRoute } = this.props
    return {
      ...childRoute(profile),
      pathname: `/teams/${teamId}/${siteId}/metrics/${measurement}`
    }
  }

  downloadMetric = (client, measurement) => {
    const { teamId, siteId, page } = this.props

    downloadTimeSeriesCSV(client, {
      teamId,
      siteId,
      measurements: [measurement],
      pages: [page],
      from: this.from
    })
  }

  render() {
    const {
      orgId,
      teamId,
      siteId,
      page,
      duration,
      onChangeDateRange,
      snapshotLink
    } = this.props
    const { hasError, customiseMetrics } = this.state

    if (hasError) return <Error />

    return (
      <Container display="block">
        <Query
          query={GetPulseMetricsData}
          variables={{
            teamId,
            siteId,
            from: this.from
          }}
        >
          {({ data, loading }) => {
            if (!data || loading) return null

            const { metrics = [], currentUser, team } = data

            let deploys = { edges: [] }
            let testProfiles = []

            let firstPage
            let pulseMetrics = []
            if (currentUser) {
              pulseMetrics = filteredMetrics(currentUser.pulseMetrics)
            }
            if (team) {
              const { site } = team
              firstPage = site?.pagesList?.edges[0]?.node?.uuid

              if (
                isAfter(parseISO(site.createdAt), subDays(new Date(), 1)) &&
                !site.hasRecentlyCompletedSnapshots
              )
                return null

              deploys = site.deploys
              testProfiles = site.testProfiles
            }

            return (
              (customiseMetrics && (
                <Mutation
                  mutation={UpdateUserSettings}
                  onCompleted={() => this.setState({ customiseMetrics: false })}
                >
                  {updateUserMetrics => (
                    <Suspense fallback={<Loader />}>
                      <CustomiseMetrics
                        metrics={filteredMetrics(metrics)}
                        pulseMetrics={pulseMetrics}
                        onCancel={() =>
                          this.setState({ customiseMetrics: false })
                        }
                        onSave={pulseMetrics => {
                          updateUserMetrics({ variables: { pulseMetrics } })
                        }}
                      />
                    </Suspense>
                  )}
                </Mutation>
              )) || (
                <LegendProvider initialState={testProfiles}>
                  <div className="page-section">
                    <div className="row middle-xs">
                      <div className="col-xs-12 col-sm-4">
                        <h3 className="type-medium m--b0">Metric History</h3>
                      </div>
                      <div className="col-xs-12 col-sm-8 center-xs end-sm">
                        <div className="type-small">
                          <Button
                            type="button"
                            onClick={() => {
                              this.setState({ customiseMetrics: true })
                            }}
                          >
                            Customise
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {pulseMetrics.map((metric, index) => (
                    <PulseMetric
                      key={metric.value}
                      customise={customiseMetrics}
                      metric={metric}
                      showControls={index === 0}
                      orgId={orgId}
                      siteId={siteId}
                      teamId={teamId}
                      page={page || firstPage}
                      from={this.from}
                      markers={formatDeployMarkers(deploys)}
                      duration={`${duration}`}
                      onChangeDateRange={onChangeDateRange}
                      snapshotLink={snapshotLink}
                      onDownloadMetric={this.downloadMetric}
                      metricRoute={this.metricRoute}
                    />
                  ))}
                </LegendProvider>
              )
            )
          }}
        </Query>
      </Container>
    )
  }
}

export default Pulse
