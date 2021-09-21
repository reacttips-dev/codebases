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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'lodash'

import { CuiPermissibleControl } from '../../cui'

import DangerButton from '../DangerButton'

import getValidationErrors from './lib/getValidationErrors'

import Permission from '../../lib/api/v1/permissions'

import { AsyncRequestState, RestorePayload } from '../../types'

import messages from './messages'

type Props = {
  matchPattern: string
  onBeforeRestore?: (payload: RestorePayload) => void
  renamePattern: string
  restoreSnapshot?: (payload: RestorePayload) => void
  restoreSnapshotRequest?: AsyncRequestState
  snapshot: boolean
  specifyIndices: string
}

export default class RestoreButton extends Component<Props> {
  render() {
    const { snapshot, restoreSnapshotRequest } = this.props

    return (
      <CuiPermissibleControl permissions={Permission.postEsProxyRequests}>
        <DangerButton
          data-test-id='restore-snapshot-button'
          disabled={!snapshot}
          fill={true}
          isBusy={restoreSnapshotRequest && restoreSnapshotRequest.inProgress}
          modal={{
            title: <FormattedMessage {...messages.confirmButton} />,
          }}
          isConfirmDisabled={this.isConfirmDisabled}
          onConfirm={this.onRestore}
        >
          <FormattedMessage {...messages.restoreButton} />
        </DangerButton>
      </CuiPermissibleControl>
    )
  }

  isConfirmDisabled = (): boolean => {
    const { onBeforeRestore } = this.props
    const payload = this.getPayload()

    if (payload === null) {
      return false
    }

    if (onBeforeRestore) {
      return Boolean(onBeforeRestore(payload))
    }

    return false
  }

  onRestore = () => {
    const { restoreSnapshot } = this.props
    const payload = this.getPayload()

    if (payload === null) {
      return
    }

    if (restoreSnapshot) {
      restoreSnapshot(payload)
    }
  }

  getPayload() {
    const { specifyIndices, matchPattern, renamePattern, snapshot } = this.props

    if (!snapshot) {
      return null
    }

    const errors = getValidationErrors({
      snapshot,
      matchPattern,
      renamePattern,
    })

    if (!isEmpty(errors)) {
      return null
    }

    const specifyIndicesInput = specifyIndices.replace(/\s+/g, ``)
    const payload: RestorePayload = {}

    if (!isEmpty(specifyIndicesInput)) {
      payload.indices = specifyIndicesInput
    }

    if (matchPattern) {
      payload.rename_pattern = matchPattern
      payload.rename_replacement = renamePattern
    }

    return payload
  }
}
