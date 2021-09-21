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
import { flatten, groupBy } from 'lodash'

import { isGlobalTemplateSupportedInPlatform } from '../sliders'
import { getGlobalTemplateMetadataItem } from '../globalDeploymentTemplates/metadata'

import { GlobalDeploymentTemplateInfo } from '../api/v1/types'

export function getSupportedGlobalDeploymentTemplates(
  globalTemplates: GlobalDeploymentTemplateInfo[] | null,
): any[] | null {
  if (!Array.isArray(globalTemplates)) {
    return globalTemplates
  }

  return globalTemplates.filter(isGlobalTemplateSupportedInPlatform)
}

export function isIncompatibleVersionForGlobalTemplate(
  globalTemplate: GlobalDeploymentTemplateInfo,
  version: string,
): boolean {
  if (!globalTemplate) {
    return false
  }

  const versions = flatten(globalTemplate.regions.map((region) => region.versions))

  if (versions.includes(version)) {
    return false
  }

  return true
}

export function groupByParent({
  globalDeploymentTemplates,
}: {
  globalDeploymentTemplates: GlobalDeploymentTemplateInfo[] | null
}) {
  const byParent = groupBy(globalDeploymentTemplates, (template) => {
    if (!template.metadata) {
      return 'noParent'
    }

    const parent = getGlobalTemplateMetadataItem(template, 'parent_solution')

    if (!parent) {
      return 'noParent'
    }

    return parent
  })

  // For now, the only parent returned will be 'stack', but leaving this open for potential future options
  return byParent
}
