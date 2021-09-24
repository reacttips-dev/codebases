import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { LazyLayoutComponent } from '../../../components/LazyComponent'

const Overview = React.lazy(() =>
  import(/* webpackChunkName: "billingOverview" */ './Overview')
)

const Payment = React.lazy(() =>
  import(/* webpackChunkName: "billingPayment" */ './Payment')
)

const Invoices = React.lazy(() =>
  import(/* webpackChunkName: "billingInvoices" */ './Invoices')
)

import Header from '../../../components/templates/Organisation/Billing/Header'

const ROUTES = {
  '': 0,
  payment: 1,
  invoices: 2
}

const Organisation = ({
  location: { pathname },
  history,
  match: {
    params: { orgId }
  }
}) => {
  const path = pathname.split('/')[4]
  const routeIndex = ROUTES[path]

  if (path && path.length && !routeIndex) {
    history.push(`/organisations/${orgId}/billing`)
    return null
  }

  const onChange = index => {
    const route = Object.keys(ROUTES)[index]
    history.push(`/organisations/${orgId}/billing/${route}`)
  }

  const stripe_key = document
    .querySelector('meta[name="stripe-pk"]')
    .getAttribute('content')
  const stripePromise = loadStripe(stripe_key)

  return (
    <Elements stripe={stripePromise}>
      <Header routeIndex={routeIndex} onChangeRoute={onChange} />
      <Switch>
        <Route
          exact
          path="/organisations/:orgId/billing"
          component={LazyLayoutComponent(Overview)}
        />
        <Route
          exact
          path="/organisations/:orgId/billing/payment"
          component={LazyLayoutComponent(Payment)}
        />
        <Route
          exact
          path="/organisations/:orgId/billing/invoices"
          component={LazyLayoutComponent(Invoices)}
        />
      </Switch>
    </Elements>
  )
}

export default Organisation
