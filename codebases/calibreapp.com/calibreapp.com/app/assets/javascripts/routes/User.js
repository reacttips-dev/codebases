import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import {
  LoadingRoute,
  LazyLoadingMainComponent
} from '../components/LazyComponent'

import { useSession } from '../providers/SessionProvider'

const UserProfile = React.lazy(() =>
  import('../containers/settings/UserProfile')
)

const EmailNotifications = React.lazy(() =>
  import('../containers/settings/EmailNotifications')
)

const PersonalAccessTokens = React.lazy(() =>
  import('../containers/settings/PersonalAccessTokens')
)

const CreatePersonalAccessToken = React.lazy(() =>
  import('../containers/settings/CreatePersonalAccessToken')
)

const EditPersonalAccessToken = React.lazy(() =>
  import('../containers/settings/EditPersonalAccessToken')
)

const NotAuthorised = React.lazy(() => import('../containers/NotAuthorised'))

const User = () => {
  const { currentUser, loading } = useSession()

  if (loading) return <LoadingRoute />

  return (
    <Switch>
      <Redirect
        from="/settings/email-notifications"
        to="/you/settings/email-notifications"
      />
      <Route
        path="/you/settings/profile"
        component={LazyLoadingMainComponent(
          currentUser ? UserProfile : NotAuthorised
        )}
      />
      <Route
        path="/you/settings/email-notifications"
        component={LazyLoadingMainComponent(
          currentUser ? EmailNotifications : NotAuthorised
        )}
      />
      <Route
        exact
        path="/you/settings/tokens"
        component={LazyLoadingMainComponent(
          currentUser ? PersonalAccessTokens : NotAuthorised
        )}
      />
      <Route
        exact
        path="/you/settings/tokens/new"
        component={LazyLoadingMainComponent(
          currentUser ? CreatePersonalAccessToken : NotAuthorised
        )}
      />
      <Route
        exact
        path="/you/settings/tokens/:uuid/edit"
        component={LazyLoadingMainComponent(
          currentUser ? EditPersonalAccessToken : NotAuthorised
        )}
      />
    </Switch>
  )
}

export default User
