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
import { FormattedMessage } from 'react-intl'

import { CuiDuration } from '../../../../cui'

import { parseWeirdApiTimeObject } from '../../../../lib/weirdTime'

import { DeploymentSnapshotState } from '../../../../types'

type Props = {
  snapshotSettings: DeploymentSnapshotState | null
}

const SnapshotFrequency: FunctionComponent<Props> = ({ snapshotSettings }) => {
  if (!snapshotSettings) {
    return <span>—</span>
  }

  if (snapshotSettings.enabled === false) {
    return (
      <FormattedMessage
        id='deployment-snapshots-status.snapshots-disabled'
        defaultMessage='Disabled'
      />
    )
  }

  const { value, unit } = snapshotSettings.interval
  const { ms } = parseWeirdApiTimeObject({ value, unit })

  return <CuiDuration milliseconds={ms} showTooltip={false} />
}

export default SnapshotFrequency
