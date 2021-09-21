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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiHorizontalRule, EuiSpacer, EuiTitle } from '@elastic/eui'

import AdvancedForm from './AdvancedForm'
import RestoreButton from './RestoreButton'
import RestoreResult, { hasRestoreResult } from './RestoreResult'

import { AsyncRequestState, RestorePayload } from '../../types'

import messages from './messages'

import { State } from './types'

export interface Props {
  onBeforeRestore?: (payload: RestorePayload) => void
  resetRestoreSnapshot?: () => void
  restore?: { success: boolean; raw: any } | null
  restoreSnapshot?: (payload: RestorePayload) => void
  restoreSnapshotRequest?: AsyncRequestState
  snapshot: boolean
}

export { State } from './types'

export const initialState: State = {
  matchPattern: ``,
  renamePattern: ``,
  specifyIndices: ``,
}

export { AdvancedForm, RestoreButton, RestoreResult, hasRestoreResult }

class RestoreSnapshot extends Component<Props, State> {
  state: State = initialState

  componentWillUnmount() {
    const { resetRestoreSnapshot } = this.props

    if (resetRestoreSnapshot) {
      resetRestoreSnapshot()
    }
  }

  render() {
    const { onBeforeRestore, restore, restoreSnapshot, restoreSnapshotRequest, snapshot } =
      this.props

    const { matchPattern, renamePattern, specifyIndices } = this.state

    return (
      <Fragment>
        <EuiHorizontalRule />

        <EuiTitle size='m'>
          <h2>
            <FormattedMessage {...messages.label} />
          </h2>
        </EuiTitle>

        <EuiSpacer size='s' />

        <AdvancedForm
          specifyIndices={specifyIndices}
          matchPattern={matchPattern}
          renamePattern={renamePattern}
          snapshot={snapshot}
          onChange={(changes: State) => {
            this.setState(changes)
          }}
        />

        <EuiSpacer size='m' />

        <span className='restore-button' data-test-id='restore-button'>
          <RestoreButton
            restoreSnapshot={restoreSnapshot}
            restoreSnapshotRequest={restoreSnapshotRequest}
            onBeforeRestore={onBeforeRestore}
            specifyIndices={specifyIndices}
            matchPattern={matchPattern}
            renamePattern={renamePattern}
            snapshot={snapshot}
          />
        </span>

        {hasRestoreResult({
          restore,
          restoreSnapshotRequest,
        }) && (
          <Fragment>
            <EuiSpacer size='m' />

            <RestoreResult restore={restore} restoreSnapshotRequest={restoreSnapshotRequest} />
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default RestoreSnapshot
