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

import { getResourceVersion } from './stackDeployments/selectors/fundamentals'
import { getFirstAvailableSliderClusterFromGet } from './stackDeployments/selectors/available'

import { GetDeepLinkFn, getEndpointForResource } from './serviceProviderEndpoints'
import { lt, satisfies } from './semver'

import { StackDeployment } from '../types'
import { DeploymentTemplateInfoV2, KibanaResourceInfo } from '../lib/api/v1/types'

export function kibanaSecurityManagementUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/security/users`
    }

    return `/app/management/security/users` // 7.9.0+
  }
}

export function kibanaSnapshotAndRestoreUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/elasticsearch/snapshot_restore/snapshots`
    }

    return `/app/management/data/snapshot_restore/snapshots` // 7.9.0+
  }
}

export function kibanaSnapshotPolicyUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/elasticsearch/snapshot_restore/policies`
    }

    return `/app/management/data/snapshot_restore/policies` // 7.9.0+
  }
}

export function kibanaIlmPoliciesUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/elasticsearch/index_lifecycle_management/policies`
    }

    return `/app/management/data/index_lifecycle_management/policies` // 7.9.0+
  }
}

export function kibanaApmTutorialUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/home/tutorial/apm`
    }

    return `/app/home#/tutorial/apm` // 7.9.0+
  }
}

export function kibanaRemoteClustersUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/elasticsearch/remote_clusters`
    }

    return `/app/management/data/remote_clusters` // 7.9.0+
  }
}

export function kibanaUpgradeAssistantUrl({ resource }: { resource: KibanaResourceInfo | null }) {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (kibanaVersion && lt(kibanaVersion, `7.9.0`)) {
      return `/app/kibana#/management/elasticsearch/upgrade_assistant`
    }

    return `/app/management/stack/upgrade_assistant` // 7.9.0+
  }
}

export function kibanaApmAppUrl({
  deployment,
  getDeepLink,
}: {
  deployment: StackDeployment
  getDeepLink?: GetDeepLinkFn
}): string {
  const kibanaResource = getFirstAvailableSliderClusterFromGet({
    deployment,
    sliderInstanceType: `kibana`,
  })

  return getEndpointForResource({
    resource: kibanaResource,
    resourceType: 'kibana',
    getDeepLink: getDeepLink || getDefaultDeepLink,
  })

  function getDefaultDeepLink(): string | null {
    return `/app/apm`
  }
}

export function kibanaGettingStartedUrl({
  resource,
  deploymentTemplate,
}: {
  resource: KibanaResourceInfo | null
  deploymentTemplate: DeploymentTemplateInfoV2
}): string {
  const kibanaVersion = getResourceVersion({ resource })

  return getEndpointForResource({
    resource,
    resourceType: 'kibana',
    getDeepLink,
  })

  function getDeepLink(): string | null {
    if (!deploymentTemplate || !deploymentTemplate.kibana_deeplink || !kibanaVersion) {
      return null
    }

    const deepLinkSatisfyingVersion = deploymentTemplate.kibana_deeplink.find((deepLink) =>
      satisfies(kibanaVersion, deepLink.semver),
    )

    if (!deepLinkSatisfyingVersion) {
      return null
    }

    return deepLinkSatisfyingVersion.uri
  }
}
