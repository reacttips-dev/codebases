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

import React, { FunctionComponent } from 'react'

import { EuiBadge } from '@elastic/eui'

import { AnyClusterPlanInfo } from '../../types'

type Props = {
  action: string | null
}

const StackConfigurationChangeSource: FunctionComponent<Props> = ({ action }) => {
  if (!action) {
    return null
  }

  return <EuiBadge color='hollow'>{action}</EuiBadge>
}

export default StackConfigurationChangeSource

export function getSourceAttribution({
  planAttempt,
}: {
  planAttempt: AnyClusterPlanInfo
}): string | null {
  const { source } = planAttempt

  if (!source) {
    return null
  }

  const { action } = source

  if (!action) {
    return null
  }

  return action
}

export function hasSourceAttribution({ planAttempt }: { planAttempt: AnyClusterPlanInfo }) {
  return Boolean(getSourceAttribution({ planAttempt }))
}
