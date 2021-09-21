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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  activityFeedUrl,
  addActiveDirectoryAuthenticationProviderUrl,
  addLdapAuthenticationProviderUrl,
  addSamlAuthenticationProviderUrl,
  adminconsoleOverviewUrl,
  adminconsolesUrl,
  apiKeysUrl,
  authenticationProvidersUrl,
  clusterApiConsoleUrl,
  clusterSnapshotsUrl,
  clusterSnapshotUrl,
  constructorsUrl,
  containerSetsUrl,
  containerSetUrl,
  containerUrl,
  createDeploymentUrl,
  createSnapshotRepositoryUrl,
  createTopologyClusterTemplateUrl,
  createTopologyNodeConfigurationUrl,
  deploymentActivityUrl,
  deploymentEditUrl,
  deploymentExtensionCreateUrl,
  deploymentExtensionsUrl,
  deploymentExtensionUrl,
  deploymentFeaturesUrl,
  deploymentIlmMigrationUrl,
  deploymentsUrl,
  deploymentUrl,
  editActiveDirectoryAuthenticationProviderUrl,
  editLdapAuthenticationProviderUrl,
  editSamlAuthenticationProviderUrl,
  editSnapshotRepositoryUrl,
  elasticStackVersionsUrl,
  elasticStackVersionUrl,
  heapDumpsUrl,
  hostAllocatorUrl,
  hostControlPlaneUrl,
  hostProxyUrl,
  hostsAllocatorsUrl,
  hostsControlPlanesUrl,
  hostsProxiesUrl,
  hostsUrl,
  hostUrl,
  indexCurationUrl,
  logsMonitoringUrl,
  manageNativeUsersUrl,
  manageRegionUrl,
  notFoundUrl,
  operationsUrl,
  performanceMetricsUrl,
  platformTrustManagementUrl,
  regionSecurityUrl,
  regionSettingsUrl,
  regionsUrl,
  regionUrl,
  securityUrl,
  sliderActivityUrl,
  sliderUrl,
  snapshotRepositoriesUrl,
  supportUrl,
  topologyDeploymentTemplatesUrl,
  topologyEditDeploymentTemplateUrl,
  topologyEditInstanceConfigurationUrl,
  topologyInstanceConfigurationsUrl,
  topologyUrl,
  topologyViewDeploymentTemplateUrl,
  topologyViewInstanceConfigurationUrl,
  userCreateUrl,
  userOverviewUrl,
  userSettingsUrl,
  usersUrl,
  deploymentGettingStartedUrl,
} from './urlBuilder'

import {
  accountUrl,
  accountCostAnalysisUrl,
  accountActivityUrl,
  accountContactsUrl,
  accountDetailsUrl,
  accountBillingUrl,
  accountBillingHistoryUrl,
  trafficFiltersUrl,
  trustManagementUrl,
} from '../apps/userconsole/urls'

import { getSliderPrettyName } from './sliders'

import { getConfigForKey, isFeatureActivated } from '../store'

import Feature from './feature'

import { RoutableBreadcrumb, SliderInstanceType, VersionNumber } from '../types'
import { portalCrumbs, rootPortalCrumbs, rootEssCloudCrumbs } from './portalCrumbBuilder'

const rootEceCrumbs = (): RoutableBreadcrumb[] => [
  {
    text: (
      <FormattedMessage
        id='crumb-builder.admin-console-ece'
        defaultMessage='Elastic Cloud Enterprise'
      />
    ),
  },
]

const rootEssCrumbs = (): RoutableBreadcrumb[] => [
  {
    text: (
      <FormattedMessage id='crumb-builder.admin-console' defaultMessage='Elasticsearch Service' />
    ),
  },
]

export const userSettingsCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: userSettingsUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.portal-user-settings.crumb'
        defaultMessage='User profile'
      />
    ),
  },
]

export const activityFeedCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: activityFeedUrl(),
    text: (
      <FormattedMessage id='crumb-builder.activity-feed-crumbs' defaultMessage='Activity feed' />
    ),
  },
]

export const platformCrumbs = (): RoutableBreadcrumb[] => {
  const defaultRegionId = getConfigForKey(`DEFAULT_REGION`)

  return [
    {
      to: defaultRegionId ? regionUrl(defaultRegionId) : regionsUrl(),
      text: <FormattedMessage id='crumb-builder.regions-crumbs' defaultMessage='Platform' />,
    },
  ]
}

export const regionCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => {
  const shouldShowRegion = isFeatureActivated(Feature.regionNames)
  const crumbs: RoutableBreadcrumb[] = [...platformCrumbs()]

  if (shouldShowRegion) {
    crumbs.push({
      to: regionUrl(regionId),
      text: regionId,
    })
  }

  return crumbs
}

export const deploymentsCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: deploymentsUrl(),
    text: <FormattedMessage id='crumb-builder.deployments-crumbs' defaultMessage='Deployments' />,
  },
]

export const deploymentCreateCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentsCrumbs(),

  {
    to: createDeploymentUrl(),
    text: <FormattedMessage id='crumb-builder.deployment-create-crumbs' defaultMessage='Create' />,
  },
]

export const deploymentNotFoundCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentsCrumbs(),

  {
    to: notFoundUrl(),
    text: (
      <FormattedMessage id='crumb-builder.deployment-not-found-crumbs' defaultMessage='Not found' />
    ),
  },
]

export const deploymentExtensionsCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentFeaturesCrumbs(),

  {
    to: deploymentExtensionsUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-extensions-crumbs'
        defaultMessage='Extensions'
      />
    ),
  },
]

export const extensionCreateCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentExtensionsCrumbs(),

  {
    to: deploymentExtensionCreateUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-extension-create-crumbs'
        defaultMessage='Create'
      />
    ),
  },
]

export const deploymentExtensionCrumbs = ({
  extensionId,
}: {
  extensionId: string
}): RoutableBreadcrumb[] => [
  ...deploymentExtensionsCrumbs(),

  {
    to: deploymentExtensionUrl(extensionId),
    text: extensionId,
  },
]

export const accountCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: accountUrl(),
    text: <FormattedMessage id='crumb-builder.account-crumbs' defaultMessage='Account' />,
  },
]

export const deploymentFeaturesCrumbs = (): RoutableBreadcrumb[] => {
  const appName = getConfigForKey(`APP_NAME`)

  if (appName === 'adminconsole') {
    return []
  }

  return [
    {
      to: deploymentFeaturesUrl(),
      text: (
        <FormattedMessage id='crumb-builder.deployment-features-crumbs' defaultMessage='Features' />
      ),
    },
  ]
}

export const costAnalysisCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: accountCostAnalysisUrl(),
    text: <FormattedMessage id='crumb-builder.cost-analysis-crumbs' defaultMessage='Usage' />,
  },
]

export const accountActivityCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: accountActivityUrl(),
    text: <FormattedMessage id='crumb-builder.account-activity-crumbs' defaultMessage='Activity' />,
  },
]

export const accountBillingCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: accountBillingUrl(),
    text: <FormattedMessage id='crumb-builder.account-billing-crumbs' defaultMessage='Overview' />,
  },
]

export const accountBillingHistoryCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: accountBillingHistoryUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.account-billing-history-crumbs'
        defaultMessage='Billing history'
      />
    ),
  },
]

export const accountContactsCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  isFeatureActivated(Feature.cloudPortalEnabled)
    ? {
        to: accountContactsUrl(),
        text: (
          <FormattedMessage id='crumb-builder.account-contacts-crumbs' defaultMessage='Contacts' />
        ),
      }
    : {
        to: accountDetailsUrl(),
        text: (
          <FormattedMessage id='crumb-builder.account-profile-crumbs' defaultMessage='Profile' />
        ),
      },
]

export const accountApiKeysManagementCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: apiKeysUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.account-api-key-management-crumbs'
        defaultMessage='API key management'
      />
    ),
  },
]

export const apiKeysCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentFeaturesCrumbs(),

  {
    to: apiKeysUrl(),
    text: <FormattedMessage id='crumb-builder.account-api-keys-crumbs' defaultMessage='API keys' />,
  },
]

export const trafficFiltersCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentFeaturesCrumbs(),

  {
    to: trafficFiltersUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.account-traffic-filters-crumbs'
        defaultMessage='Traffic filters'
      />
    ),
  },
]

export const trustManagementCrumbs = (): RoutableBreadcrumb[] => [
  ...deploymentFeaturesCrumbs(),

  {
    to: trustManagementUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.trust-management-crumbs'
        defaultMessage='Trust management'
      />
    ),
  },
]

export const accountSecurityCrumbs = (): RoutableBreadcrumb[] => [
  ...accountCrumbs(),

  {
    to: accountBillingUrl(),
    text: (
      <FormattedMessage
        id='crumb-builder.account-security-crumbs'
        defaultMessage='Account Security'
      />
    ),
  },
]

export const supportCrumbs = (): RoutableBreadcrumb[] => [
  {
    to: supportUrl(),
    text: <FormattedMessage id='crumb-builder.help-crumbs' defaultMessage='Support' />,
  },
]

export const deploymentOverviewCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentsCrumbs(),

  {
    to: deploymentUrl(deploymentId),
    text: deploymentDisplayName || deploymentId.slice(0, 7),
  },
]

export const deploymentEditCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: deploymentEditUrl(deploymentId),
    text: <FormattedMessage id='crumb-builder.deployment-edit-crumbs' defaultMessage='Edit' />,
  },
]

export const deploymentEditAdvancedCrumbs = ({
  deploymentId,
}: {
  deploymentId: string
}): RoutableBreadcrumb[] => [
  ...deploymentEditCrumbs({ deploymentId }),

  {
    to: deploymentEditUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-edit-advanced-crumbs'
        defaultMessage='Advanced'
      />
    ),
  },
]

export const deploymentLogsCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),
  {
    to: logsMonitoringUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-logs-crumbs'
        defaultMessage='Logs and metrics'
      />
    ),
  },
]

export const deploymentSnapshotsCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentSliderCrumbs({
    deploymentId,
    sliderInstanceType: `elasticsearch`,
    deploymentDisplayName,
  }),

  {
    to: clusterSnapshotsUrl(deploymentId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-snapshots-crumbs' defaultMessage='Snapshots' />
    ),
  },
]

export const deploymentSnapshotCrumbs = ({
  deploymentId,
  snapshotName,
  deploymentDisplayName,
}: {
  deploymentId: string
  snapshotName: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentSnapshotsCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: clusterSnapshotUrl(deploymentId, snapshotName),
    text: snapshotName,
  },
]

export const deploymentHeapDumpsCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOperationsCrumbs({
    deploymentId,
    deploymentDisplayName,
  }),

  {
    to: heapDumpsUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-heap-dumps-crumbs'
        defaultMessage='Heap dumps'
      />
    ),
  },
]

export const deploymentMetricsCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: performanceMetricsUrl(deploymentId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-metrics-crumbs' defaultMessage='Performance' />
    ),
  },
]

export const deploymentIndexCurationCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: indexCurationUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-index-curation-crumbs'
        defaultMessage='Index curation'
      />
    ),
  },
]

export const deploymentIlmMigrationCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: deploymentIlmMigrationUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-ilm-migration-crumbs'
        defaultMessage='Migrate to ILM'
      />
    ),
  },
]

export const deploymentApiConsoleCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentSliderCrumbs({
    deploymentId,
    sliderInstanceType: `elasticsearch`,
    deploymentDisplayName,
  }),

  {
    to: clusterApiConsoleUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-api-console-crumbs'
        defaultMessage='API console'
      />
    ),
  },
]

export const deploymentActivityCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: deploymentActivityUrl(deploymentId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-activity-crumbs' defaultMessage='Activity' />
    ),
  },
]

export const deploymentSliderCrumbs = ({
  deploymentId,
  deploymentDisplayName,
  sliderInstanceType,
  version,
}: {
  deploymentId: string
  deploymentDisplayName?: string
  sliderInstanceType: SliderInstanceType
  version?: VersionNumber | null
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: sliderUrl(deploymentId, sliderInstanceType),
    text: <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />,
  },
]

export const deploymentActivitySliderCrumbs = ({
  deploymentId,
  sliderInstanceType,
  deploymentDisplayName,
  version,
}: {
  deploymentId: string
  sliderInstanceType: SliderInstanceType
  deploymentDisplayName?: string
  version?: VersionNumber | null
}): RoutableBreadcrumb[] => [
  ...deploymentActivityCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: sliderActivityUrl(deploymentId, sliderInstanceType),
    text: <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />,
  },
]

export const deploymentSecurityCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: securityUrl(deploymentId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-security-crumbs' defaultMessage='Security' />
    ),
  },
]

export const deploymentOperationsCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: operationsUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-operations-crumbs'
        defaultMessage='Operations'
      />
    ),
  },
]

export const deploymentGettingStartedCrumbs = ({
  deploymentId,
  deploymentDisplayName,
}: {
  deploymentId: string
  deploymentDisplayName?: string
}): RoutableBreadcrumb[] => [
  ...deploymentOverviewCrumbs({ deploymentId, deploymentDisplayName }),

  {
    to: deploymentGettingStartedUrl(deploymentId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-getting-started-crumbs'
        defaultMessage='Create'
      />
    ),
  },
]

export const hostsCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: hostsUrl(regionId),
    text: <FormattedMessage id='crumb-builder.hosts-crumbs' defaultMessage='Hosts' />,
  },
]

export const hostsAllocatorsCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...hostsCrumbs({ regionId }),

  {
    to: hostsAllocatorsUrl(regionId),
    text: (
      <FormattedMessage id='crumb-builder.hosts-allocators-crumbs' defaultMessage='Allocators' />
    ),
  },
]

export const hostsProxiesCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...hostsCrumbs({ regionId }),

  {
    to: hostsProxiesUrl(regionId),
    text: <FormattedMessage id='crumb-builder.hosts-proxies-crumbs' defaultMessage='Proxies' />,
  },
]

export const hostsControlPlanesCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...hostsCrumbs({ regionId }),

  {
    to: hostsControlPlanesUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.hosts-control-planes-crumbs'
        defaultMessage='Control planes'
      />
    ),
  },
]

export const hostCrumbs = ({
  regionId,
  hostId,
}: {
  regionId: string
  hostId: string
}): RoutableBreadcrumb[] => [
  ...hostsCrumbs({ regionId }),

  {
    to: hostUrl(regionId, hostId),
    text: hostId,
  },
]

export const hostAllocatorCrumbs = ({
  regionId,
  hostId,
}: {
  regionId: string
  hostId: string
}): RoutableBreadcrumb[] => [
  ...hostCrumbs({ regionId, hostId }),

  {
    to: hostAllocatorUrl(regionId, hostId),
    text: <FormattedMessage id='crumb-builder.host-allocator-crumbs' defaultMessage='Allocator' />,
  },
]

export const hostProxyCrumbs = ({
  regionId,
  hostId,
}: {
  regionId: string
  hostId: string
}): RoutableBreadcrumb[] => [
  ...hostCrumbs({ regionId, hostId }),

  {
    to: hostProxyUrl(regionId, hostId),
    text: <FormattedMessage id='crumb-builder.host-proxy-crumbs' defaultMessage='Proxy' />,
  },
]

export const hostControlPlaneCrumbs = ({
  regionId,
  hostId,
}: {
  regionId: string
  hostId: string
}): RoutableBreadcrumb[] => [
  ...hostCrumbs({ regionId, hostId }),

  {
    to: hostControlPlaneUrl(regionId, hostId),
    text: (
      <FormattedMessage id='crumb-builder.control-plane-crumbs' defaultMessage='Control plane' />
    ),
  },
]

export const constructorsCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: constructorsUrl(regionId),
    text: <FormattedMessage id='crumb-builder.constructors-crumbs' defaultMessage='Constructors' />,
  },
]

export const regionSecurityCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: regionSecurityUrl(regionId),
    text: <FormattedMessage id='crumb-builder.region-security-crumbs' defaultMessage='Security' />,
  },
]

export const regionSettingsCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: regionSettingsUrl(regionId),
    text: <FormattedMessage id='crumb-builder.region-settings-crumbs' defaultMessage='Settings' />,
  },
]

export const adminconsolesCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: adminconsolesUrl(regionId),
    text: <FormattedMessage id='crumb-builder.admin-consoles' defaultMessage='Admin consoles' />,
  },
]

export const adminconsoleOverviewCrumbs = ({
  regionId,
  adminconsoleId,
}: {
  regionId: string
  adminconsoleId: string
}): RoutableBreadcrumb[] => [
  ...adminconsolesCrumbs({ regionId }),

  {
    to: adminconsoleOverviewUrl(regionId, adminconsoleId),
    text: adminconsoleId,
  },
]

export const containerSetsCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: containerSetsUrl(regionId),
    text: (
      <FormattedMessage id='crumb-builder.container-sets-crumbs' defaultMessage='Container sets' />
    ),
  },
]

export const containerSetCrumbs = ({
  regionId,
  containerSetId,
}: {
  regionId: string
  containerSetId: string
}): RoutableBreadcrumb[] => [
  ...containerSetsCrumbs({ regionId }),

  {
    to: containerSetUrl(regionId, containerSetId),
    text: containerSetId,
  },
]

export const containerCrumbs = ({
  regionId,
  containerSetId,
  containerId,
}: {
  regionId: string
  containerSetId: string
  containerId: string
}): RoutableBreadcrumb[] => [
  ...containerSetCrumbs({ regionId, containerSetId }),

  {
    text: <FormattedMessage id='crumb-builder.containers-crumbs' defaultMessage='Containers' />,
  },

  {
    to: containerUrl(regionId, containerSetId, containerId),
    text: containerId,
  },
]

export const elasticStackVersionsCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: elasticStackVersionsUrl(regionId),
    text: (
      <FormattedMessage id='crumb-builder.elastic-stack-crumbs' defaultMessage='Elastic Stack' />
    ),
  },
]

export const elasticStackVersionCrumbs = ({
  regionId,
  versionId,
}: {
  regionId: string
  versionId: string
}): RoutableBreadcrumb[] => [
  ...elasticStackVersionsCrumbs({ regionId }),

  {
    to: elasticStackVersionUrl(regionId, versionId),
    text: versionId,
  },
]

export const platformTrustManagementCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: platformTrustManagementUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.platform-trust-management-crumbs'
        defaultMessage='Trust management'
      />
    ),
  },
]

export const snapshotRepositoriesCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: snapshotRepositoriesUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.snapshot-repositories-crumbs'
        defaultMessage='Repositories'
      />
    ),
  },
]

export const createSnapshotRepositoryCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...snapshotRepositoriesCrumbs({ regionId }),

  {
    to: createSnapshotRepositoryUrl(regionId),
    text: (
      <FormattedMessage id='crumb-builder.create-snapshot-repository-crumbs' defaultMessage='New' />
    ),
  },
]

export const editSnapshotRepositoryCrumbs = ({
  regionId,
  repositoryId,
}: {
  regionId: string
  repositoryId: string
}): RoutableBreadcrumb[] => [
  ...snapshotRepositoriesCrumbs({ regionId }),

  {
    to: editSnapshotRepositoryUrl(regionId, repositoryId),
    text: repositoryId,
  },
]

export const topologyCrumbs = ({ regionId }: { regionId: string }): RoutableBreadcrumb[] => [
  ...regionCrumbs({ regionId }),

  {
    to: topologyUrl(regionId),
    text: <FormattedMessage id='crumb-builder.templates-crumbs' defaultMessage='Templates' />,
  },
]

export const topologyDeploymentTemplatesCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...topologyCrumbs({ regionId }),

  {
    to: topologyDeploymentTemplatesUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.deployment-templates-crumbs'
        defaultMessage='Deployments'
      />
    ),
  },
]

export const topologyDeploymentTemplateCreateCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...topologyDeploymentTemplatesCrumbs({ regionId }),

  {
    to: createTopologyClusterTemplateUrl(regionId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-template-create-crumbs' defaultMessage='New' />
    ),
  },
]

export const topologyDeploymentTemplateCrumbs = ({
  regionId,
  templateId,
}: {
  regionId: string
  templateId: string
}): RoutableBreadcrumb[] => [
  ...topologyDeploymentTemplatesCrumbs({ regionId }),

  {
    to: topologyViewDeploymentTemplateUrl(regionId, templateId),
    text: templateId,
  },
]

export const topologyDeploymentTemplateEditCrumbs = ({
  regionId,
  templateId,
}: {
  regionId: string
  templateId: string
}): RoutableBreadcrumb[] => [
  ...topologyDeploymentTemplateCrumbs({ regionId, templateId }),

  {
    to: topologyEditDeploymentTemplateUrl(regionId, templateId),
    text: (
      <FormattedMessage id='crumb-builder.deployment-template-edit-crumbs' defaultMessage='Edit' />
    ),
  },
]

export const topologyInstanceConfigurationsCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...topologyCrumbs({ regionId }),

  {
    to: topologyInstanceConfigurationsUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.instance-configurations-crumbs'
        defaultMessage='Instance configurations'
      />
    ),
  },
]

export const topologyInstanceConfigurationCreateCrumbs = ({
  regionId,
}: {
  regionId: string
}): RoutableBreadcrumb[] => [
  ...topologyInstanceConfigurationsCrumbs({ regionId }),

  {
    to: createTopologyNodeConfigurationUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.instance-configuration-create-crumbs'
        defaultMessage='New'
      />
    ),
  },
]

export const topologyInstanceConfigurationCrumbs = ({
  regionId,
  instanceId,
}: {
  regionId: string
  instanceId: string
}): RoutableBreadcrumb[] => [
  ...topologyInstanceConfigurationsCrumbs({ regionId }),

  {
    to: topologyViewInstanceConfigurationUrl(regionId, instanceId),
    text: instanceId,
  },
]

export const topologyInstanceConfigurationEditCrumbs = ({
  regionId,
  instanceId,
}: {
  regionId: string
  instanceId: string
}): RoutableBreadcrumb[] => [
  ...topologyInstanceConfigurationCrumbs({ regionId, instanceId }),

  {
    to: topologyEditInstanceConfigurationUrl(regionId, instanceId),
    text: (
      <FormattedMessage
        id='crumb-builder.instance-configuration-edit-crumbs'
        defaultMessage='Edit'
      />
    ),
  },
]

export const saasUsersCrumbs = () => [
  {
    to: usersUrl(),
    text: <FormattedMessage id='crumb-builder.customers-crumbs' defaultMessage='Customers' />,
  },
]

export const createSaasUserCrumbs = () => [
  ...saasUsersCrumbs(),

  {
    to: userCreateUrl(),
    text: <FormattedMessage id='crumb-builder.create-customer-crumbs' defaultMessage='Create' />,
  },
]

export const viewSaasUserCrumbs = (userId: string) => [
  ...saasUsersCrumbs(),

  {
    to: userOverviewUrl(userId),
    text: userId,
  },
]

export const manageUsersCrumbs = ({ regionId }: { regionId: string }) => [
  {
    to: manageRegionUrl(regionId),
    text: <FormattedMessage id='crumb-builder.manage-users-crumbs' defaultMessage='Users' />,
  },
]

export const authProvidersCrumbs = ({ regionId }: { regionId: string }) => [
  ...manageUsersCrumbs({ regionId }),

  {
    to: authenticationProvidersUrl(regionId),
    text: (
      <FormattedMessage
        id='crumb-builder.auth-providers-crumbs'
        defaultMessage='Authentication providers'
      />
    ),
  },
]

export const nativeRealmUsersCrumbs = ({ regionId }: { regionId: string }) => [
  ...manageUsersCrumbs({ regionId }),

  {
    to: manageNativeUsersUrl(regionId),
    text: <FormattedMessage id='crumb-builder.native-users-crumbs' defaultMessage='Native users' />,
  },
]

export const adAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...authProvidersCrumbs({ regionId }),

  {
    text: (
      <FormattedMessage id='crumb-builder.ad-auth-providers' defaultMessage='Active Directory' />
    ),
  },
]

export const ldapAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...authProvidersCrumbs({ regionId }),

  {
    text: <FormattedMessage id='crumb-builder.ldap-auth-providers' defaultMessage='LDAP' />,
  },
]

export const samlAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...authProvidersCrumbs({ regionId }),

  {
    text: <FormattedMessage id='crumb-builder.saml-auth-providers' defaultMessage='SAML' />,
  },
]

export const addActiveDirectoryAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...adAuthProviderCrumbs({ regionId }),

  {
    to: addActiveDirectoryAuthenticationProviderUrl(regionId),
    text: <FormattedMessage id='crumb-builder.new-auth-providers' defaultMessage='New' />,
  },
]

export const editActiveDirectoryAuthProviderCrumbs = ({
  regionId,
  realmId,
}: {
  regionId: string
  realmId: string
}) => [
  ...adAuthProviderCrumbs({ regionId }),

  {
    to: editActiveDirectoryAuthenticationProviderUrl(regionId, realmId),
    text: <FormattedMessage id='crumb-builder.edit-auth-provider' defaultMessage='Edit' />,
  },
]

export const addLdapAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...ldapAuthProviderCrumbs({ regionId }),

  {
    to: addLdapAuthenticationProviderUrl(regionId),
    text: <FormattedMessage id='crumb-builder.new-auth-providers' defaultMessage='New' />,
  },
]

export const editLdapAuthProviderCrumbs = ({
  regionId,
  realmId,
}: {
  regionId: string
  realmId: string
}) => [
  ...ldapAuthProviderCrumbs({ regionId }),

  {
    to: editLdapAuthenticationProviderUrl(regionId, realmId),
    text: <FormattedMessage id='crumb-builder.edit-auth-provider' defaultMessage='Edit' />,
  },
]

export const addSamlAuthProviderCrumbs = ({ regionId }: { regionId: string }) => [
  ...samlAuthProviderCrumbs({ regionId }),

  {
    to: addSamlAuthenticationProviderUrl(regionId),
    text: <FormattedMessage id='crumb-builder.new-auth-providers' defaultMessage='New' />,
  },
]

export const editSamlAuthProviderCrumbs = ({
  regionId,
  realmId,
}: {
  regionId: string
  realmId: string
}) => [
  ...samlAuthProviderCrumbs({ regionId }),

  {
    to: editSamlAuthenticationProviderUrl(regionId, realmId),
    text: <FormattedMessage id='crumb-builder.edit-auth-providers' defaultMessage='Edit' />,
  },
]

export function getRootByApp({ linkRoot }: { linkRoot?: boolean }): RoutableBreadcrumb[] {
  const appName = getConfigForKey(`APP_NAME`)
  const appType = getConfigForKey(`CLOUD_UI_APP`)

  if (appName === `userconsole`) {
    if (isFeatureActivated(Feature.cloudPortalEnabled)) {
      return linkRoot ? portalCrumbs() : rootPortalCrumbs()
    }

    return rootEssCloudCrumbs()
  }

  if (appType === `cloud-enterprise-adminconsole`) {
    return rootEceCrumbs()
  }

  return rootEssCrumbs()
}
