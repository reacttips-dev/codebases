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

import { cloneDeep } from 'lodash'

import React, { Component, Fragment } from 'react'

import { EuiSpacer } from '@elastic/eui'

import {
  AdvancedForm,
  RestoreButton,
  initialState,
  Props as RestoreSnapshotProps,
  State as RestoreSnapshotState,
} from '../../../../../../RestoreSnapshot'

class RestoreFromSnapshot extends Component<RestoreSnapshotProps, RestoreSnapshotState> {
  state: RestoreSnapshotState = cloneDeep(initialState)

  render() {
    const { onBeforeRestore, restoreSnapshot, restoreSnapshotRequest, snapshot } = this.props

    const { matchPattern, renamePattern, specifyIndices } = this.state

    return (
      <Fragment>
        <EuiSpacer size='s' />

        <AdvancedForm
          specifyIndices={specifyIndices}
          matchPattern={matchPattern}
          renamePattern={renamePattern}
          snapshot={snapshot}
          onChange={(changes: RestoreSnapshotState) => this.setState(changes)}
        />

        <EuiSpacer size='m' />

        <RestoreButton
          restoreSnapshot={restoreSnapshot}
          restoreSnapshotRequest={restoreSnapshotRequest}
          onBeforeRestore={onBeforeRestore}
          specifyIndices={specifyIndices}
          matchPattern={matchPattern}
          renamePattern={renamePattern}
          snapshot={snapshot}
        />
      </Fragment>
    )
  }
}

export default RestoreFromSnapshot
