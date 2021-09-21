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

import { CuiAlert, CuiCodeBlock } from '../../cui'

import { AsyncRequestState } from '../../types'

import messages from './messages'

type Props = {
  restore?: { success: boolean; raw: any } | null
  restoreSnapshotRequest?: AsyncRequestState
}

const RestoreResult: FunctionComponent<Props> = ({ restore, restoreSnapshotRequest }) => {
  if (restoreSnapshotRequest && restoreSnapshotRequest.error) {
    return <CuiAlert type='error'>{restoreSnapshotRequest.error}</CuiAlert>
  }

  if (!restore) {
    return null
  }

  if (restore.success) {
    return (
      <CuiAlert type='success'>
        <FormattedMessage {...messages.requestSuccessful} />
      </CuiAlert>
    )
  }

  return (
    <CuiAlert type='error'>
      <FormattedMessage
        {...messages.requestUnsuccessful}
        values={{
          response: (
            <CuiCodeBlock language='json'>{JSON.stringify(restore.raw, null, 2)}</CuiCodeBlock>
          ),
        }}
      />
    </CuiAlert>
  )
}

export function hasRestoreResult({
  restore,
  restoreSnapshotRequest,
}: {
  restore?: { success: boolean; raw: any } | null
  restoreSnapshotRequest?: AsyncRequestState
}): boolean {
  if (restoreSnapshotRequest && restoreSnapshotRequest.error) {
    return true
  }

  return Boolean(restore)
}

export default RestoreResult
