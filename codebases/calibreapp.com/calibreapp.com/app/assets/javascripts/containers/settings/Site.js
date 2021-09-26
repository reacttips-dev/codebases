import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { Main } from '../../components/Layout'
import { LoadingLayout } from '../../components/Loading'

const EditSite = React.lazy(() =>
  import(/* webpackChunkName: "editSite" */ './EditSite')
)

const AgentSettings = React.lazy(() =>
  import(/* webpackChunkName: "agentSettings" */ './AgentSettings')
)

const AuthenticationSettings = React.lazy(() =>
  import(/* webpackChunkName: "authenticationSettings" */ './Authentication')
)

const Profiles = React.lazy(() =>
  import(/* webpackChunkName: "profiles" */ './Profiles')
)
const CreateTestProfile = React.lazy(() =>
  import(/* webpackChunkName: "createTestProfile" */ './CreateTestProfile')
)
const EditTestProfile = React.lazy(() =>
  import(/* webpackChunkName: "editTestProfile" */ './EditTestProfile')
)

const PagesSettings = React.lazy(() =>
  import(/* webpackChunkName: "pagesSettings" */ './Pages')
)
const EditPage = React.lazy(() =>
  import(/* webpackChunkName: "editTestProfile" */ './EditPage')
)
const NewPage = React.lazy(() =>
  import(/* webpackChunkName: "createPage" */ './CreatePage')
)

const Integrations = React.lazy(() =>
  import(/* webpackChunkName: "integrations" */ './Integrations')
)
const EditIntegration = React.lazy(() =>
  import(/* webpackChunkName: "editIntegration" */ './EditIntegration')
)
const CreateIntegration = React.lazy(() =>
  import(/* webpackChunkName: "newIntegration" */ './CreateIntegration')
)
const EditGitHubIntegration = React.lazy(() =>
  import(
    /* webpackChunkName: "editGithubIntegration" */ './EditGitHubIntegration'
  )
)

import Navigation from '../../components/templates/Sites/Settings/Navigation'

//eslint-disable-next-line react/display-name
const SiteSettingsComponent = Component => props => (
  <Main m={null} mb={3} offset={135}>
    <Suspense fallback={<LoadingLayout />}>
      <Component {...props} />
    </Suspense>
  </Main>
)

const Site = ({
  match: {
    params: { teamId, siteId }
  }
}) => {
  return (
    <>
      <Navigation teamId={teamId} siteId={siteId} />
      <Switch>
        <Redirect
          exact
          from="/:teamId/:siteId/agent_settings"
          to="/teams/:teamId/:siteId/settings/agent"
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/agent_settings"
          to="/teams/:teamId/:siteId/settings/agent"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/agent"
          component={SiteSettingsComponent(AgentSettings)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/authentication"
          component={SiteSettingsComponent(AuthenticationSettings)}
        />
        <Redirect
          exact
          from="/:teamId/:siteId/test_profiles"
          to="/teams/:teamId/:siteId/test_profiles"
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/test_profiles"
          to="/teams/:teamId/:siteId/settings/profiles"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/profiles"
          component={SiteSettingsComponent(Profiles)}
        />
        <Redirect
          exact
          from="/:teamId/:siteId/test_profiles/new"
          to="/teams/:teamId/:siteId/test_profiles/new"
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/test_profiles/new"
          to="/teams/:teamId/:siteId/settings/profiles/new"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/profiles/new"
          component={SiteSettingsComponent(CreateTestProfile)}
        />
        <Redirect
          exact
          from="/:teamId/:siteId/test_profiles/:uuid/edit"
          to="/teams/:teamId/:siteId/test_profiles/:uuid/edit"
        />
        <Redirect
          exact
          from="/teams/:teamId/:siteId/test_profiles/:uuid/edit"
          to="/teams/:teamId/:siteId/settings/profiles/:uuid/edit"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/profiles/:uuid/edit"
          component={SiteSettingsComponent(EditTestProfile)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/pages"
          component={SiteSettingsComponent(PagesSettings)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/pages/new"
          component={SiteSettingsComponent(NewPage)}
        />
        <Redirect
          exact
          from="/:teamId/:siteId/pages/:uuid/edit"
          to="/teams/:teamId/:siteId/settings/pages/:uuid/edit"
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/pages/:uuid/edit"
          component={SiteSettingsComponent(EditPage)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/integrations"
          component={SiteSettingsComponent(Integrations)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/integrations/github/:uuid/edit"
          component={SiteSettingsComponent(EditGitHubIntegration)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/integrations/:provider/new"
          component={SiteSettingsComponent(CreateIntegration)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings/integrations/:provider/:uuid/edit"
          component={SiteSettingsComponent(EditIntegration)}
        />
        <Route
          exact
          path="/teams/:teamId/:siteId/settings"
          component={SiteSettingsComponent(EditSite)}
        />
      </Switch>
    </>
  )
}

export default Site
