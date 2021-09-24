import React from 'react'
import { useQuery } from '@apollo/client'

import { GetSnapshotOverview } from '../../../queries/SnapshotQueries.gql'
import Template from '../Test/Overview'

const Overview = ({ teamId, siteId, snapshotId, pageUuid, profileUuid }) => {
  const { loading: loading, data } = useQuery(GetSnapshotOverview, {
    variables: { teamId, siteId, snapshotId, pageUuid, profileUuid }
  })
  const { test } = (!loading && data && data.team.site.snapshot) || {}
  const { har, harUrl } = test || {}
  const { mainThreadActivity } = test || {}

  return (
    <Template
      {...test}
      har={har}
      harUrl={harUrl}
      mainThreadActivity={mainThreadActivity}
    />
  )
}

export default Overview
