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

import { SliderInstanceType } from '../../types'
import { GlobalDeploymentTemplateInfo } from '../api/v1/types'

export function getDedicatedGlobalTemplateType(
  globalTemplate: GlobalDeploymentTemplateInfo | undefined,
): SliderInstanceType | null {
  if (globalTemplate == null) {
    return null
  }

  const dedicatedMetadataValue = getGlobalTemplateMetadataItem(globalTemplate, `cluster_dedicated`)
  return dedicatedMetadataValue as SliderInstanceType | null
}

export function getGlobalTemplateMetadataItem(
  globalTemplate: GlobalDeploymentTemplateInfo,
  key: string,
): string | null {
  const dedicatedMetadataItem =
    globalTemplate.metadata && globalTemplate.metadata.find((item) => item.key === key)

  if (!dedicatedMetadataItem) {
    return null
  }

  return dedicatedMetadataItem.value
}
