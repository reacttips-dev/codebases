import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { Teams } from '../../queries/OrganisationQueries.gql'
import { LoadingRoute } from '../../components/LazyComponent'

import NoTeam from '../../components/templates/NoTeam'

import { useSession } from '../../providers/SessionProvider'

const Organisation = ({
  history,
  match: {
    params: { orgId }
  }
}) => {
  const { features, can } = useSession({ orgId })
  const { data, loading } = useQuery(Teams, {
    variables: { orgId },
    fetchPolicy: 'network-only'
  })

  const { currentUser, organisation } = data || {}
  const {
    session: { teamSlug }
  } = currentUser || { session: {} }
  const {
    teamsList: { edges }
  } = organisation || { teamsList: {} }

  const teams = (edges || []).map(({ node }) => node)

  useEffect(() => {
    if (loading) return

    if (teams.length) {
      const { slug } = teams.find(({ slug }) => slug == teamSlug) || teams[0]
      history.push(`/teams/${slug}`)
    } else if (can('updateOrganisations')) {
      history.push(
        `/organisations/${orgId}/${
          features.includes('teams') ? 'teams' : 'members'
        }`
      )
    }
  }, [loading])

  if (loading) return <LoadingRoute />

  return <NoTeam />
}

export default Organisation
