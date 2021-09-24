import React, { Suspense } from 'react'
import { render } from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { ApolloProvider, ApolloClient, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { InMemoryCache } from '@apollo/client/cache'
import { ThemeProvider } from 'styled-components'
import { IntlProvider } from 'react-intl'
import { Intercom, LiveChatLoaderProvider } from 'react-live-chat-loader'

import CsrfToken from './utils/csrf'
import ScrollToTop from './containers/ScrollToTop'
import theme from './theme'
import localeData from './locales'

import LazyComponent, { LazyLoadingRoute } from './components/LazyComponent'

const ErrorBoundary = React.lazy(() =>
  import(/* webpackChunkName: "errorBounday" */ './containers/ErrorBoundary')
)

const FeedbackProvider = React.lazy(() =>
  import(
    /* webpackChunkName: "feedbackProvider" */ './providers/FeedbackProvider'
  )
)

const SessionProvider = React.lazy(() =>
  import(
    /* webpackChunkName: "sessionProvider" */ './providers/SessionProvider'
  )
)

const Navigation = React.lazy(() =>
  import(/* webpackChunkName: "navigation" */ './components/Navigation')
)

const PageTitle = React.lazy(() =>
  import(/* webpackChunkName: "pageTitle" */ './components/PageTitle')
)

const OrganisationRoutes = React.lazy(() =>
  import(/* webpackChunkName: "organisationRoutes" */ './routes/Organisation')
)

const TeamRoutes = React.lazy(() => import('./routes/Team'))

const SiteRoutes = React.lazy(() => import('./routes/Site'))

const StandaloneRoutes = React.lazy(() => import('./routes/Standalone'))

const UserRoutes = React.lazy(() => import('./routes/User'))

const Setup = React.lazy(() => import('./containers/Setup'))

// Temporarily use relative time and dropdown vanilla scripts for legacy elements in order to remove angular more quickly
import relativeTime from './utils/relativeTime'
relativeTime()
import dropdown from './utils/dropdown'
dropdown()
import toggle from './utils/toggle'
toggle()
import confirmPrompt from './utils/confirm-event-prompt'
confirmPrompt()

if (
  'serviceWorker' in navigator &&
  new RegExp('https').test(document.location.protocol)
) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
  )
}

const credentials = 'same-origin'
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-Token': CsrfToken()
}
const dataIdFromObject = object => {
  const type = object.__typename || 'unknown-type'
  let id = object.slug || object.uuid || object.iid
  return id ? `${type}:${id}` : null
}

const client = new ApolloClient({
  defaultOptions: {
    name: 'private'
  },
  link: from([
    onError(({ graphQLErrors }) => {
      if (graphQLErrors?.find(({ message }) => message === 'Invalid Session'))
        window.location = `/invalid-session?redirect_to=${window.location.pathname}`
    }),
    new BatchHttpLink({
      uri: '/graphql',
      credentials,
      headers
    })
  ]),
  cache: new InMemoryCache({
    dataIdFromObject,
    typePolicies: {
      Organisation: {
        fields: {
          teams: {
            merge(existing, incoming) {
              return incoming
            }
          }
        }
      },
      Membership: {
        fields: {
          teams: {
            merge(existing, incoming) {
              return incoming
            }
          }
        }
      },
      Site: {
        fields: {
          testProfiles: {
            merge(existing, incoming) {
              return incoming
            }
          },
          headers: {
            merge(existing, incoming) {
              return incoming
            }
          },
          cookies: {
            merge(existing, incoming) {
              return incoming
            }
          }
        }
      }
    }
  })
})

const containerEl = document.querySelector('#react-app')
const navEl = document.querySelector('#react-nav')

const flashFeedback = el => {
  let initialFeedback = {}

  const alert = el.dataset.alert
  const notice = el.dataset.notice

  if (alert) {
    initialFeedback = { type: 'error', message: alert }
  } else if (notice) {
    initialFeedback = { type: 'success', message: notice }
  }

  return initialFeedback
}

const intercomId = el => el.dataset.intercom

const renderApp = () => {
  if (navEl) {
    render(
      <IntlProvider locale="en" messages={localeData}>
        <ThemeProvider theme={theme}>
          <LiveChatLoaderProvider
            provider="intercom"
            providerKey={intercomId(navEl)}
          >
            <ApolloProvider client={client}>
              <Router forceRefresh={true}>
                <Suspense
                  fallback={
                    <>
                      <div
                        style={{
                          height: '60px',
                          backgroundColor: 'rgb(4,20,82)'
                        }}
                      />
                      <div style={{ height: 'calc(100vh - 60px - 48px)' }} />
                    </>
                  }
                >
                  <ErrorBoundary>
                    <FeedbackProvider>
                      <SessionProvider>
                        <Navigation
                          forceRefresh={true}
                          feedback={flashFeedback(navEl)}
                        />
                      </SessionProvider>
                    </FeedbackProvider>
                  </ErrorBoundary>
                </Suspense>
              </Router>
            </ApolloProvider>
            <Intercom color="#3057F4" />
          </LiveChatLoaderProvider>
        </ThemeProvider>
      </IntlProvider>,
      navEl
    )
  } else if (containerEl) {
    render(
      <IntlProvider locale="en" messages={localeData}>
        <ThemeProvider theme={theme}>
          <LiveChatLoaderProvider
            provider="intercom"
            providerKey={intercomId(containerEl)}
          >
            <ApolloProvider client={client}>
              <Router>
                <Suspense
                  fallback={
                    <>
                      <div
                        style={{
                          height: '60px',
                          backgroundColor: 'rgb(4,20,82)'
                        }}
                      />
                      <div style={{ height: 'calc(100vh - 60px - 48px)' }} />
                    </>
                  }
                >
                  <ErrorBoundary>
                    <FeedbackProvider>
                      <ScrollToTop>
                        <PageTitle />
                        <SessionProvider>
                          <Navigation
                            forceRefresh={false}
                            feedback={flashFeedback(containerEl)}
                          />
                          <Switch>
                            <Route
                              path="/tests"
                              render={LazyLoadingRoute(StandaloneRoutes)}
                            />
                            <Route
                              path="/(organisation|organisations)/:orgId"
                              render={LazyLoadingRoute(OrganisationRoutes)}
                            />
                            <Route
                              path="/teams/:teamId/sites/new"
                              render={LazyLoadingRoute(TeamRoutes)}
                            />
                            <Route
                              path="/teams/:teamId/team"
                              render={LazyLoadingRoute(TeamRoutes)}
                            />
                            <Route
                              path="/teams/:teamId/:siteId"
                              render={LazyLoadingRoute(SiteRoutes)}
                            />
                            <Route
                              path="/teams/:teamId"
                              render={LazyLoadingRoute(TeamRoutes)}
                            />
                            <Route
                              path="/you"
                              render={LazyLoadingRoute(UserRoutes)}
                            />
                            <Route
                              path="/setup/:orgId?"
                              component={LazyComponent(Setup)}
                            />
                            <Redirect
                              exact
                              from="/:teamId/:siteId"
                              to="/teams/:teamId/:siteId"
                            />
                            <Redirect exact from="/:orgId" to="/teams/:orgId" />
                          </Switch>
                        </SessionProvider>
                      </ScrollToTop>
                    </FeedbackProvider>
                  </ErrorBoundary>
                </Suspense>
              </Router>
            </ApolloProvider>
            <Intercom color="#3057F4" />
          </LiveChatLoaderProvider>
        </ThemeProvider>
      </IntlProvider>,
      containerEl
    )
  }
}

renderApp()
