import React, { Suspense, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import {
  LazyLoadingMainComponent,
  LazyPageComponent,
  LoadingRoute
} from '../components/LazyComponent'

import { useSession } from '../providers/SessionProvider'

const Pulse = React.lazy(() =>
  import(/* webpackChunkName: "pulse" */ '../containers/Pulse')
)

const BudgetsOverview = React.lazy(() =>
  import(
    /* webpackChunkName: "budgetsOverview" */ '../components/templates/Budgets/Overview'
  )
)
const Budget = React.lazy(() =>
  import(
    /* webpackChunkName: "budgetsBudget" */ '../components/templates/Budgets/Budget'
  )
)
const NewBudget = React.lazy(() =>
  import(
    /* webpackChunkName: "budgetsNew" */ '../components/templates/Budgets/New'
  )
)
const EditBudget = React.lazy(() =>
  import(
    /* webpackChunkName: "budgetsEdit" */ '../components/templates/Budgets/Edit'
  )
)

const PagesOverview = React.lazy(() =>
  import(
    /* webpackChunkName: "pagesOverview" */ '../components/templates/Pages/Overview'
  )
)

const Metric = React.lazy(() =>
  import(/* webpackChunkName: "metric" */ '../containers/Metric')
)

const Snapshots = React.lazy(() =>
  import(/* webpackChunkName: "snapshot" */ '../containers/Snapshots')
)

const Snapshot = React.lazy(() =>
  import(/* webpackChunkName: "snapshot" */ '../containers/Snapshot')
)

const SiteSettings = React.lazy(() =>
  import(/* webpackChunkName: "siteSettings" */ '../containers/settings/Site')
)

const NotFound = React.lazy(() =>
  import(/* webpackChunkName: "notFound" */ '../components/templates/NotFound')
)

const NotAuthorised = React.lazy(() => import('../containers/NotAuthorised'))

const Site = ({ match }) => {
  const {
    params: { teamId, siteId }
  } = match || { params: {} }

  const { setSite, site, can, error } = useSession()

  useEffect(() => {
    setSite({ teamId, siteId })
  }, [siteId])

  if (error?.type === 'Site')
    return (
      <Suspense fallback={<div />}>
        <NotFound id="site" />
      </Suspense>
    )

  if (site)
    return (
      <Switch>
        <Route
          exact
          path="/teams/:teamId/:siteId"
          component={LazyLoadingMainComponent(Pulse)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/pages"
          component={LazyPageComponent(PagesOverview)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/budgets"
          component={LazyPageComponent(BudgetsOverview)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/budgets/new"
          component={
            can('createMetricBudgets')
              ? LazyPageComponent(NewBudget)
              : NotAuthorised
          }
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/budget/:uuid"
          to="/teams/:teamId/:siteId/budgets/:uuid"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/budgets/:uuid"
          component={
            can('readSites') ? LazyLoadingMainComponent(Budget) : NotAuthorised
          }
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/budget/:uuid/edit"
          to="/teams/:teamId/:siteId/budgets/:uuid/edit"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/budgets/:uuid/edit"
          component={
            can('updateMetricBudgets')
              ? LazyPageComponent(EditBudget)
              : NotAuthorised
          }
        />
        <Route
          path="/teams/:teamId/:siteId/settings"
          component={
            can('updateSites')
              ? LazyLoadingMainComponent(SiteSettings)
              : NotAuthorised
          }
        />
        <Redirect
          exact
          from="/:teamId/:siteId/budgets/:measurement/new"
          to="/teams/:teamId/:siteId/budgets/:measurement/new"
        />
        <Redirect
          exact
          from="/:teamId/:siteId/metrics/:measurement/"
          to="/teams/:teamId/:siteId/metrics/:measurement"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/metrics/:measurement/"
          component={
            can('readSites') ? LazyLoadingMainComponent(Metric) : NotAuthorised
          }
        />
        <Redirect
          exact
          from="/:teamId/:siteId/budgets/:measurement/:id"
          to="/teams/:teamId/:siteId/budgets/:measurement/:id"
        />
        <Redirect
          exact
          from="/:teamId/:siteId/snapshots"
          to="/teams/:teamId/:siteId/:siteId/snapshots"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/snapshots"
          component={LazyLoadingMainComponent(Snapshots)}
        />
        <Redirect
          exact
          from="/:teamId/:siteId/snapshots/:snapshotId"
          to="/teams/:teamId/:siteId/snapshots/:snapshotId"
        />
        <Route
          path="/teams/:teamId/:siteId/snapshots/:snapshotId"
          component={LazyLoadingMainComponent(Snapshot)}
        />
      </Switch>
    )

  return <LoadingRoute />
}

export default Site
