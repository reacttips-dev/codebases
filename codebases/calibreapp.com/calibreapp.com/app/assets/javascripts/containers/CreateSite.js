import React, { useState, Suspense } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { New, Create } from '../queries/SiteQueries.gql'
import NewSite from '../components/templates/Sites/New'
import safeError from '../utils/safeError'
import PageTitle from '../components/PageTitle'

const Feedback = React.lazy(() => import('../components/templates/Feedback'))

const DEFAULT_TEST_PROFILES = [
  {
    name: 'Chrome Desktop',
    connection: 'cable'
  },
  {
    name: 'MotoG4, 3G connection',
    device: 'MotorolaMotoG4',
    connection: 'regular3G'
  },
  {
    name: 'iPhone, 4G LTE',
    device: 'iPhone8',
    connection: 'LTE'
  }
]

const CreateSite = ({
  match: {
    params: { teamId }
  },
  history
}) => {
  const [feedback, setFeedback] = useState()
  const [createSiteMutation, { loading: saving }] = useMutation(Create, {
    onCompleted: ({
      createSite: {
        slug: siteId,
        team: { slug: teamId }
      }
    }) => {
      history.push(`/teams/${teamId}/${siteId}`)
    },
    onError: error => {
      setFeedback({
        type: 'error',
        message: safeError(error)
      })
    }
  })

  const { data } = useQuery(New, {
    variables: { teamId },
    fetchPolicy: 'cache-and-network'
  })
  const { locations, team } = data || {}
  const { name: teamName, organisation } = team || {}
  const {
    slug: orgId,
    teamsList: { edges }
  } = organisation || { teamsList: { edges: [] } }

  const teams = (edges || []).map(({ node }) => node)

  const createSite = attributes => {
    if (saving) return

    const {
      name,
      team,
      pages,
      location,
      scheduleInterval,
      scheduleAnchor: scheduleAnchorInput,
      notifications
    } = attributes

    const eventSubscriptions = ['budget_alerts', 'snapshot_alerts']
    if (notifications) {
      eventSubscriptions.push('weekly_insights')
      eventSubscriptions.push('monthly_insights')
    }

    const scheduleAnchor = ['off', 'hourly'].includes(scheduleInterval)
      ? null
      : parseInt(scheduleAnchorInput)

    createSiteMutation({
      variables: {
        orgId,
        attributes: {
          name,
          team,
          testProfiles: DEFAULT_TEST_PROFILES,
          pages: Object.values(pages),
          eventSubscriptions,
          agentSettings: {
            location,
            scheduleInterval,
            scheduleAnchor
          }
        }
      }
    })
  }

  return (
    <>
      <PageTitle id="site.new.title" breadcrumbs={[teamName]} />
      {!feedback || (
        <Suspense fallback={<div />}>
          <Feedback {...feedback} />
        </Suspense>
      )}
      <NewSite
        orgId={orgId}
        teamId={teamId}
        locations={locations}
        teams={teams}
        team={teamId}
        onCreate={createSite}
        location="NorthVirginia"
        scheduleInterval="every_x_hours"
        scheduleAnchor={6}
      />
    </>
  )
}

export default CreateSite
