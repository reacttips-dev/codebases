import React, { createContext, useContext, useState } from 'react'
import { useQuery, useLazyQuery, ApolloError } from '@apollo/client'

import {
  GetSession,
  GetOrganisation,
  GetTeam,
  GetSite
} from '../../queries/SessionQueries.gql'

type ScopeTag =
  | 'readSites'
  | 'createSites'
  | 'deleteSites'
  | 'updateSiteAgentSettings'
  | 'createSnapshots'
  | 'updateSites'
  | 'deleteSnapshots'
  | 'createPageTests'
  | 'readPageTests'
  | 'createTestProfiles'
  | 'updateTestProfiles'
  | 'deleteTestProfiles'
  | 'createPages'
  | 'deletePages'
  | 'updatePages'
  | 'createDeploys'
  | 'deleteDeploys'
  | 'createMetricBudgets'
  | 'updateMetricBudgets'
  | 'deleteMetricBudgets'
  | 'createIntegrations'
  | 'updateIntegrations'
  | 'deleteIntegrations'
  | 'readMembers'
  | 'createMembers'
  | 'sendMemberInvites'
  | 'updateMembers'
  | 'deleteMembers'
  | 'updateOrganisations'
  | 'deleteOrganisations'
  | 'readApiKeys'
  | 'createApiKeys'
  | 'updateApiKeys'
  | 'deleteApiKeys'
  | 'createTeams'
  | 'updateTeams'
  | 'deleteTeams'
  | 'readTeamMembers'
  | 'readPlan'

type ErrorType = 'Organisation' | 'Team' | 'Site'

type Role = 'admin' | 'member' | 'viewer'

interface Scope {
  tag: ScopeTag
}

interface Error {
  type: ErrorType
  error: ApolloError
}

interface Organisation {
  name: string
  slug: string
  teams: Team[]
  features: string[]
  error?: ApolloError
}

interface Team {
  name: string
  slug: string
  organisation: Organisation
}

interface Site {
  name: string
  slug: string
  error: ApolloError
}

interface Membership {
  uuid: string
  user: User
  teams: Team[]
  organisation: Organisation
  scopes: Scope[]
  role: Role
}

interface User {
  uuid: string
  name: string
  staff: boolean
  features: string[]
  recentSites: string[]
}

interface OrganisationArguments {
  orgId: string
}

interface TeamArguments {
  teamId: string
}

interface SiteArguments {
  teamId: string
  siteId: string
}

interface Context {
  currentUser?: User
  error: Error | null
  organisation?: Organisation | null
  team: Team | null
  membership: Membership | null
  memberships: Membership[]
  site: Site | null
  setOrganisation({ orgId }: OrganisationArguments): void
  setTeam({ teamId }: TeamArguments): void
  setSite({ siteId }: SiteArguments): void
}

const SessionContext = createContext<Context>({} as Context)

const SessionProvider = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element | null => {
  const [organisation, setOrganisation] = useState<Organisation | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [site, setSite] = useState<Site | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const { data, loading } = useQuery(GetSession)

  const [getOrganisation] = useLazyQuery(GetOrganisation, {
    onCompleted: data => {
      const { organisation } = data || {}
      if (organisation) {
        setOrganisation(organisation)
        setMembership(organisation.membership)
        setError(null)
      }
    },
    onError: error => setError({ type: 'Organisation', error }),
    fetchPolicy: 'cache-and-network'
  })

  const [getTeam] = useLazyQuery(GetTeam, {
    onCompleted: data => {
      const { team } = data || {}
      if (team) {
        setTeam(team)
        setOrganisation(team.organisation)
        setMembership(team.organisation.membership)
        setError(null)
      }
    },
    onError: error => setError({ type: 'Team', error })
  })

  const [getSite] = useLazyQuery(GetSite, {
    onCompleted: data => {
      const { team } = data || {}
      if (team) {
        setTeam(team)
        setOrganisation(team.organisation)
        setMembership(team.organisation.membership)
        setSite(team.site)
        setError(null)
      }
    },
    onError: error => setError({ type: 'Site', error })
  })

  const handleSetOrganisation = ({ orgId }: OrganisationArguments): void => {
    getOrganisation({
      variables: { orgId }
    })
  }

  const handleSetTeam = ({ teamId }: TeamArguments): void => {
    getTeam({
      variables: { teamId }
    })
  }

  const handleSetSite = ({ teamId, siteId }: SiteArguments): void => {
    getSite({
      variables: { teamId, siteId }
    })
  }

  if (loading)
    return (
      <>
        <div style={{ height: '60px', backgroundColor: 'rgb(4,20,82)' }} />
        <div style={{ height: 'calc(100vh - 60px - 48px - 15px)' }} />
      </>
    )

  const { currentUser } = data || {}

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        error,
        membership,
        memberships: currentUser?.memberships || [],
        organisation,
        setOrganisation: handleSetOrganisation,
        team,
        setTeam: handleSetTeam,
        site,
        setSite: handleSetSite
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

const useSession = () => {
  const value = useContext(SessionContext)
  const { currentUser, organisation, memberships, membership, error } = value
  const permissions: ScopeTag[] = (membership?.scopes || []).map(
    ({ tag }) => tag
  )

  const { slug: currentOrganisationId } =
    membership?.organisation ||
    (!(error?.type === 'Organisation') && organisation) ||
    memberships[0]?.organisation ||
    {}

  const { role } = membership || memberships[0] || { role: 'member' }

  return {
    ...value,
    error,
    currentUser,
    organisation,
    currentOrganisationId,
    currentRole: role,
    membership: memberships.find(({ uuid }) => uuid === membership?.uuid),
    teams: membership?.teams || organisation?.teams || [],
    permissions: permissions,
    can: (scope: ScopeTag) => currentUser?.staff || permissions.includes(scope),
    features: organisation?.features || currentUser?.features || []
  }
}

export default SessionProvider
export { useSession }
