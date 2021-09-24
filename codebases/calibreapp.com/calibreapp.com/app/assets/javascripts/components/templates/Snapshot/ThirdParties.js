import React from 'react'
import { useQuery } from '@apollo/client'

import Loader from '../../../components/Loader'
import { GetThirdParties } from '../../../queries/SnapshotQueries.gql'
import Template from '../../../components/templates/ThirdParties'

const ThirdParties = ({
  teamId,
  siteId,
  snapshotId,
  pageUuid,
  profileUuid
}) => {
  const { data, loading } = useQuery(GetThirdParties, {
    variables: { teamId, siteId, snapshotId, pageUuid, profileUuid }
  })

  if (loading || !data) return <Loader />

  const {
    team: {
      site: {
        snapshot: {
          test: {
            thirdPartySummary = {},
            mainThreadActivity = {},
            testProfile: { blockedThirdParties },
            measurements
          }
        }
      }
    }
  } = data
  const { error, third_parties: thirdParties = [], total } =
    thirdPartySummary || {}

  let thirdPartyMainThreadActivity = {}
  const { main_thread_activity: activities } = mainThreadActivity
  if (activities) {
    const thirdPartyActivities = activities.filter(
      activity => activity.third_parties.length
    )
    thirdPartyMainThreadActivity = {
      ...mainThreadActivity,
      main_thread_activity: thirdPartyActivities
    }
  }

  return (
    <Template
      error={error}
      measurements={measurements}
      thirdParties={thirdParties}
      blockedThirdParties={blockedThirdParties}
      mainThreadActivity={thirdPartyMainThreadActivity}
      total={total}
    />
  )
}

export default ThirdParties
