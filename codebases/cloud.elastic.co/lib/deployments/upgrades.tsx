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

import React, { ReactElement } from 'react'
import { FormattedMessage, IntlShape } from 'react-intl'

import { gte, lt, maxSatisfying } from '../semver'

import {
  getSliderDefinition,
  getSliderPrettyName,
  getSupportedSliderInstanceTypes,
  isSliderEnabledInStackDeployment,
} from '../../lib/sliders'
import {
  getDeploymentTemplateId,
  getHighestSliderVersion,
  getSliderInstancesTypeRequiringUpgrade,
  hasMismatchingVersions,
} from '../../lib/stackDeployments'
import { formatAsSentence } from '../../lib/string'

import { SliderInstanceType, StackDeployment } from '../../types'

interface CompatabilityCheckParams {
  deployment: StackDeployment
  version: string
  intl: IntlShape
}

/**
 * Detects whether a deployment template is hot-warm and should not be used
 * with the given ES version. This is clearly fragile, since it depends on
 * the template ID ending with 'hot-warm' (e.g. 'aws-hot-warm' or
 * 'gcp-hot-warm' in ESS), or being 'hot.warm' (for ECE). A longer-term fix
 * might examine the deployment template itself more carefully.
 *
 * @param deploymentTemplateId
 * @param version
 */
export function isIncompatibleVersionForDeploymentTemplate(
  deploymentTemplateId: string | null | undefined,
  version: string,
): null | ReactElement<typeof FormattedMessage> {
  if (!deploymentTemplateId) {
    return null
  }

  if (deploymentTemplateId.endsWith(`hot-warm`) || deploymentTemplateId === `hot.warm`) {
    if (gte(version, `7.0.0`) && lt(version, `7.1.1`)) {
      return (
        <FormattedMessage
          id='deployment-upgrades.incompatible-version'
          defaultMessage='Version {version} cannot be used with hot/warm templates due to performance issues.'
          values={{ version }}
        />
      )
    }
  }

  return null
}

export function getIncompatibleVersionReason(
  templateCategoryId: string | null | undefined,
  version: string,
): null | ReactElement<typeof FormattedMessage> {
  if (!templateCategoryId) {
    return null
  }

  if (templateCategoryId === 'hot-warm') {
    if (gte(version, `7.0.0`) && lt(version, `7.1.1`)) {
      return (
        <FormattedMessage
          id='deployment-upgrades.incompatible-version'
          defaultMessage='Version {version} cannot be used with hot/warm templates due to performance issues.'
          values={{ version }}
        />
      )
    }
  }

  return null
}

function isIncompatibleVersion({
  deployment,
  version,
}: CompatabilityCheckParams): null | ReactElement<typeof FormattedMessage> {
  const deploymentTemplateId = getDeploymentTemplateId({ deployment })

  return isIncompatibleVersionForDeploymentTemplate(deploymentTemplateId, version)
}

function isIncompatibleSlider({
  deployment,
  version,
}: CompatabilityCheckParams): null | ReactElement<typeof FormattedMessage> {
  const supportedTypes = getSupportedSliderInstanceTypes()

  for (const sliderInstanceType of supportedTypes) {
    if (isSliderDeprecated(deployment, sliderInstanceType, [version])) {
      return (
        <FormattedMessage
          id='deployment-upgrades.incompatible-slider'
          defaultMessage='{sliderPrettyName} not supported.'
          values={{
            sliderPrettyName: (
              <FormattedMessage
                {...getSliderPrettyName({
                  sliderInstanceType,
                  version,
                })}
              />
            ),
          }}
        />
      )
    }
  }

  return null
}

function hasVersionMisMatch({
  deployment,
  version,
  intl: { formatMessage },
}: CompatabilityCheckParams): null | ReactElement<typeof FormattedMessage> {
  if (hasMismatchingVersions({ deployment })) {
    const highestVersion = getHighestSliderVersion({ deployment })!
    const mismatchingSliderNames = getSliderInstancesTypeRequiringUpgrade({
      deployment,
    }).map((sliderInstanceType) =>
      formatMessage(getSliderPrettyName({ sliderInstanceType, version })),
    )

    if (version !== highestVersion) {
      return (
        <FormattedMessage
          id='deployment-upgrades.incompatible-version-mismatch'
          defaultMessage="You can't upgrade {formattedSliderNames} to {version} because some instances are already on version {highestVersion}"
          values={{
            highestVersion,
            version,
            formattedSliderNames: formatAsSentence(mismatchingSliderNames),
            sliderCount: mismatchingSliderNames.length,
          }}
        />
      )
    }
  }

  return null
}

export function isSliderDeprecated(
  deployment: StackDeployment,
  sliderInstanceType: SliderInstanceType,
  versions: string[],
): boolean {
  const hasSlider = isSliderEnabledInStackDeployment(deployment, sliderInstanceType)
  const { unsupportedFromVersion } = getSliderDefinition({ sliderInstanceType })

  const hasIncompatibleVersion = Boolean(
    unsupportedFromVersion && maxSatisfying(versions, unsupportedFromVersion),
  )

  return hasSlider && hasIncompatibleVersion
}

export function checkForIncompatibilities(
  params: CompatabilityCheckParams,
): null | ReactElement<typeof FormattedMessage> {
  const checks = [isIncompatibleVersion, isIncompatibleSlider, hasVersionMisMatch]

  for (const checkFn of checks) {
    const message = checkFn(params)

    if (message) {
      return message
    }
  }

  return null
}
