import React, { Suspense, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'

import LazyComponent, {
  LoadingRoute,
  LazyLoadingMainComponent
} from '../components/LazyComponent'

import { useSession } from '../providers/SessionProvider'

const ApiManagement = React.lazy(() =>
  import(
    /* webpackChunkName: "api" */ '../containers/Organisation/ApiManagement'
  )
)

const CreateApi = React.lazy(() =>
  import(
    /* webpackChunkName: "createApi" */ '../containers/Organisation/ApiManagement/CreateApi'
  )
)

const EditApi = React.lazy(() =>
  import(
    /* webpackChunkName: "editApi" */ '../containers/Organisation/ApiManagement/EditApi'
  )
)

const MemberManagement = React.lazy(() =>
  import(
    /* webpackChunkName: "memberManagement" */ '../containers/Organisation/MemberManagement'
  )
)

const AddMember = React.lazy(() =>
  import(
    /* webpackChunkName: "addMember" */ '../containers/Organisation/MemberManagement/AddMember'
  )
)

const EditMember = React.lazy(() =>
  import(
    /* webpackChunkName: "editMember" */ '../containers/Organisation/MemberManagement/EditMember'
  )
)

const GitHub = React.lazy(() =>
  import(/* webpackChunkName: "github" */ '../containers/Organisation/GitHub')
)

const Billing = React.lazy(() =>
  import(/* webpackChunkName: "billing" */ '../containers/Organisation/Billing')
)

const Plan = React.lazy(() =>
  import(/* webpackChunkName: "plan" */ '../containers/Organisation/Plan')
)

const OrganisationSettings = React.lazy(() =>
  import(
    /* webpackChunkName: "organisationSettings" */ '../containers/Organisation/OrganisationSettings'
  )
)

const OrganisationIndex = React.lazy(() =>
  import(/* webpackChunkName: "organisation" */ '../containers/Organisation')
)

const Teams = React.lazy(() => import('../containers/Organisation/Teams'))

const CreateTeam = React.lazy(() =>
  import('../containers/Organisation/Teams/Create')
)

const EditTeam = React.lazy(() =>
  import('../containers/Organisation/Teams/Edit')
)

const NotAuthorised = React.lazy(() =>
  import(/* webpackChunkName: "notAuthorised" */ '../containers/NotAuthorised')
)

const NotFound = React.lazy(() =>
  import(/* webpackChunkName: "notFound" */ '../components/templates/NotFound')
)

const Organisation = ({ match }) => {
  const {
    params: { orgId }
  } = match || { params: {} }

  const { setOrganisation, organisation, can, error } = useSession()

  useEffect(() => {
    setOrganisation({ orgId })
  }, [orgId])

  if (error?.type === 'Organisation')
    return (
      <Suspense fallback={<div />}>
        <NotFound id="organisation" />
      </Suspense>
    )

  if (organisation)
    return (
      <Switch>
        <Route
          path="/organisations/:orgId/teams/:teamId/edit"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? EditTeam : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/teams/new"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? CreateTeam : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/teams"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? Teams : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/settings"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? OrganisationSettings : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/billing/plan"
          component={LazyLoadingMainComponent(
            can('readPlan') ? Plan : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/billing"
          component={LazyLoadingMainComponent(
            can('readPlan') ? Billing : NotAuthorised
          )}
        />

        <Route
          exact
          path="/organisations/:orgId/api"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? ApiManagement : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/api/new"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? CreateApi : NotAuthorised
          )}
        />
        <Route
          exact
          path="/organisations/:orgId/api/:uuid/edit"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? EditApi : NotAuthorised
          )}
        />
        <Route
          exact
          path="/organisations/:orgId/members"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? MemberManagement : NotAuthorised
          )}
        />
        <Route
          exact
          path="/organisations/:orgId/members/new"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? AddMember : NotAuthorised
          )}
        />
        <Route
          exact
          path="/organisations/:orgId/members/:uuid/edit"
          component={LazyLoadingMainComponent(
            can('updateOrganisations') ? EditMember : NotAuthorised
          )}
        />
        <Route
          path="/organisations/:orgId/github"
          component={LazyLoadingMainComponent(GitHub)}
        />
        <Route
          path="/organisations/:orgId"
          component={LazyComponent(OrganisationIndex)}
        />
      </Switch>
    )

  return <LoadingRoute />
}

export default Organisation
