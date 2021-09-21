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

import { find, cloneDeep, last } from 'lodash'

import {
  ensureSatisfiesDeploymentConstraints,
  ensureSatisfiesRegionConstraints,
  moveZoneCountInsideTopologyElements,
  setDeploymentToSmallestSizeInTemplate,
  preservePrevCreateFormState,
} from './sanitize'

import { ensureSatisfiesTrialConstraints } from './trials'
import { setDeploymentVersion } from './crud'

import { getSupportedSliderInstanceTypes } from '../../lib/sliders'
import { supportsNodeRoles, getFirstSliderCluster } from './selectors'

import {
  StackVersionConfig,
  DeploymentTemplateInfoV2,
  DeploymentCreateRequest,
  InstanceConfiguration,
  TopologySize,
  ElasticsearchPayload,
  ElasticsearchClusterTopologyElement,
} from '../api/v1/types'

import { Region, SliderPayload, AnyPayload } from '../../types'

export type CreateDeploymentFromTemplateProps = {
  prevState?: DeploymentCreateRequest
  deploymentTemplate: DeploymentTemplateInfoV2
  inTrial?: boolean
  smallestSize?: boolean
  region: Region
  stackVersions: StackVersionConfig[]
  version: string
}

/* We need this function to unmangle the old deployment template format and
 * produce a reasonable `DeploymentCreateRequest` right off the bat.
 * In doing so, we can work throughout the entire UI flow using the new models.
 * Hopefully this should limit the amount of hacks we need to have in place while migrating.
 */
export function createDeploymentFromTemplate({
  /* Sometimes we need to create a new `DeploymentCreateRequest` based on a different template,
   * in these cases we need to preserve things like the deployment name, version, and some
   * configuration like restore from remote snapshot or monitoring settings.
   * In those cases, we can rely on the `prevState` from before switching templates.
   */
  prevState,
  deploymentTemplate,
  inTrial,
  region,
  stackVersions,
  version,
  smallestSize,
}: CreateDeploymentFromTemplateProps): DeploymentCreateRequest {
  const template = deploymentTemplate.deployment_template
  const deployment: DeploymentCreateRequest = cloneDeep(template)

  // make sure top-level things are in place

  deployment.name = (prevState && prevState.name) || ``

  if (deployment.metadata == null) {
    deployment.metadata = {}
  }

  deployment.metadata.system_owned = false

  // set (or unset) deployment-related things in the resource definitions
  getSupportedSliderInstanceTypes()
    .filter((sliderInstanceType) => deployment.resources[sliderInstanceType])
    .forEach((sliderInstanceType) => {
      const resource = getFirstSliderCluster({ deployment, sliderInstanceType }) as AnyPayload

      if (resource == null) {
        return
      }

      if (sliderInstanceType === `elasticsearch`) {
        // ES resource gets a template reference
        ;(resource as ElasticsearchPayload).plan.deployment_template = {
          id: deploymentTemplate.id,
        }
      } else {
        // Non-ES resources get a ref to the ES resource
        ;(resource as SliderPayload).elasticsearch_cluster_ref_id = `main-elasticsearch`
      }

      // Everything gets a region and a ref
      resource.region = region.id
      resource.ref_id = `main-${sliderInstanceType}`

      // remove unsupported properties from pre-node_roles versions...
      if (sliderInstanceType === `elasticsearch` && !supportsNodeRoles({ version })) {
        // the node_roles property
        resource.plan.cluster_topology?.forEach((topologyElement) => {
          delete (topologyElement as ElasticsearchClusterTopologyElement).node_roles
        })
      }

      // Drop anything transient
      delete resource.plan.transient
    })

  const instanceConfigurations = deploymentTemplate.instance_configurations!

  const stackVersion = find(stackVersions, { version })

  /* We need to ensure the version that was defined
   * before fetching templates is used to bootstrap our state.
   */
  setDeploymentVersion({
    deployment,
    intendedVersion: version,
    stackVersion,
  })

  // Ensure that snapshot, monitoring, and other settings are preserved.
  if (prevState) {
    preservePrevCreateFormState({
      deployment,
      prevState,
    })
  }

  // Do we have enough zones in the region? If not, reduce `zone_count` to match.
  moveZoneCountInsideTopologyElements({ deployment })
  ensureSatisfiesRegionConstraints({
    region,
    deployment,
  })

  // Honor the smallest deployment size available, only when explicitly requested by consumers.
  if (smallestSize) {
    setDeploymentToSmallestSizeInTemplate({
      deployment,
      instanceConfigurations,
    })
  }

  // Ensure trial accounts don't exceed the trial capacity caps.
  ensureSatisfiesTrialConstraints({
    deployment,
    instanceConfigurations,
    inTrial,
  })

  /* We must ensure that dedicated masters and ingest plugins are
   * constrained depending on default configuration.
   */
  ensureSatisfiesDeploymentConstraints({
    region,
    deployment,
    deploymentTemplate,
    instanceConfigurations,
    stackVersions,
  })

  return deployment
}

/*
 * Returns whether an exact size is a valid option for an instance configuration.
 */
export function isValidSizeForInstanceConfiguration({
  size,
  instanceConfiguration,
}: {
  size?: TopologySize
  instanceConfiguration: InstanceConfiguration
}): boolean {
  if (!size) {
    return false
  }

  // resource must match
  if (size.resource !== instanceConfiguration.discrete_sizes.resource) {
    return false
  }

  // and size must either be in the list of possible sizes...
  if (instanceConfiguration.discrete_sizes.sizes.includes(size.value)) {
    return true
  }

  // or a multiple of the biggest
  const biggestInstanceSize = last(instanceConfiguration.discrete_sizes.sizes)!
  return biggestInstanceSize % size.value === 0
}
