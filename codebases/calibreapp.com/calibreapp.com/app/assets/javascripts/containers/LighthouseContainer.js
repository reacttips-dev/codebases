import React, { Suspense } from 'react'
import { Query } from '@apollo/client/react/components'

import Loader from '../components/Loader'

import { GetLighthouseReport as GetSnapshotLighthouseReport } from '../queries/SnapshotQueries.gql'
import { GetLighthouseReport as GetStandaloneLighthouseReport } from '../queries/StandaloneTestQueries.gql'

const LighthouseReport = React.lazy(() =>
  import('../components/LighthouseReport')
)

const snapshotLighthouse = ({
  teamId,
  siteId,
  snapshotId,
  pageUuid,
  profileUuid,
  reportCategory
}) => {
  return (
    <Query
      query={GetSnapshotLighthouseReport}
      variables={{ teamId, siteId, snapshotId, pageUuid, profileUuid }}
    >
      {({ loading, data }) => {
        if (loading || !data) return <Loader />

        const lighthouseReport = data.team.site.snapshot.test.lighthouseReport

        return (
          <Suspense fallback={<div />}>
            <LighthouseReport
              lighthouseReport={lighthouseReport}
              reportCategory={reportCategory}
            />
          </Suspense>
        )
      }}
    </Query>
  )
}

const testLighthouse = ({ uuid, shareToken, reportCategory }) => {
  return (
    <Query
      query={GetStandaloneLighthouseReport}
      variables={{ uuid, shareToken }}
    >
      {({ loading, data }) => {
        if (loading || !data) return <Loader />

        const lighthouseReport = data.singlePageTest.lighthouseReport

        return (
          <Suspense fallback={<div />}>
            <LighthouseReport
              lighthouseReport={lighthouseReport}
              reportCategory={reportCategory}
            />
          </Suspense>
        )
      }}
    </Query>
  )
}

class LighthouseContainer extends React.Component {
  render() {
    // Lighthouse for a snapshot
    if (this.props.params && this.props.params.snapshotId) {
      const { teamId, siteId } = this.props.params
      const snapshotId = Number(this.props.params.snapshotId)
      const pageUuid = this.props.params.page
      const profileUuid = this.props.params.profile

      return snapshotLighthouse({
        teamId,
        siteId,
        snapshotId,
        pageUuid,
        profileUuid,
        reportCategory: this.props.reportCategory
      })
    } else if (this.props.uuid) {
      const { uuid, shareToken } = this.props
      return testLighthouse({
        uuid,
        shareToken,
        reportCategory: this.props.reportCategory
      })
    }
  }
}

export default LighthouseContainer
