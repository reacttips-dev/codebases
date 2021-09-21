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

import { get } from 'lodash'

import { getEsPlan, getKibPlan, getApmPlan } from './selectors'

import { isValidYaml } from '../yaml'

import { DeploymentGetResponse, DeploymentUpdateRequest } from '../api/v1/types'

type ValidationErrors = {
  [errorCode: string]: string
}

export function validateUpdateRequest({
  deploymentUnderEdit,
  deployment,
}: {
  deploymentUnderEdit: DeploymentGetResponse
  deployment: DeploymentUpdateRequest
}): ValidationErrors {
  const errors: ValidationErrors = {}

  validateElasticsearch({ deploymentUnderEdit, deployment, errors })
  validateKibana({ deploymentUnderEdit, deployment, errors })
  validateApm({ deploymentUnderEdit, deployment, errors })

  return errors
}

function validateElasticsearch({
  deployment,
  errors,
}: {
  deploymentUnderEdit: DeploymentGetResponse
  deployment: DeploymentUpdateRequest
  errors: ValidationErrors
}) {
  const esPlan = getEsPlan({ deployment })
  const esUserSettings = get(esPlan, [`elasticsearch`, `user_settings_yaml`])

  if (esUserSettings && !isValidYaml(esUserSettings)) {
    errors.userSettings = `The Elasticsearch YAML settings are invalid, please check your syntax`
  }
}

function validateKibana({
  deployment,
  errors,
}: {
  deploymentUnderEdit: DeploymentGetResponse
  deployment: DeploymentUpdateRequest
  errors: ValidationErrors
}) {
  const kibPlan = getKibPlan({ deployment })
  const kibUserSettings = get(kibPlan, [`kibana`, `user_settings_yaml`])

  if (kibUserSettings && !isValidYaml(kibUserSettings)) {
    errors.userSettings = `The Kibana YAML settings are invalid, please check your syntax`
  }
}

function validateApm({
  deployment,
  errors,
}: {
  deploymentUnderEdit: DeploymentGetResponse
  deployment: DeploymentUpdateRequest
  errors: ValidationErrors
}) {
  const apmPlan = getApmPlan({ deployment })
  const apmUserSettings = get(apmPlan, [`apm`, `user_settings_yaml`])

  if (apmUserSettings && !isValidYaml(apmUserSettings)) {
    errors.userSettings = `The APM YAML settings are invalid, please check your syntax`
  }
}
