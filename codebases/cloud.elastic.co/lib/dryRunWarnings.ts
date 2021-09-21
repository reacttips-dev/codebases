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

import { isEmpty } from 'lodash'

import { getStatus } from './error'

import { getSupportedSliderInstanceTypes } from './sliders'

import { AsyncRequestState, SliderInstanceType } from '../types'

import { BasicFailedReply, BasicFailedReplyElement } from './api/v1/types'

export function getValidationWarnings({
  updateDeploymentDryRunRequest,
  ignoreSecurityRealmWarnings = false,
}: {
  updateDeploymentDryRunRequest: AsyncRequestState
  ignoreSecurityRealmWarnings?: boolean
}): BasicFailedReplyElement[] {
  if (updateDeploymentDryRunRequest.error) {
    const badRequest = getStatus(updateDeploymentDryRunRequest.error) === 400
    const body = (updateDeploymentDryRunRequest.error as any).body as BasicFailedReply

    if (badRequest && body) {
      const { errors } = body

      if (!errors) {
        return []
      }

      /* During major deployment upgrades, Security Realm warnings are *expected* in dry run validation.
       * The DeploymentVersionUpgradeModal component offers a way for the user to resolve conflicts and
       * submit a valid plan.
       * If their submission fails, they'll be met with these errors anyways.
       */
      if (ignoreSecurityRealmWarnings) {
        return errors.filter((error) => !error.message.startsWith(`'xpack.security.authc.realms`))
      }

      return errors
    }

    return []
  }

  return []
}

export function hasValidationWarnings({
  updateDeploymentDryRunRequest,
}: {
  updateDeploymentDryRunRequest: AsyncRequestState
}): boolean {
  return !isEmpty(
    getValidationWarnings({
      updateDeploymentDryRunRequest,
    }),
  )
}

export function decorateWarningsWithSliderType(
  warnings: BasicFailedReplyElement[],
): Array<BasicFailedReplyElement & { sliderInstanceType: SliderInstanceType | undefined }> {
  return warnings.map((warning) => ({
    ...warning,
    sliderInstanceType: deriveSliderInstanceTypeFromWarning(warning),
  }))
}

function deriveSliderInstanceTypeFromWarning(
  warning: BasicFailedReplyElement,
): SliderInstanceType | undefined {
  return getSupportedSliderInstanceTypes().find((sliderInstanceType) => {
    if (!warning.fields) {
      return false
    }

    return warning.fields.every(
      // an example of fields for slider resources we're looking for are:
      // "resources.kibana[0].kibana.user_settings_json"
      (field) => field.startsWith(`resources.${sliderInstanceType}`),
    )
  })
}
