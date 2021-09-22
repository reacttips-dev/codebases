import React from 'react'
import {
  Redirect,
  Router,
  Route,
  IndexRoute
} from 'react-router'

import * as AppRoutes from './constants/AppRoutes'

import App from './containers/App.jsx'
import HomeContainer from './containers/HomeContainer'
import SpaceContainer from './containers/SpaceContainer'
import ProjectContainer from './containers/ProjectContainer'
import ProjectPrototypeContainer from './containers/ProjectPrototypeContainer'
import PagesContainer from './containers/PagesContainer'
import { storeRef } from './store/store'

import { getItem } from './utils/cache'

class SpacesRouter extends React.Component {
  componentDidMount () {
    if (window.rum) {
      const hasCachedData = getItem('home.documents.documents', false)
      const hasPagingEnabled = getItem('home.documents.pagingEnabled', false)

      window.rum.markTime('spaInitialRender', {
        featureName: 'home',
        cachedAppData: hasPagingEnabled ? false : !!hasCachedData
      })
    }
  }

  render () {
    return (
      <Router history={storeRef.history}>
        <Route path={AppRoutes.ROUTE_HOME} component={App} {...this.props}>
          <Route path={AppRoutes.ROUTE_SPACES} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_DOCUMENTS} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_ARCHIVED_DOCUMENTS} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_TEAM_SPACES} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_TEAM_DOCUMENTS} component={HomeContainer} {...this.props} />

          {/* New routes, will turn on commented redirects after feature flag is disabled */}
          <Route path={AppRoutes.ROUTE_MY_SPACES} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_MY_DOCUMENTS} component={HomeContainer} {...this.props} />

          <Route path={AppRoutes.ROUTE_MY_CREATED_DOCUMENTS} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_MY_CREATED_SPACES} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_PAGES} component={PagesContainer} {...this.props} />

          <Route path={AppRoutes.ROUTE_DOCUMENT_TYPE_ALL} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_DOCUMENT_TYPE_CREATED_BY_ME} component={HomeContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_DOCUMENT_TYPE_ARCHIVED} component={HomeContainer} {...this.props} />

          {/* Spaces UI */}
          <Route path={AppRoutes.ROUTE_SPACE} component={SpaceContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_SPACE_MY_DOCUMENTS} component={SpaceContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_SPACE_ARCHIVED_DOCUMENTS} component={SpaceContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_SPACE_PROJECTS} component={SpaceContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_SPACE_ALL} component={SpaceContainer} {...this.props} />

          {/* Project */}
          <Route path={AppRoutes.ROUTE_PROJECT} component={ProjectContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_PROJECT_MY_DOCUMENTS} component={ProjectContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_PROJECT_ARCHIVED_DOCUMENTS} component={ProjectContainer} {...this.props} />
          <Route path={AppRoutes.ROUTE_PROJECT_PROTOTYPE} component={ProjectPrototypeContainer} {...this.props} />

          {/* Search */}
          <Route path={AppRoutes.ROUTE_SEARCH} component={HomeContainer} {...this.props} />

          <Redirect from={AppRoutes.LEGACY_SPACE} to={AppRoutes.ROUTE_SPACE} />
          <IndexRoute component={HomeContainer} {...this.props} />
        </Route>
      </Router>
    )
  }
}

export default SpacesRouter
