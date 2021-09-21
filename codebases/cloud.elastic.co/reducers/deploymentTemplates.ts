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

import { FETCH_DEPLOYMENT_TEMPLATE, FETCH_DEPLOYMENT_TEMPLATES } from '../constants/actions'
import { replaceIn } from '../lib/immutability-helpers'

import { DeploymentTemplateInfoV2 } from '../lib/api/v1/types'

import { AsyncAction, RegionId, VersionNumber } from '../types'

export interface State {
  [regionId: string]: DeploymentTemplateInfoV2[] | undefined
}

interface FetchAllAction
  extends AsyncAction<typeof FETCH_DEPLOYMENT_TEMPLATES, DeploymentTemplateInfoV2[]> {
  meta: {
    regionId: RegionId
    stackVersion?: VersionNumber
  }
}

interface FetchSingleAction
  extends AsyncAction<typeof FETCH_DEPLOYMENT_TEMPLATE, DeploymentTemplateInfoV2> {
  meta: {
    regionId: RegionId
    templateId: string
    stackVersion?: VersionNumber
  }
}

export function makeDeploymentTemplatesDescriptor(
  regionId: string,
  stackVersion: VersionNumber | null | undefined,
): string {
  const versionString = stackVersion != null ? stackVersion : `unversioned`
  return `${regionId}/${versionString}`
}

type Action = FetchAllAction | FetchSingleAction

export default function deploymentTemplatesReducer(state: State = {}, action: Action): State {
  if (action.type === FETCH_DEPLOYMENT_TEMPLATES) {
    if (!action.error && action.payload) {
      const { regionId, stackVersion } = action.meta
      return replaceIn(
        state,
        makeDeploymentTemplatesDescriptor(regionId, stackVersion),
        action.payload,
      )
    }
  }

  if (action.type === FETCH_DEPLOYMENT_TEMPLATE) {
    if (!action.error && action.payload) {
      const { regionId, templateId, stackVersion } = action.meta
      const template = action.payload
      const descriptor = makeDeploymentTemplatesDescriptor(regionId, stackVersion)
      const currentState = state[descriptor]

      // Have we already loaded templates for this region+version?
      if (currentState) {
        const currentIndex = currentState.findIndex((t) => t.id === templateId)

        // Does the current data already contain this template?
        if (currentIndex < 0) {
          // It doesn't, so copy the existing state and insert the template
          return {
            ...state,
            [descriptor]: [...currentState, template],
          }
        }

        // Copy the state and overwrite the existing value
        const newState = [...currentState]
        newState[currentIndex] = template
        return {
          ...state,
          [descriptor]: newState,
        }
      }

      // No state for this region+version yet
      return {
        ...state,
        [descriptor]: [template],
      }
    }
  }

  return state
}

export function getDeploymentTemplates(
  state: State,
  regionId: RegionId,
  stackVersion: VersionNumber | null,
): DeploymentTemplateInfoV2[] | undefined {
  const templates = state[makeDeploymentTemplatesDescriptor(regionId, stackVersion)]

  if (!Array.isArray(templates)) {
    return templates
  }

  return templates.sort(defaultTemplateFirst)
}

export function getVisibleDeploymentTemplates(
  state: State,
  regionId: RegionId,
  stackVersion: VersionNumber | null,
): DeploymentTemplateInfoV2[] | undefined {
  const templates = getDeploymentTemplates(state, regionId, stackVersion)

  if (!Array.isArray(templates)) {
    return templates
  }

  return templates.filter(
    (t) =>
      !(
        Array.isArray(t.metadata) &&
        t.metadata.some((tag) => tag.key === `hidden` && tag.value === `true`)
      ),
  )
}

// Gets the corresponding hot warm template if it exists
export function getHotWarmTemplate(
  state: State,
  regionId: RegionId,
  deploymentTemplateId: string,
  stackVersion: VersionNumber | null,
): DeploymentTemplateInfoV2 | undefined {
  const currentTemplate = getDeploymentTemplate(state, regionId, deploymentTemplateId, stackVersion)
  const templates = getDeploymentTemplates(state, regionId, stackVersion)

  if (!Array.isArray(templates)) {
    return templates
  }

  const metadata =
    currentTemplate &&
    Array.isArray(currentTemplate.metadata) &&
    currentTemplate.metadata.find((tag) => tag.key === `hot_warm_template`)
  const correspondingTemplateId = metadata ? metadata.value : ``

  return getDeploymentTemplate(state, regionId, correspondingTemplateId, stackVersion)
}

export function getDeploymentTemplate(
  state: State,
  regionId: RegionId,
  templateId: string,
  stackVersion: VersionNumber | null,
): DeploymentTemplateInfoV2 | undefined {
  const templates = getDeploymentTemplates(state, regionId, stackVersion)

  if (!Array.isArray(templates)) {
    return templates
  }

  return templates.find((template) => template.id === templateId)
}

function defaultTemplateFirst(t1: DeploymentTemplateInfoV2, t2: DeploymentTemplateInfoV2) {
  if (t1.id === 'default' && t2.id !== 'default') {
    return -1
  }

  if (t1.id !== 'default' && t2.id === 'default') {
    return 1
  }

  return t1.id!.localeCompare(t2.id!)
}
