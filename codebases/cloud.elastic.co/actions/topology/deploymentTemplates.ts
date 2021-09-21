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

import { omit } from 'lodash'

import asyncRequest, { resetAsyncRequest } from '../asyncRequests'

import {
  CREATE_DEPLOYMENT_TEMPLATE,
  DELETE_DEPLOYMENT_TEMPLATE,
  FETCH_DEPLOYMENT_TEMPLATE,
  FETCH_DEPLOYMENT_TEMPLATES,
  UPDATE_DEPLOYMENT_TEMPLATE,
  UPDATE_PENDING_TEMPLATE_DESCRIPTION,
  UPDATE_PENDING_TEMPLATE_NAME,
  FETCH_GLOBAL_DEPLOYMENT_TEMPLATES,
} from '../../constants/actions'

import history from '../../lib/history'

import {
  createDeploymentTemplateV2Url,
  deleteDeploymentTemplateV2Url,
  getDeploymentTemplatesV2Url,
  getDeploymentTemplateV2Url,
  setDeploymentTemplateV2Url,
  getGlobalDeploymentTemplatesUrl,
} from '../../lib/api/v1/urls'

import {
  topologyDeploymentTemplatesUrl,
  topologyViewDeploymentTemplateUrl,
} from '../../lib/urlBuilder'

import { getDeploymentTemplates } from '../../reducers/deploymentTemplates'

import { DeploymentTemplateRequestBody, DeploymentTemplateInfoV2 } from '../../lib/api/v1/types'

import { RegionId, ThunkAction, VersionNumber, ReduxState } from '../../types'

export function fetchDeploymentTemplates({
  regionId,
  stackVersion,
}: {
  regionId: RegionId
  stackVersion: VersionNumber | null
}): ThunkAction {
  return (dispatch) => {
    const url = getDeploymentTemplatesV2Url({
      region: regionId,
      stackVersion,
      showInstanceConfigurations: true,
    })

    return dispatch(
      asyncRequest({
        type: FETCH_DEPLOYMENT_TEMPLATES,
        method: `GET`,
        url,
        meta: { regionId, stackVersion },
        crumbs: [regionId, stackVersion || ``],
      }),
    )
  }
}

export function fetchGlobalDeploymentTemplates(): ThunkAction {
  return (dispatch) => {
    const url = getGlobalDeploymentTemplatesUrl()

    return dispatch(
      asyncRequest({
        type: FETCH_GLOBAL_DEPLOYMENT_TEMPLATES,
        method: `GET`,
        url,
      }),
    )
  }
}

export function fetchDeploymentTemplatesIfNeeded({
  regionId,
  stackVersion,
}: {
  regionId: RegionId
  stackVersion: VersionNumber | null
}): ThunkAction {
  return (dispatch, getState) => {
    const state = getState()

    if (!shouldFetchDeploymentTemplates(state, regionId, stackVersion)) {
      return Promise.resolve()
    }

    return dispatch(
      fetchDeploymentTemplates({
        regionId,
        stackVersion,
      }),
    )
  }
}

function shouldFetchDeploymentTemplates(
  { deploymentTemplates }: ReduxState,
  regionId: string,
  stackVersion: string | null,
): boolean {
  if (getDeploymentTemplates(deploymentTemplates, regionId, stackVersion)) {
    return false
  }

  return true
}

export function fetchDeploymentTemplate(
  regionId: RegionId,
  templateId: string,
  stackVersion: VersionNumber | null,
): ThunkAction {
  const url = getDeploymentTemplateV2Url({
    region: regionId,
    templateId,
    stackVersion,
    showInstanceConfigurations: true,
  })

  return asyncRequest({
    type: FETCH_DEPLOYMENT_TEMPLATE,
    method: `GET`,
    url,
    meta: { regionId, templateId, stackVersion },
    crumbs: [regionId, templateId, stackVersion || ``],
  })
}

export function createDeploymentTemplate(
  regionId: RegionId,
  template: DeploymentTemplateRequestBody,
): ThunkAction {
  const url = createDeploymentTemplateV2Url({ region: regionId })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: CREATE_DEPLOYMENT_TEMPLATE,
        method: `POST`,
        url,
        payload: template,
        meta: { regionId },
        crumbs: [regionId],
      }),
    ).then((response) => {
      // See the deployment template you just created.
      const {
        payload: { id: instanceId },
      } = response
      return history.push(topologyViewDeploymentTemplateUrl(regionId, instanceId))
    })
}

export function deleteDeploymentTemplate(regionId: RegionId, templateId: string): ThunkAction {
  const url = deleteDeploymentTemplateV2Url({ region: regionId, templateId })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: DELETE_DEPLOYMENT_TEMPLATE,
        method: `DELETE`,
        url,
        meta: { regionId, templateId },
        crumbs: [regionId, templateId],
      }),
    ).then(() => history.push(topologyDeploymentTemplatesUrl(regionId)))
}

export function updateDeploymentTemplate(
  regionId: RegionId,
  template: DeploymentTemplateInfoV2,
): ThunkAction {
  if (template.id == null) {
    throw new Error(`template must have an ID before it can be updated`)
  }

  // The API rejects requests if these fields are set
  const payload = omit(template, 'id', 'instance_configurations', 'source', 'system_owned')

  const templateId = template.id
  const url = setDeploymentTemplateV2Url({ region: regionId, templateId })

  return (dispatch) =>
    dispatch(
      asyncRequest({
        type: UPDATE_DEPLOYMENT_TEMPLATE,
        method: `PUT`,
        url,
        payload,
        meta: { regionId, templateId },
        crumbs: [regionId, templateId],
      }),
    )
      .then(() => dispatch(fetchDeploymentTemplate(regionId, templateId, null)))
      .then(() => history.push(topologyViewDeploymentTemplateUrl(regionId, templateId)))
}

export function updatePendingTemplateName(name: string) {
  return {
    type: UPDATE_PENDING_TEMPLATE_NAME,
    payload: {
      name,
    },
  }
}

export function updatePendingTemplateDescription(description: string) {
  return {
    type: UPDATE_PENDING_TEMPLATE_DESCRIPTION,
    payload: {
      description,
    },
  }
}

export const resetDeleteDeploymentTemplateRequest = (...crumbs) =>
  resetAsyncRequest(DELETE_DEPLOYMENT_TEMPLATE, crumbs)
