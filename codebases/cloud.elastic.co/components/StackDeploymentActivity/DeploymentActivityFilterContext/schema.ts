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

import { getConfigForKey } from '../../../store'

import { FilterSchema } from '../../../cui'

import { getPlanAttemptId, isPendingAttempt } from '../../../lib/stackDeployments'

import { ResourceChangeAttempt } from '../../../types'

export function getSchema() {
  const isCloudEnterprise = getConfigForKey(`APP_FAMILY`) === `cloud-enterprise`

  const schemaOutsideOfCloudEnterprise: FilterSchema['fields'] = isCloudEnterprise
    ? {}
    : {
        system: {
          type: `string`,
          validate: validateHumanBool,
        },
      }

  const schema: FilterSchema = {
    strict: true,
    fields: {
      id: {
        type: `string`,
      },
      healthy_configuration: {
        type: `string`,
        validate: validateHumanBool,
      },
      pending: {
        type: `string`,
        validate: validateHumanBool,
      },
      source: {
        type: `string`,
      },
      ...schemaOutsideOfCloudEnterprise,
    },
  }

  const defaultFields = [`id`, `source`]

  return { schema, defaultFields }
}

export function getQueryModel(change: ResourceChangeAttempt) {
  const { resource, resourceType, planAttempt } = change
  const id = getPlanAttemptId({ resource, planAttempt })
  const userId = planAttempt.source ? planAttempt.source.user_id : null
  const source = planAttempt.source ? planAttempt.source.action : null

  return {
    id: `#${resourceType}-${id}`,
    healthy_configuration: toHumanBool(planAttempt.healthy),
    pending: toHumanBool(isPendingAttempt({ planAttempt })),
    source,
    system: toHumanBool(!userId),
  }
}

function toHumanBool(value) {
  return value ? `y` : `n`
}

function validateHumanBool(value) {
  if (value !== `y` && value !== `n`) {
    throw new Error(`Expected "y" or "n"`)
  }
}
