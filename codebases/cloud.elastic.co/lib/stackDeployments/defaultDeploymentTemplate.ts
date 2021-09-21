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

import { isUndefined, isEmpty, find } from 'lodash'

import { isHiddenTemplate } from '../deploymentTemplates/metadata'

import { DeploymentTemplateInfoV2, GlobalDeploymentTemplateInfo } from '../api/v1/types'
import { rcompare } from '../semver'

type Props = {
  deploymentTemplate?: DeploymentTemplateInfoV2
  deploymentTemplates?: DeploymentTemplateInfoV2[]
  globalDeploymentTemplate?: GlobalDeploymentTemplateInfo
  setDeploymentTemplate: (template: DeploymentTemplateInfoV2) => void
  regionChanged: boolean
  versionChanged: boolean
}

export function selectTemplateWithSameCategory({
  deploymentTemplates,
  deploymentTemplate,
  globalDeploymentTemplate,
  setDeploymentTemplate,
  regionChanged,
  versionChanged,
}: Props): void {
  const sameCategoryTemplate = getSameCategoryTemplate({
    deploymentTemplates,
    deploymentTemplate,
    globalDeploymentTemplate,
  })

  if (!sameCategoryTemplate) {
    if (deploymentTemplates && deploymentTemplates.length > 0) {
      setDeploymentTemplate(deploymentTemplates[0])
    }

    return
  }

  if (
    deploymentTemplate &&
    deploymentTemplate.id === sameCategoryTemplate.id &&
    !regionChanged &&
    !versionChanged
  ) {
    return
  }

  // `sameNameTemplate.instance_configurations` can be null if the templates were loaded
  // with `showInstanceConfigurations` set to false e.g. on the `Platform > Templates` page.
  // We load them with the flag set to true in the Create component hierarchy, but this guard
  // prevents us setting a template without instance configurations into the Redux state,
  // while we wait for the full configuration data to load
  if (!sameCategoryTemplate.instance_configurations) {
    return
  }

  setDeploymentTemplate(sameCategoryTemplate)
}

function getSameCategoryTemplate({
  deploymentTemplates,
  deploymentTemplate,
  globalDeploymentTemplate,
}: {
  deploymentTemplates?: DeploymentTemplateInfoV2[]
  deploymentTemplate?: DeploymentTemplateInfoV2
  globalDeploymentTemplate?: GlobalDeploymentTemplateInfo
}): DeploymentTemplateInfoV2 | null {
  const visibleTemplates = getVisibleTemplates({ deploymentTemplates })

  if (isEmpty(visibleTemplates)) {
    return null
  }

  if (!deploymentTemplate) {
    if (!globalDeploymentTemplate) {
      return null
    }

    const selectedGlobalTemplate = find(visibleTemplates, {
      template_category_id: globalDeploymentTemplate?.template_category_id,
    })

    if (!selectedGlobalTemplate) {
      return null
    }

    return selectedGlobalTemplate
  }

  const basisForCategory = globalDeploymentTemplate || deploymentTemplate

  const possibleTemplatesForGlobalSelection = visibleTemplates.filter(
    (visibleTemplate) =>
      visibleTemplate.template_category_id === basisForCategory.template_category_id,
  )

  // If 0 matches exist, return null
  // If 1 match exists, choose it.
  // If > 1 match exists, choose template with highest min_version
  switch (possibleTemplatesForGlobalSelection.length) {
    case 0:
      return null
    case 1:
      return possibleTemplatesForGlobalSelection[0]
    default:
      return getHighestMinVersionTemplate({
        deploymentTemplates: possibleTemplatesForGlobalSelection,
      })
  }
}

function getVisibleTemplates({
  deploymentTemplates,
}: {
  deploymentTemplates?: DeploymentTemplateInfoV2[]
}): DeploymentTemplateInfoV2[] {
  if (!deploymentTemplates) {
    return []
  }

  return deploymentTemplates
    .filter((template) => !isHiddenTemplate(template))
    .sort(getTemplateSortOrder)
}

function getTemplateSortOrder(a, b) {
  if (!isUndefined(a.order) && !isUndefined(b.order)) {
    return a.order - b.order
  }

  return 0
}

export function getHighestMinVersionTemplate({
  deploymentTemplates,
}: {
  deploymentTemplates: DeploymentTemplateInfoV2[]
}) {
  const sortedTemplates = deploymentTemplates.sort((a, b) => {
    if (!a.min_version && !b.min_version) {
      return 0
    }

    if (!a.min_version) {
      return 1
    }

    if (!b.min_version) {
      return -1
    }

    return rcompare(a.min_version, b.min_version)
  })
  return sortedTemplates[0]
}
