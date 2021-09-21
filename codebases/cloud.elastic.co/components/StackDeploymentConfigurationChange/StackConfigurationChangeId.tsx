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

import { SliderInstanceType } from '../../types'

type Props = {
  kind: SliderInstanceType
  id?: number | null
  color?: string
  onClick?: (planAttemptId: string) => void
}

const StackConfigurationChangeId: FunctionComponent<Props> = ({ kind, id, onClick, color }) => {
  const planAttemptId = typeof id === `number` ? `${kind}-${id}` : kind

  const onClickProps = onClick
    ? {
        onClick: () => onClick(planAttemptId),
        onClickAriaLabel: planAttemptId,
      }
    : {}

  return (
    <EuiBadge color={color} {...onClickProps}>
      #{planAttemptId}
    </EuiBadge>
  )
}

export default StackConfigurationChangeId
