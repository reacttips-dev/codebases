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

import { capitalize, isEmpty } from 'lodash'
import { BillingSubscriptionLevel } from 'public/types'

const subscriptionLevels = {
  standard: 0,
  gold: 1,
  platinum: 2,
  enterprise: 3,
}

export const isUsageOutOfCompliance = ({ subscriptionLevel, usageLevel }) =>
  subscriptionLevels[usageLevel] > subscriptionLevels[subscriptionLevel]

export const isSelectedSubscriptionOutOfCompliance = ({ selectedSubscription, usageLevel }) =>
  subscriptionLevels[selectedSubscription] < subscriptionLevels[usageLevel]

export const getOutOfComplianceLevels = ({
  subscriptionLevel,
  usageLevel,
}: {
  subscriptionLevel: BillingSubscriptionLevel
  usageLevel?: string
}) => {
  const outOfComplianceLevels: any[] = []

  if (!usageLevel) {
    Object.keys(subscriptionLevels).forEach((level) => {
      if (subscriptionLevels[level] > subscriptionLevels[subscriptionLevel]) {
        outOfComplianceLevels.push(capitalize(level))
      }
    })
  } else {
    Object.keys(subscriptionLevels).forEach((level) => {
      if (
        subscriptionLevels[level] > subscriptionLevels[subscriptionLevel] &&
        subscriptionLevels[level] <= subscriptionLevels[usageLevel]
      ) {
        outOfComplianceLevels.push(capitalize(level))
      }
    })
  }

  return outOfComplianceLevels
}

export const getOutOfComplianceLevelsText = (outOfComplianceLevels) => {
  if (outOfComplianceLevels.length === 1) {
    return outOfComplianceLevels[0]
  }

  if (outOfComplianceLevels.length === 2) {
    return outOfComplianceLevels.join(` and `)
  }

  if (outOfComplianceLevels.length >= 3) {
    const lastLevel = outOfComplianceLevels.pop()

    const levelsString = outOfComplianceLevels.join(`, `)

    return levelsString.concat(` and ${lastLevel}`)
  }
}

export const isSelectionUpgrade = ({ selectedSubscription, currentSubscription }) =>
  subscriptionLevels[selectedSubscription] >= subscriptionLevels[currentSubscription]

export const getOutOfComplianceFeatures = ({ featuresByLevel, subscriptionLevel }) => {
  if (!subscriptionLevel) {
    return featuresByLevel
  }

  return Object.keys(featuresByLevel)
    .filter((level) => subscriptionLevels[level] > subscriptionLevels[subscriptionLevel])
    .reduce((obj, key) => {
      obj[key] = featuresByLevel[key]
      return obj
    }, {})
}

export const getOutOfComplianceDeployments = ({ deployments, subscriptionLevel }) => {
  if (!subscriptionLevel) {
    return deployments
  }

  return deployments
    .map((deployment) => {
      const { features_by_level } = deployment
      const outOfComplianceFeatures = getOutOfComplianceFeatures({
        featuresByLevel: features_by_level,
        subscriptionLevel,
      })

      if (!isEmpty(outOfComplianceFeatures)) {
        return {
          ...deployment,
          outOfComplianceFeatures,
        }
      }
    })
    .filter((deployment) => deployment)
}
