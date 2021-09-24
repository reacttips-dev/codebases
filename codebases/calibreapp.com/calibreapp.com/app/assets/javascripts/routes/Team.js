import React, { Suspense, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import {
  LazyLoadingMainComponent,
  LoadingRoute
} from '../components/LazyComponent'

import { useSession } from '../providers/SessionProvider'

const Sites = React.lazy(() =>
  import(/* webpackChunkName: "sites" */ '../containers/Sites')
)

const AddMembers = React.lazy(() => import('../containers/AddMembers'))

const Members = React.lazy(() => import('../containers/Members'))

const CreateSite = React.lazy(() => import('../containers/CreateSite'))

const NotFound = React.lazy(() => import('../components/templates/NotFound'))

const NotAuthorised = React.lazy(() => import('../containers/NotAuthorised'))

const Team = ({ match }) => {
  const {
    params: { teamId }
  } = match || { params: {} }

  const { setTeam, team, can, error } = useSession()

  useEffect(() => {
    setTeam({ teamId })
  }, [teamId])

  if (error?.type === 'Team')
    return (
      <Suspense fallback={<div />}>
        <NotFound id="team" />
      </Suspense>
    )

  if (team)
    return (
      <Switch>
        <Route
          exact
          path="/teams/:teamId"
          component={LazyLoadingMainComponent(Sites)}
        />
        <Route
          exact
          path="/teams/:teamId/team/add"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? AddMembers : NotAuthorised
          )}
        />
        <Route
          exact
          path="/teams/:teamId/team"
          component={LazyLoadingMainComponent(Members)}
        />
        <Route
          exact
          path="/teams/:teamId/sites/new"
          component={
            can('createSites')
              ? LazyLoadingMainComponent(CreateSite)
              : NotAuthorised
          }
        />
      </Switch>
    )

  return <LoadingRoute />
}

export default Team
