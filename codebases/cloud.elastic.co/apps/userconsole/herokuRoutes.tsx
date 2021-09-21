/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { RouteConfig } from 'react-router-config'
import { Store } from 'redux'

import ClusterConsole from '../../components/ClusterConsole'
import ClusterSnapshots from '../../components/Cluster/Snapshots'
import DeploymentOperations from '../../components/DeploymentOperations'
import DeploymentSecurity from './components/DeploymentSecurity'
import SnapshotDetails from '../../components/Cluster/Snapshots/SnapshotDetails'
import Deployment from '../../components/Deployment'
import DeploymentOverview from '../../components/Deployment/Overview'
import NotFound from '../../components/ErrorPages/NotFound'
import SsoErrors from '../../components/ErrorPages/SsoErrors'

import EditStackDeploymentRoute from '../../components/StackDeploymentEditor/EditStackDeploymentRoute'
import EsClusterRedirect from '../../components/StackDeployments/EsClusterRedirect'
import StackDeploymentActivityRoute from '../../components/StackDeploymentActivityRoute'
import StackDeploymentSlider from '../../components/StackDeploymentSlider'
import Logout from '../../components/Logout'

import DeploymentExtensions from '../../components/DeploymentExtensions'
import DeploymentExtensionsGate from '../../components/DeploymentExtensionsGate'
import DeploymentExtensionCreate from '../../components/DeploymentExtensionCreate'
import DeploymentExtensionEdit from '../../components/DeploymentExtensionEdit'

// User Console components
import AppRoot from './components/AppRoot'
import RootHandler from './components/RootHandler'
import FullStoryTracking from './components/FullStoryTracking'
import ClusterOverview from './components/Cluster/Overview'
import Support from './components/Support'
import LogsMetrics from './components/Deployment/Logs'
import PerformanceMetrics from './components/PerformanceMetrics'

import { resolveDeploymentUrlForEsCluster, deploymentUrl } from '../../lib/urlBuilder'

import { getHerokuCluster } from '../../lib/heroku'

import { hydrateRouteConfig, withRouteChain } from '../../lib/router'

import { ReduxState, RedirectConfig } from '../../types'

export function getHerokuRedirects(_params: { store: Store<ReduxState> }): RedirectConfig[] {
  return [...getHerokuClusterRedirects(), ...getStackDeploymentRedirects(), ...getPluginRedirects()]

  function getHerokuClusterRedirects(): RedirectConfig[] {
    const herokuCluster = getHerokuCluster()

    if (!herokuCluster) {
      return []
    }

    return [
      {
        from: '/',
        to: resolveDeploymentUrlForEsCluster(
          deploymentUrl,
          herokuCluster.regionId,
          herokuCluster.id,
        ),
      },
    ]
  }

  function getStackDeploymentRedirects(): RedirectConfig[] {
    return [
      {
        from: '/region/:regionId/deployment/:deploymentId',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/edit',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/edit',
      },

      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/elasticsearch',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch/config',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/edit',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch/console',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/elasticsearch/console',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch/logs',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/logs-metrics',
      },
      {
        from: '/deployments/:deploymentId/elasticsearch/logs',
        to: '/deployments/:deploymentId/logs-metrics',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch/snapshots',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/elasticsearch/snapshots',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/elasticsearch/snapshots/:snapshotName',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/elasticsearch/,snapshots/:snapshotName',
      },

      {
        from: '/region/:regionId/deployment/:deploymentId/kibana',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/kibana',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/kibana/edit',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/edit',
      },

      {
        from: '/region/:regionId/deployment/:deploymentId/apm',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/apm',
      },

      {
        from: '/region/:regionId/deployment/:deploymentId/metrics',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/metrics',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/security',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/security',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/index-curation',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/index-curation',
      },

      {
        from: '/region/:regionId/deployment/:deploymentId/activity',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/activity',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/activity/elasticsearch',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/activity/elasticsearch',
      },
      {
        from: '/region/:regionId/deployment/:deploymentId/activity/kibana',
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/activity/kibana',
      },
    ]
  }

  function getPluginRedirects(): RedirectConfig[] {
    return [
      { from: '/plugins', to: '/extensions' },
      { from: '/plugins/create', to: '/extensions/create' },
      { from: '/plugins/:pluginId', to: '/extensions/:extensionId/edit' },
    ]
  }
}

export function getHerokuRoutes(_params: { store: Store<ReduxState> }): RouteConfig[] {
  const routes: RouteConfig[] = [
    {
      component: AppRoot,
      routes: [
        { path: '/logout', component: Logout, title: 'Logging out' },
        { path: '/errors/sso', component: SsoErrors, title: 'Error' },

        {
          component: FullStoryTracking,
          routes: [...getLoggedInRoutes(), { component: NotFound, title: 'Not Found' }],
        },
      ],
    },
  ]

  return routes.map(hydrateRouteConfig)

  function getLoggedInRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [
      ...getStackDeploymentRoutes(),
      ...getExtensionsRoutes(),

      { path: '/support', component: Support, title: 'Support' },
    ]

    return routes.map(withRouteChain(RootHandler))
  }

  function getStackDeploymentRoutes(): RouteConfig[] {
    return [
      {
        path: '/deployments/resolve/cluster/:regionId/:deploymentId',
        component: EsClusterRedirect,
      },
      {
        path: '/deployments/resolve/cluster/:regionId/:deploymentId/**',
        component: EsClusterRedirect,
      },

      ...getDeploymentRoutes(),
    ]

    function getDeploymentRoutes(): RouteConfig[] {
      const routes: RouteConfig[] = [
        {
          path: '/deployments/:deploymentId',
          component: DeploymentOverview,
          title: getDeploymentOverviewTitle,
        },
        {
          path: '/deployments/:deploymentId/edit',
          component: EditStackDeploymentRoute,
          title: 'Edit deployment',
        },

        {
          path: '/deployments/:deploymentId/elasticsearch',
          component: ClusterOverview,
          title: 'Manage Elasticsearch',
        },
        {
          path: '/deployments/:deploymentId/elasticsearch/console',
          component: ClusterConsole,
          title: 'Deployment console',
        },
        {
          path: '/deployments/:deploymentId/elasticsearch/snapshots',
          component: ClusterSnapshots,
          title: 'Deployment snapshots',
        },
        {
          path: '/deployments/:deploymentId/elasticsearch/snapshots/:snapshotName',
          component: SnapshotDetails,
          title: 'Snapshot :snapshotName',
        },

        ...getStackKibanaRoutes(),

        {
          path: '/deployments/:deploymentId/activity',
          component: StackDeploymentActivityRoute,
          title: 'Deployment Activity',
        },
        {
          path: '/deployments/:deploymentId/activity/elasticsearch',
          component: StackDeploymentActivityRoute,
          title: 'Elasticsearch Activity',
        },
        {
          path: '/deployments/:deploymentId/activity/kibana',
          component: StackDeploymentActivityRoute,
          title: 'Kibana Activity',
        },
        {
          path: '/deployments/:deploymentId/logs-metrics',
          component: LogsMetrics,
          title: 'Logs and metrics',
        },
        {
          path: '/deployments/:deploymentId/metrics',
          component: PerformanceMetrics,
          title: 'Performance',
        },
        {
          path: '/deployments/:deploymentId/security',
          component: DeploymentSecurity,
          title: 'Security',
        },
        {
          path: '/deployments/:deploymentId/index-curation',
          component: DeploymentOperations,
          title: 'Index curation',
        },
      ]

      return routes.map(withRouteChain(Deployment))

      function getStackKibanaRoutes(): RouteConfig[] {
        const routes: RouteConfig[] = [
          {
            path: '/deployments/:deploymentId/kibana',
            component: StackDeploymentSlider,
            title: 'Manage Kibana',
          },
        ]

        return routes
      }
    }
  }

  function getExtensionsRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [
      {
        path: '/extensions',
        component: DeploymentExtensions,
        title: 'Deployment extensions',
      },
      {
        path: '/extensions/create',
        component: DeploymentExtensionCreate,
        title: 'Create deployment extension',
      },
      {
        path: '/extensions/:extensionId/edit',
        component: DeploymentExtensionEdit,
        title: 'Deployment extension (:extensionId)',
      },
    ]

    return routes.map(withRouteChain(DeploymentExtensionsGate))
  }
}

function getDeploymentOverviewTitle({ match: { params } }): string {
  const { deploymentId } = params
  const shortId = deploymentId.substr(0, 6)

  return `[${shortId}] Overview`
}
