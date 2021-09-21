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
import { defineMessages, IntlShape } from 'react-intl'
import { Store } from 'redux'

import ClusterConsole from '../../components/ClusterConsole'
import ClusterSnapshots from '../../components/Cluster/Snapshots'
import DeploymentOperations from '../../components/DeploymentOperations'
import DeploymentSecurity from './components/DeploymentSecurity'
import Account from '../../components/Portal/components/Account'
import PortalLandingPage from '../../components/Portal/components/PortalLandingPage'
import SnapshotDetails from '../../components/Cluster/Snapshots/SnapshotDetails'
import Deployment from '../../components/Deployment'
import DeploymentOverview from '../../components/Deployment/Overview'
import DeploymentGettingStarted from '../../components/Deployment/DeploymentGettingStarted'
import UserSettings from '../../components/UserSettings'
import UserAccountSettings from '../../components/Portal/components/UserAccountSettings'
import UserRegistration from '../../components/UserRegistration'
import ManageTrafficFilters from '../../components/ManageTrafficFilters'

import CreateStackDeploymentRoute from '../../components/StackDeploymentEditor/CreateStackDeploymentRoute'
import EditStackDeploymentRoute from '../../components/StackDeploymentEditor/EditStackDeploymentRoute'
import EsClusterRedirect from '../../components/StackDeployments/EsClusterRedirect'
import StackDeploymentsRoute from '../../components/StackDeploymentsRoute'
import StackDeploymentActivityRoute from '../../components/StackDeploymentActivityRoute'
import StackDeploymentSlider from '../../components/StackDeploymentSlider'
import Logout from '../../components/Logout'
import NotFound from '../../components/ErrorPages/NotFound'
import AccessDenied from '../../components/ErrorPages/AccessDenied'
import SsoErrors from '../../components/ErrorPages/SsoErrors'
import IlmMigration from '../../components/IlmMigration'

import DeploymentExtensions from '../../components/DeploymentExtensions'
import DeploymentExtensionsGate from '../../components/DeploymentExtensionsGate'
import DeploymentExtensionCreate from '../../components/DeploymentExtensionCreate'
import DeploymentExtensionEdit from '../../components/DeploymentExtensionEdit'

import UserApiKeys from '../../components/UserApiKeys'

// User Console components
import AppRoot from './components/AppRoot'
import RootHandler from './components/RootHandler'
import UserconsoleRootRoute from './components/UserconsoleRootRoute'

import DeploymentFeatures from './components/DeploymentFeatures'
import AccountDetails from './components/AccountDetails'
import ClusterOverview from './components/Cluster/Overview'
import LogsMetrics from './components/Deployment/Logs'
import TrustManagement from './components/TrustManagement'

import ConfirmEmailChange from './components/ConfirmEmailChange'
import FullStoryCookieNotice from './components/FullStoryCookieNotice'
import FullStoryTracking from './components/FullStoryTracking'
import ForgotPassword from './components/ForgotPassword'
import UserconsoleLogin from './components/Login'
import PartnerSignup from './components/PartnerSignup'
import VerifyMonitoringEmail from './components/VerifyMonitoringEmail'
import Support from './components/Support'
import PerformanceMetrics from './components/PerformanceMetrics'
import AccountSecurity from './components/AccountSecurity'
import StackDeploymentPricingRoute from './components/StackDeploymentPricingRoute'
import StackDeploymentPricingTable from './components/StackDeploymentPricing/StackDeploymentPricingTable'
import ResetPassword from './components/ResetPassword'
import CreatePassword from './components/CreatePassword'
import AcceptInvitation from './components/AcceptInvitation'

import { hasUserSettings } from '../../components/UserSettings/helpers'
import OAuthLogin from '../../components/Login/OAuthLogin'
import AzureLogin from '../../components/Login/AzureLogin'

import { getHerokuRoutes, getHerokuRedirects } from './herokuRoutes'

import {
  getSupportedSliderInstanceTypes,
  getSliderPrettyName,
  getSupportedSliderInstanceTypesWithoutEs,
} from '../../lib/sliders'

import { hydrateRouteConfig, withRouteChain } from '../../lib/router'

import { isFeatureActivated, getConfigForKey } from '../../selectors'

import Feature from '../../lib/feature'

import { ReduxState, RedirectConfig } from '../../types'

const messages = defineMessages({
  deploymentActivityPageSlider: {
    id: `userconsole-route-titles.deployment-activity-page-slider`,
    defaultMessage: `{name} Activity`,
  },
  sliderManagePageTitle: {
    id: `userconsole-route-titles.deployment-manage-page-slider`,
    defaultMessage: `Manage {name}`,
  },
})

export function getRedirects({ store }: { store: Store<ReduxState> }): RedirectConfig[] {
  const state = store.getState()
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`
  const showAccountActivity = isFeatureActivated(state, Feature.showAccountActivity)
  const isPortalFeatureEnabled = isFeatureActivated(state, Feature.cloudPortalEnabled)

  if (isHeroku) {
    return getHerokuRedirects({ store })
  }

  return [
    ...getPortalRedirects(),
    ...getStackDeploymentRedirects(),
    ...getAccountRedirects(),
    ...getPluginRedirects(),
    ...getSupportRedirects(),
  ]

  function getPortalRedirects(): RedirectConfig[] {
    if (!isPortalFeatureEnabled || !hasUserSettings(state)) {
      return []
    }

    return [{ from: '/settings', to: '/user/settings' }]
  }

  function getSupportRedirects(): RedirectConfig[] {
    return [{ from: '/help', to: '/support' }]
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
        to: '/deployments/resolve/cluster/:regionId/:deploymentId/elasticsearch/snapshots/:snapshotName',
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

      ...getSupportedSliderInstanceTypes().map((sliderInstanceType) => ({
        from: `/region/:regionId/deployment/:deploymentId/activity/${sliderInstanceType}`,
        to: `/deployments/resolve/cluster/:regionId/:deploymentId/activity/${sliderInstanceType}`,
      })),
    ]
  }

  function getAccountRedirects(): RedirectConfig[] {
    const indexRedirects = showAccountActivity
      ? [
          { from: '/account', to: '/account/billing' },
          { from: '/account/activity', to: '/account/usage' },
        ]
      : [{ from: '/account', to: '/account/contacts' }]

    const portalRedirects = isPortalFeatureEnabled
      ? [
          { from: '/account/profile', to: '/user/settings' },
          { from: '/account/security', to: '/user/settings' },
        ]
      : []

    return [...indexRedirects, ...portalRedirects]
  }

  function getPluginRedirects(): RedirectConfig[] {
    return [
      { from: '/plugins', to: '/extensions' },
      { from: '/plugins/create', to: '/extensions/create' },
      { from: '/plugins/:pluginId', to: '/extensions/:extensionId/edit' },
    ]
  }
}

export function getRoutes({
  intl,
  store,
}: {
  store: Store<ReduxState>
  intl: IntlShape
}): RouteConfig[] {
  const { formatMessage } = intl
  const state = store.getState()
  const isHeroku = getConfigForKey(state, `APP_FAMILY`) === `heroku`

  if (isHeroku) {
    return getHerokuRoutes({ store })
  }

  const showPrices = isFeatureActivated(state, Feature.showPrices)
  const showSecurityPage = isFeatureActivated(state, Feature.showSecurityPage)
  const isPortalFeatureEnabled = isFeatureActivated(state, Feature.cloudPortalEnabled)

  const routes: RouteConfig[] = [
    {
      component: AppRoot,
      routes: getRootRoutes(),
    },
  ]

  return routes.map(hydrateRouteConfig)

  function getRootRoutes(): RouteConfig[] {
    return [
      { path: '/login', component: UserconsoleLogin, title: 'Login' },
      {
        path: '/login/oauth',
        component: OAuthLogin,
        title: 'Login',
      },
      {
        path: '/login/azure',
        component: AzureLogin,
        title: 'Login',
      },
      { path: '/logout', component: Logout, title: 'Logging out' },
      {
        component: FullStoryTracking,
        routes: getTrackedRoutes(),
      },
    ]
  }

  function getTrackedRoutes(): RouteConfig[] {
    return [
      {
        path: '/registration',
        component: UserRegistration,
        title: 'Create your account',
      },
      {
        path: '/partner-signup',
        component: PartnerSignup,
        title: 'Sign up',
      },
      {
        path: '/account/reset-password',
        component: ResetPassword,
        title: 'Reset your password',
      },
      {
        path: '/account/verify-email',
        component: CreatePassword,
        title: 'Activate your account',
      },
      {
        path: '/account/accept-invite',
        component: AcceptInvitation,
        title: 'Accept email invitation',
      },
      {
        path: '/whitelist',
        component: VerifyMonitoringEmail,
        title: 'Whitelist monitoring email',
      },
      {
        path: '/forgot',
        component: ForgotPassword,
        title: 'Forgot password',
      },
      {
        path: '/change-email',
        component: ConfirmEmailChange,
        title: 'Confirm email change',
      },

      { path: '/', component: UserconsoleRootRoute },

      ...(showPrices
        ? [
            {
              path: '/pricing',
              component: FullStoryCookieNotice,
              routes: [
                {
                  path: '/pricing',
                  component: StackDeploymentPricingRoute,
                  title: 'Elasticsearch Service pricing calculator',
                },
              ],
            },
          ]
        : []),

      {
        path: '/deployment-pricing-table',
        component: StackDeploymentPricingTable,
        title: 'Elasticsearch Service pricing table',
      },

      { path: '/errors/sso', component: SsoErrors, title: 'Error' },

      ...getLoggedInRoutes(),

      { component: NotFound, title: 'Not Found' },
    ]
  }

  function getTrackedLoggedInRoutes(): RouteConfig[] {
    const props = { isRouteFSTraced: true }
    // @ts-ignore
    const routes: RouteConfig[] = [
      ...getPortalRoutes(),

      {
        path: '/deployments',
        component: StackDeploymentsRoute,
        title: 'Deployments',
      },
      {
        path: '/deployments/create',
        component: CreateStackDeploymentRoute,
        title: 'Create Deployment',
      },

      ...getStackDeploymentRoutes(),
      ...getDeploymentFeaturesRoutes(),
      ...getUserSettingsRoutes(),
      ...getAccountRoutes(),

      { path: '/support', component: Support, title: 'Support' },
      { path: '/access-denied', component: AccessDenied },
    ]

    return routes.map((route) => ({
      ...route,
      props,
    }))
  }

  function getLoggedInRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [...getTrackedLoggedInRoutes()]

    return routes.map(withRouteChain(RootHandler))
  }

  function getDeploymentFeaturesRoutes(): RouteConfig[] {
    const featureRoutes: RouteConfig[] = [
      {
        path: '/deployment-features',
        component: DeploymentFeatures,
        title: 'Deployment features',
      },
      { path: '/deployment-features/keys', component: UserApiKeys, title: 'API keys' },
      ...getExtensionsRoutes(),
    ]

    if (isFeatureActivated(state, Feature.trafficFiltering)) {
      featureRoutes.push({
        path: '/deployment-features/traffic-filters',
        // @ts-ignore
        component: ManageTrafficFilters,
        title: 'Traffic filters',
      })
    }

    if (isFeatureActivated(state, Feature.crossEnvCCSCCR)) {
      featureRoutes.push({
        path: '/deployment-features/trust-management',
        component: TrustManagement,
        title: 'Trust management',
      })
    }

    return featureRoutes
  }

  function getPortalRoutes(): RouteConfig[] {
    if (!isPortalFeatureEnabled) {
      return []
    }

    return [
      {
        path: '/home',
        component: PortalLandingPage,
        props: { isRouteFSTraced: true },
        title: null,
      },
      {
        path: '/user/settings',
        component: UserAccountSettings,
        title: 'User Settings',
      },
      {
        path: '/account/usage',
        component: Account,
        props: { isRouteFSTraced: true },
        title: 'Account Usage',
      },
      {
        path: '/account/billing',
        component: Account,
        props: { isRouteFSTraced: true },
        title: 'Billing',
      },
      {
        path: '/account/billing-history',
        component: Account,
        props: { isRouteFSTraced: true },
        title: 'BillingHistory',
      },
      {
        path: '/account/contacts',
        component: Account,
        props: { isRouteFSTraced: true },
        title: 'Contacts',
      },
    ]
  }

  function getStackDeploymentRoutes(): RouteConfig[] {
    const deploymentRoutes: RouteConfig[] = [
      {
        path: '/deployments/:deploymentId',
        component: DeploymentOverview,
        title: getDeploymentOverviewTitle,
      },
      {
        path: '/deployments/:deploymentId/getting-started',
        component: DeploymentGettingStarted,
        title: getDeploymentOverviewTitle,
      },
      {
        path: '/deployments/:deploymentId/edit',
        component: EditStackDeploymentRoute,
        title: 'Edit deployment',
      },
      {
        path: '/deployments/:deploymentId/:sliderInstanceType(elasticsearch)',
        component: ClusterOverview,
        title: 'Manage Elasticsearch',
      },
      {
        path: '/deployments/:deploymentId/elasticsearch/console',
        component: ClusterConsole,
        title: 'Deployment console',
      },
      {
        path: '/deployments/:deploymentId/logs-metrics',
        component: LogsMetrics,
        title: 'Logs and metrics',
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

      ...getStackDeploymentSliderRoutes(),

      {
        path: '/deployments/:deploymentId/activity',
        component: StackDeploymentActivityRoute,
        title: 'Deployment Activity',
      },

      ...getSupportedSliderInstanceTypes().map((sliderInstanceType) => ({
        path: `/deployments/:deploymentId/activity/${sliderInstanceType}`,
        component: StackDeploymentActivityRoute,
        title: formatMessage(messages.deploymentActivityPageSlider, {
          name: formatMessage(getSliderPrettyName({ sliderInstanceType })),
        }),
      })),

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
        title: 'Index Curation',
      },
      {
        path: '/deployments/:deploymentId/migrate-to-index-lifecycle-management',
        component: IlmMigration,
        title: 'Migrate to Index Lifecycle Management',
      },
    ]

    return [
      {
        path: '/deployments/resolve/cluster/:regionId/:deploymentId',
        component: EsClusterRedirect,
      },
      {
        path: '/deployments/resolve/cluster/:regionId/:deploymentId/**',
        component: EsClusterRedirect,
      },

      ...deploymentRoutes.map(withRouteChain(Deployment)),
    ]

    function getStackDeploymentSliderRoutes(): RouteConfig[] {
      return getSupportedSliderInstanceTypesWithoutEs().map((sliderInstanceType) => {
        const route: RouteConfig = {
          path: `/deployments/:deploymentId/:sliderInstanceType(${sliderInstanceType})`,
          title: formatMessage(messages.sliderManagePageTitle, {
            name: formatMessage(getSliderPrettyName({ sliderInstanceType })),
          }),
          component: StackDeploymentSlider,
        }

        return route
      })
    }
  }

  function getExtensionsRoutes(): RouteConfig[] {
    const routes: RouteConfig[] = [
      {
        path: '/deployment-features/extensions',
        component: DeploymentExtensions,
        title: 'Deployment extensions',
      },
      {
        path: '/deployment-features/extensions/create',
        component: DeploymentExtensionCreate,
        title: 'Create deployment extension',
      },
      {
        path: '/deployment-features/extensions/:extensionId/edit',
        component: DeploymentExtensionEdit,
        title: 'Deployment extension (:extensionId)',
      },
    ]

    return routes.map(withRouteChain(DeploymentExtensionsGate))
  }

  function getUserSettingsRoutes(): RouteConfig[] {
    if (!hasUserSettings(state) || isPortalFeatureEnabled) {
      return []
    }

    return [
      {
        path: '/settings',
        component: UserSettings,
        title: 'User settings',
      },
    ]
  }

  function getAccountRoutes(): RouteConfig[] {
    // @ts-ignore
    return [
      ...getRoutesWhenPortalFlagIsOff(),
      ...getRoutesWhenPortalFlagIsOffAndNotHidingBecauseEssp(),
    ]

    function getRoutesWhenPortalFlagIsOff() {
      if (isPortalFeatureEnabled) {
        return []
      }

      return [
        {
          path: '/account/profile',
          component: AccountDetails,
          title: 'Account Profile',
        },
      ]
    }

    function getRoutesWhenPortalFlagIsOffAndNotHidingBecauseEssp() {
      if (!showSecurityPage || isPortalFeatureEnabled) {
        return []
      }

      return [
        {
          path: '/account/security',
          component: AccountSecurity,
          title: 'Account Security',
        },
      ]
    }
  }
}

function getDeploymentOverviewTitle({ match: { params } }): string {
  const { deploymentId } = params
  const shortId = deploymentId.substr(0, 6)

  return `[${shortId}] Overview`
}
