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
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiSpacer,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import {
  AdvancedForm,
  RestoreButton,
  RestoreResult,
  initialState as initialRestoreSnapshotState,
  hasRestoreResult,
  Props as RestoreSnapshotProps,
  State as RestoreSnapshotState,
} from '../../../RestoreSnapshot'

import { clusterSnapshotUrl } from '../../../../lib/urlBuilder'

import { ClusterSnapshot } from '../../../../types'

type Props = RestoreSnapshotProps & {
  regionId: string
  clusterId: string
  deploymentRouteId: string
  snapshot: ClusterSnapshot
}

type State = {
  restoreFlyoutOpen: boolean
  restoreForm: RestoreSnapshotState
}

const messages = defineMessages({
  restoreSnapshot: {
    id: `snapshot-restore-flyout.restore-snapshot`,
    defaultMessage: `Restore snapshot {snapshot}`,
  },
})

class SnapshotRestoreFlyout extends Component<Props & WrappedComponentProps, State> {
  state: State = {
    restoreFlyoutOpen: false,
    restoreForm: cloneDeep(initialRestoreSnapshotState),
  }

  render() {
    const {
      intl: { formatMessage },
      deploymentRouteId,
      onBeforeRestore,
      restore,
      restoreSnapshot,
      restoreSnapshotRequest,
      snapshot,
    } = this.props

    const { restoreFlyoutOpen, restoreForm } = this.state

    const { matchPattern, renamePattern, specifyIndices } = restoreForm

    const tooltip = formatMessage(messages.restoreSnapshot, { snapshot: snapshot.snapshot })

    return (
      <div data-test-id='restore-snapshot-wrapper'>
        <EuiToolTip content={tooltip}>
          <EuiButton
            size='s'
            onClick={this.openRestoreFlyout}
            aria-label={tooltip}
            data-test-id='open-restore-snapshot-flyout'
          >
            <FormattedMessage
              id='snapshot-restore-flyout.restore-button'
              defaultMessage='Restore'
            />
          </EuiButton>
        </EuiToolTip>

        {restoreFlyoutOpen && (
          <EuiFlyout
            size='s'
            onClose={this.closeRestoreFlyout}
            ownFocus={true}
            data-test-id='restore-snapshot-flyout'
          >
            <EuiFlyoutHeader>
              <EuiTitle>
                <h2>
                  <CuiLink to={clusterSnapshotUrl(deploymentRouteId, snapshot.snapshot)}>
                    {snapshot.snapshot}
                  </CuiLink>
                </h2>
              </EuiTitle>
            </EuiFlyoutHeader>

            <EuiFlyoutBody>
              <AdvancedForm
                specifyIndices={specifyIndices}
                matchPattern={matchPattern}
                renamePattern={renamePattern}
                snapshot={snapshot}
                onChange={(nextState: RestoreSnapshotState) => {
                  this.setState({ restoreForm: nextState })
                }}
              />
            </EuiFlyoutBody>

            <EuiFlyoutFooter>
              <EuiFlexGroup gutterSize='m'>
                <EuiFlexItem grow={false}>
                  <RestoreButton
                    restoreSnapshot={restoreSnapshot}
                    restoreSnapshotRequest={restoreSnapshotRequest}
                    onBeforeRestore={onBeforeRestore}
                    specifyIndices={specifyIndices}
                    matchPattern={matchPattern}
                    renamePattern={renamePattern}
                    snapshot={snapshot}
                  />
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    iconType='cross'
                    onClick={this.closeRestoreFlyout}
                    data-test-id='close-snapshot-restore-flyout'
                  >
                    <FormattedMessage id='snapshot-restore-flyout.cancel' defaultMessage='Cancel' />
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>

              {hasRestoreResult({
                restore,
                restoreSnapshotRequest,
              }) && (
                <Fragment>
                  <EuiSpacer size='m' />

                  <RestoreResult
                    restore={restore}
                    restoreSnapshotRequest={restoreSnapshotRequest}
                  />
                </Fragment>
              )}
            </EuiFlyoutFooter>
          </EuiFlyout>
        )}
      </div>
    )
  }

  openRestoreFlyout = () => {
    this.setState({ restoreFlyoutOpen: true })
  }

  closeRestoreFlyout = () => {
    const { resetRestoreSnapshot } = this.props

    this.setState({ restoreFlyoutOpen: false, restoreForm: cloneDeep(initialRestoreSnapshotState) })

    if (resetRestoreSnapshot) {
      resetRestoreSnapshot()
    }
  }
}

export default injectIntl(SnapshotRestoreFlyout)
