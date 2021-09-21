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
import { StackDeployment, SliderInstanceType, AnyResourceInfo } from '../../../types'

interface GetFirstOptions {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
}

function getFirstProp<TKey extends keyof AnyResourceInfo>(
  prop: TKey,
  { deployment, sliderInstanceType }: GetFirstOptions,
): AnyResourceInfo[TKey] | null {
  const [resource]: AnyResourceInfo[] = deployment.resources[sliderInstanceType]

  if (!resource) {
    return null
  }

  return get(resource, prop)
}

export const getFirstRefId = (a: GetFirstOptions): string | null => getFirstProp('ref_id', a)
export const getFirstId = (a: GetFirstOptions): string | null => getFirstProp('id', a)
export const getFirstRegion = (a: GetFirstOptions): string | null => getFirstProp('region', a)

export const getFirstEsRefId = ({ deployment }: { deployment: StackDeployment }): string | null =>
  getFirstRefId({ deployment, sliderInstanceType: `elasticsearch` })
