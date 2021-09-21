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

import React, { Component, ReactNode, ReactElement } from 'react'
import { injectIntl, IntlShape } from 'react-intl'
import { RouteConfig } from 'react-router-config'
import { RouteComponentProps, NavLink } from 'react-router-dom'
import { UnregisterCallback } from 'history'
import { get, isArray } from 'lodash'

import {
  // @ts-ignore
  EuiSideNav,
} from '@elastic/eui'

import { getRouteParams, matchRoute } from '../../../../lib/router'

import history from '../../../../lib/history'
import { getHerokuCluster } from '../../../../lib/heroku'
import { isCurationEnabled } from '../../../../lib/curation'

import {
  getDisplayName,
  getVersion,
  isSliderSupportedForDeployment,
} from '../../../../lib/stackDeployments'
import {
  getSliderPrettyName,
  getSupportedSliderInstanceTypesWithoutEs,
} from '../../../../lib/sliders'

import {
  clusterSnapshotUrl,
  createDeploymentUrl,
  deploymentExtensionCreateUrl,
  deploymentExtensionsUrl,
  deploymentExtensionUrl,
  deploymentsUrl,
  deploymentUrl,
  deploymentUrls,
  deploymentFeaturesUrl,
  supportUrl,
  rootUrl,
  logsMonitoringUrl,
} from '../../../../lib/urlBuilder'

import {
  apiKeysUrl,
  trafficFiltersUrl,
  accountDetailsUrl,
  accountSecurityUrl,
  trustManagementUrl,
} from '../../urls'

import { isPortalUrl } from '../../../../lib/portal'
import { hasPermission } from '../../../../lib/requiresPermission'

import { isFeatureActivated } from '../../../../store'

import messages from './navigationMessages'

import Feature from '../../../../lib/feature'
import Permission from '../../../../lib/api/v1/permissions'

import { ElasticsearchCluster, ProfileState } from '../../../../types'

import {
  SaasUserResponse,
  DeploymentGetResponse,
  DeploymentTemplateInfoV2,
} from '../../../../lib/api/v1/types'

import '../../../../components/ChromeNavigation/chromeNavigation.scss'

type RouteParams = {
  regionId: string
  deploymentId: string
  snapshotName: string
  extensionId: string
}

type SideNavItem = {
  id?: string
  name: string
  href?: string
  isSelected?: boolean
  items?: EuiSideNavItem[]
  isActive?: () => boolean
  ['data-test-id']?: string
}

type EuiSideNavItem = SideNavItem & {
  id: string
  forceOpen: boolean
}

type RenderNavLinkProps = {
  href?: string
  children: ReactNode
  className?: string
  exact?: boolean
  beta?: boolean
}

export type Props = {
  intl: IntlShape
  routes: RouteConfig[]
  location: RouteComponentProps['location']
  deployment?: ElasticsearchCluster
  deploymentTemplate?: DeploymentTemplateInfoV2
  defaultRegionId?: string
  regionId?: string
  deploymentId?: string
  stackDeploymentId?: string
  stackDeployment?: DeploymentGetResponse
  profile?: ProfileState
  fetchDeploymentTemplates: (params: { regionId: string; stackVersion: string }) => void
  saasUserProfile?: SaasUserResponse
  lookupSaasUsers: boolean
  ipFilteringFeature: boolean
  showApiKeys: boolean
  isHeroku: boolean
  isPortalFeatureEnabled: boolean
  showHelpPage: boolean
  showSecurityPage: boolean
}

type State = {
  isSideNavOpenOnMobile: boolean
}

class UserconsoleChromeNavigation extends Component<Props, State> {
  state: State = {
    isSideNavOpenOnMobile: false,
  }

  clearOnNavigateHook: UnregisterCallback | null = null

  componentDidMount() {
    const deploymentActive = isDeploymentActive(this.props)

    if (deploymentActive) {
      this.fetchDeploymentTemplatesWithStackVersion()
    }

    this.clearOnNavigateHook = history.listen(this.onNavigate)
  }

  componentDidUpdate(prevProps) {
    const prevDeploymentVersion = get(prevProps.deployment, [`plan`, `version`], null)
    const deploymentVersion = get(this.props.deployment, [`plan`, `version`], null)
    const isActive = isDeploymentActive(this.props)

    if (!isActive) {
      return
    }

    const wasActive = isDeploymentActive(prevProps)

    if (
      !wasActive ||
      get(prevProps, [`deployment`, `id`]) !== get(this.props, [`deployment`, `id`]) ||
      deploymentVersion !== prevDeploymentVersion
    ) {
      this.fetchDeploymentTemplatesWithStackVersion()
    }
  }

  componentWillUnmount() {
    if (this.clearOnNavigateHook) {
      this.clearOnNavigateHook()
      this.clearOnNavigateHook = null
    }
  }

  render() {
    const {
      location,
      intl: { formatMessage },
      routes,
      showHelpPage,
      isHeroku,
    } = this.props

    const params = getRouteParams<RouteParams>(routes, location.pathname)

    const { snapshotName } = params

    const deploymentsActive = isDeploymentActive(this.props)
    const createDeploymentActive = isCreateDeploymentActive(this.props)
    const deploymentFeaturesActive = isDeploymentFeaturesActive(this.props)

    const createDeploymentItem = createDeploymentActive
      ? [
          createItem({
            name: formatMessage(messages.createDeployment),
            href: createDeploymentUrl(),
            [`data-test-id`]: `deployment-section-create-deployment-link`,
          }),
        ]
      : undefined

    const deploymentItems = deploymentsActive
      ? this.deploymentNavigation({
          location,
          snapshotName,
        })
      : createDeploymentItem

    const deploymentFeatureItems = deploymentFeaturesActive
      ? this.deploymentFeaturesNavigation()
      : []
    const accountItems = this.accountNavigation()

    const euiSideNavItems: EuiSideNavItem[] = []

    if (isHeroku) {
      const herokuCluster = getHerokuCluster()

      if (herokuCluster) {
        euiSideNavItems.push(
          ...this.deploymentNavigation({
            location,
            snapshotName,
          }),
        )
      }
    } else {
      euiSideNavItems.push(
        createItem({
          name: formatMessage(messages.deployments),
          href: deploymentsUrl(),
          items: deploymentItems,
          [`data-test-id`]: `deployment-section-link`,
        }),
      )
    }

    if (!isHeroku) {
      euiSideNavItems.push(
        createItem({
          name: formatMessage(messages.deploymentFeatures),
          href: deploymentFeaturesUrl(),
          items: deploymentFeatureItems,
          [`data-test-id`]: `deployment-features-index-link`,
        }),
      )

      accountItems.forEach((item) => {
        euiSideNavItems.push(item)
      })
    }

    if (showHelpPage) {
      euiSideNavItems.push(
        createItem({
          name: formatMessage(messages.support),
          href: supportUrl(),
        }),
      )
    }

    const isNavItemSelected = (item) => {
      if (!item.href) {
        return false
      }

      return matchRoute(routes, location.pathname, item.href)
    }

    const euiSideNavItemsWithSelectedItem = setSelectedItem(euiSideNavItems, isNavItemSelected)

    return (
      <EuiSideNav
        mobileTitle={formatMessage(messages.mobileTitle)}
        isOpenOnMobile={this.state.isSideNavOpenOnMobile}
        toggleOpenOnMobile={this.toggleOpenOnMobile}
        items={euiSideNavItemsWithSelectedItem}
        renderItem={renderNavLink}
        className='cloud-navigation'
      />
    )
  }

  toggleOpenOnMobile = () => {
    this.setState({
      isSideNavOpenOnMobile: !this.state.isSideNavOpenOnMobile,
    })
  }

  onNavigate = (location) => {
    if (!isPortalUrl(location.pathname) && location.pathname !== rootUrl()) {
      this.setState({
        isSideNavOpenOnMobile: false,
      })
    }
  }

  fetchDeploymentTemplatesWithStackVersion = () => {
    const { regionId, deployment, fetchDeploymentTemplates } = this.props
    const stackVersion = get(deployment, [`plan`, `version`])

    if (regionId == null) {
      return // avoid loading templates without region
    }

    if (stackVersion == null) {
      return // avoid loading templates without version qualification
    }

    fetchDeploymentTemplates({ regionId, stackVersion })
  }

  deploymentNavigation({ location, snapshotName }) {
    const {
      deployment,
      deploymentTemplate,
      stackDeploymentId,
      stackDeployment,
      intl: { formatMessage },
    } = this.props

    const id = stackDeploymentId!
    const urls = deploymentUrls(id)
    const version = stackDeployment ? getVersion({ deployment: stackDeployment }) : undefined

    const logsItem = createItem({
      name: formatMessage(messages.loggingMonitoring),
      href: logsMonitoringUrl(id),
      [`data-test-id`]: `deployment-index-logging-monitoring-link`,
    })

    const elasticsearchSubItems = [
      createItem({
        name: formatMessage(messages.clusterSnapshots),
        href: urls.snapshots,
        [`data-test-id`]: `deployment-index-elasticsearch-snapshots-link`,
        items: snapshotName
          ? [
              createItem({
                name: snapshotName,
                href: clusterSnapshotUrl(id, snapshotName),
              }),
            ]
          : undefined,
      }),
      createItem({
        name: formatMessage(messages.clusterConsole),
        href: urls.console,
        'data-test-id': `deployment-console-link`,
      }),
    ]

    const editItem = createItem({
      name: formatMessage(messages.deploymentEdit),
      href: urls.edit,
      'data-test-id': `deployment-edit-link`,
    })

    const elasticsearchItems = createItem({
      name: formatMessage(messages.deploymentElasticsearch),
      href: urls.elasticsearch,
      'data-test-id': `deployment-index-elasticsearch-overview-link`,
      items: elasticsearchSubItems,
    })

    const sliderItems = getSupportedSliderInstanceTypesWithoutEs()
      .filter((sliderInstanceType) =>
        isSliderSupportedForDeployment({
          deployment: stackDeployment || undefined,
          deploymentTemplate: deploymentTemplate?.deployment_template,
          sliderInstanceType,
        }),
      )
      .map((sliderInstanceType) =>
        createItem({
          name: formatMessage(getSliderPrettyName({ sliderInstanceType, version })),
          href: urls[sliderInstanceType],
          'data-test-id': `deployment-index-${sliderInstanceType}-overview-link`,
        }),
      )

    const activityItem = createItem({
      name: formatMessage(messages.deploymentActivity),
      href: urls.deploymentActivity,
      'data-test-id': `deployment-index-activity-link`,
      isSelected: location.pathname.startsWith(urls.deploymentActivity),
    })

    const securityItem = createItem({
      name: formatMessage(messages.deploymentSecurity),
      href: urls.security,
      [`data-test-id`]: `deployment-index-elasticsearch-security-link`,
    })

    const metricsItem = createItem({
      name: formatMessage(messages.deploymentMetrics),
      href: urls.metrics,
      'data-test-id': `deployment-index-elasticsearch-metrics-link`,
    })

    const deploymentItems = [
      editItem,
      elasticsearchItems,
      ...sliderItems,
      logsItem,
      activityItem,
      securityItem,
    ]

    const curationEnabled = deployment && isCurationEnabled(deployment)

    if (curationEnabled) {
      deploymentItems.push(
        createItem({
          name: formatMessage(messages.indexCurationSettings),
          href: urls.indexManagement,
          'data-test-id': `deployment-index-elasticsearch-operations-link`,
        }),
      )
    }

    deploymentItems.push(metricsItem)

    return [
      createItem({
        name: getDeploymentName(),
        href: urls.root,
        'data-test-id': `deployment-index-overview-link`,
        id: `deployment-index-overview-link`,
        items: deploymentItems,
      }),
    ]

    function getDeploymentName() {
      if (stackDeployment) {
        return getDisplayName({ deployment: stackDeployment })
      }

      if (stackDeploymentId) {
        return stackDeploymentId.slice(0, 6)
      }

      if (deployment) {
        return deployment.displayName
      }

      return id.slice(0, 6)
    }
  }

  accountNavigation() {
    const {
      intl: { formatMessage },
      showSecurityPage,
      isPortalFeatureEnabled,
    } = this.props

    const accountNavigationItems: EuiSideNavItem[] = []

    if (!isPortalFeatureEnabled) {
      accountNavigationItems.push(
        createItem({
          name: formatMessage(messages.accountProfile),
          href: accountDetailsUrl(),
          [`data-test-id`]: `account-index-details-link`,
        }),
      )

      if (showSecurityPage) {
        accountNavigationItems.push(
          createItem({
            name: formatMessage(messages.accountSecurity),
            href: accountSecurityUrl(),
            [`data-test-id`]: `account-index-security-link`,
          }),
        )
      }
    }

    return accountNavigationItems
  }

  deploymentFeaturesNavigation() {
    const {
      location,
      intl: { formatMessage },
      profile,
      showApiKeys,
      routes,
    } = this.props
    const params = getRouteParams<RouteParams>(routes, location.pathname)
    const featuresNavigationItems: EuiSideNavItem[] = []
    const { extensionId } = params
    const creatingExtension = isDeploymentExtensionCreateActive(this.props)
    const editingExtension = isDeploymentExtensionEditActive(this.props)

    if (hasPermission(Permission.getApiKeys) && showApiKeys) {
      featuresNavigationItems.push(
        createItem({
          name: formatMessage(messages.accountApiKeys),
          href: apiKeysUrl(),
          [`data-test-id`]: `deployment-features-index-api-keys-link`,
        }),
      )
    }

    if (isFeatureActivated(Feature.trafficFiltering)) {
      featuresNavigationItems.push(
        createItem({
          name: formatMessage(messages.accountTrafficFilters),
          href: trafficFiltersUrl(),
          [`data-test-id`]: `deployment-features-index-traffic-filters-link`,
        }),
      )
    }

    if (isFeatureActivated(Feature.crossEnvCCSCCR)) {
      featuresNavigationItems.push(
        createItem({
          name: formatMessage(messages.trustManagement),
          href: trustManagementUrl(),
          [`data-test-id`]: `deployment-features-index-trust-management-link`,
        }),
      )
    }

    if (profile && (profile.allow_bundles || profile.allow_plugins)) {
      const deploymentExtensionsItems = [
        ...(editingExtension
          ? [
              createItem({
                name: extensionId!,
                href: deploymentExtensionUrl(extensionId!),
                [`data-test-id`]: `deployment-features-deployment-edit-extensions-link`,
              }),
            ]
          : []),
        ...(creatingExtension
          ? [
              createItem({
                name: formatMessage(messages.createExtension),
                href: deploymentExtensionCreateUrl(),
                [`data-test-id`]: `deployment-features-deployment-create-extensions-link`,
              }),
            ]
          : []),
      ]

      featuresNavigationItems.push(
        createItem({
          name: formatMessage(messages.extensionsOverview),
          href: deploymentExtensionsUrl(),
          items: deploymentExtensionsItems,
          [`data-test-id`]: `deployment-features-deployment-extensions-link`,
        }),
      )
    }

    return featuresNavigationItems
  }
}

export default injectIntl(UserconsoleChromeNavigation)

function renderNavLink({
  href = `/`,
  children,
  exact = false,
  ...rest
}: RenderNavLinkProps): ReactElement {
  return (
    <NavLink to={href} exact={exact} activeClassName='euiSideNavItemButton-isSelected' {...rest}>
      {children}
    </NavLink>
  )
}

function createItem({ name, items, ...rest }: SideNavItem): EuiSideNavItem {
  return {
    name,
    id: name,
    items,
    forceOpen: true,
    ...rest,
  }
}

function setSelectedItem(
  items: EuiSideNavItem[],
  isSelected: (item: EuiSideNavItem) => boolean,
): EuiSideNavItem[] {
  return items.map(handleItemSelection)

  function handleItemSelection(item: EuiSideNavItem): EuiSideNavItem {
    if (isSelected(item)) {
      return {
        ...item,
        isSelected: true,
      }
    } else if (isArray(item.items)) {
      return {
        ...item,
        items: setSelectedItem(item.items, isSelected),
      }
    }

    return item
  }
}

function isDeploymentActive({ routes, location, deployment = { wasDeleted: false } }) {
  return (
    matchRoute(routes, location.pathname, deploymentUrl(`:deploymentId`), {
      exact: false,
    }) && !deployment.wasDeleted
  )
}

function isCreateDeploymentActive({ routes, location }) {
  return matchRoute(routes, location.pathname, createDeploymentUrl())
}

function isDeploymentExtensionEditActive({ routes, location }) {
  return matchRoute(routes, location.pathname, deploymentExtensionUrl(`:extensionId`))
}

function isDeploymentExtensionCreateActive({ routes, location }) {
  return matchRoute(routes, location.pathname, deploymentExtensionCreateUrl())
}

function isDeploymentFeaturesActive({ routes, location }) {
  return matchRoute(routes, location.pathname, deploymentFeaturesUrl(), { exact: false })
}
