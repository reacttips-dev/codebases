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

import { getConfigForKey, isFeatureActivated } from '../../store'
import Feature from '../../lib/feature'
import { isSliderInstanceTypeSupportedInPlatform } from '../../lib/sliders'

export function getSchema() {
  const isAnyAdminconsole = getConfigForKey(`APP_NAME`) === `adminconsole`
  const isSaasAdminconsole = getConfigForKey(`CLOUD_UI_APP`) === `saas-adminconsole`
  const hasSaasFilters = isFeatureActivated(Feature.saasFilters)
  const canToggleClusterLock = isFeatureActivated(Feature.toggleClusterLock)
  const canSearchClusterLock = isFeatureActivated(Feature.searchClusterLock)
  const hideInsteadOfDelete = isFeatureActivated(Feature.hideClusterInsteadOfDelete)

  const clusterLockingFields =
    canToggleClusterLock && canSearchClusterLock
      ? {
          locked: {
            type: `string`,
            validate: validateHumanBool,
          },
        }
      : {}

  const anyAdminconsoleFields = isAnyAdminconsole
    ? {
        system: {
          type: `string`,
          validate: validateHumanBool,
        },
        allocator: {
          type: `string`,
        },
      }
    : {}

  const saasAdminconsoleFields = isSaasAdminconsole
    ? {
        organization: {
          type: `string`,
        },
        subscription: {
          type: `string`,
        },
      }
    : {}

  const hiddenClusterFields = hideInsteadOfDelete
    ? {
        hidden: {
          type: `string`,
          validate: validateHumanBool,
        },
      }
    : {}

  const saasFields = hasSaasFilters
    ? {
        region: {
          type: `string`,
        },
      }
    : {}

  const schema = {
    strict: true,
    fields: {
      id: {
        type: `string`,
      },
      name: {
        type: `string`,
      },
      healthy: {
        type: `string`,
        validate: validateHumanBool,
      },
      healthy_configuration: {
        type: `string`,
        validate: validateHumanBool,
      },
      healthy_masters: {
        type: `string`,
        validate: validateHumanBool,
      },
      healthy_shards: {
        type: `string`,
        validate: validateHumanBool,
      },
      healthy_snapshot: {
        type: `string`,
        validate: validateHumanBool,
      },
      healthy_snapshot_latest: {
        type: `string`,
        validate: validateHumanBool,
      },
      enabled_snapshots: {
        type: `string`,
        validate: validateHumanBool,
      },
      maintenance: {
        type: `string`,
        validate: validateHumanBool,
      },
      stopped: {
        type: `string`,
        validate: validateHumanBool,
      },
      pending: {
        type: `string`,
        validate: validateHumanBool,
      },
      version: {
        type: `string`,
      },
      has: {
        type: `string`,
        validate: validateProduct,
      },
      configuration: {
        type: `string`,
      },
      template: {
        type: `string`,
      },
      zones: {
        type: `number`,
      },
      size: {
        type: `number`,
      },
      ...clusterLockingFields,
      ...saasAdminconsoleFields,
      ...saasFields,
      ...anyAdminconsoleFields,
      ...hiddenClusterFields,
    },
  }

  const defaultFields = [`id`, `name`, `version`]

  if (`region` in schema) {
    defaultFields.push(`region`)
  }

  return { schema, defaultFields }
}

function validateHumanBool(value) {
  if (value !== `y` && value !== `n`) {
    throw new Error(`Expected "y" or "n"`)
  }
}

export function getActiveProducts() {
  const products = [`kibana`, `ml`, `apm`]

  if (isSliderInstanceTypeSupportedInPlatform(`appsearch`)) {
    products.push(`appsearch`)
  }

  return products
}

function validateProduct(value) {
  const products = getActiveProducts()

  if (!products.includes(value)) {
    throw new Error(`Expected one of: "${products.join(`", "`)}"`)
  }
}
