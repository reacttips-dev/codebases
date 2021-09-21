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
import { defineMessages, IntlShape, injectIntl, FormattedMessage } from 'react-intl'
import { filter } from 'lodash'

import {
  EuiFormControlLayout,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiHealth,
  EuiSpacer,
  EuiFormLabel,
} from '@elastic/eui'

import RestoreFromSnapshot from './RestoreFromSnapshot'

import { getSnapshotHealthColor } from '../../../../../../Cluster/Snapshots/SnapshotHealth'

import {
  ClusterSnapshot,
  AsyncRequestState,
  ElasticsearchCluster,
} from '../../../../../../../types'

type Props = {
  fetchSnapshotsRequest: AsyncRequestState | null
  intl: IntlShape
  onSelectSnapshot?: (snapshot: ClusterSnapshot | null, id: string) => void
  selectedDeployment: ElasticsearchCluster | null
  asRestoreForm?: boolean
  searchResults?: ClusterSnapshot[] | null
  onRestoreSnapshot?: (payload: unknown) => void
  restoreSnapshotRequest?: AsyncRequestState
  onUpdateIndexRestore?: (payload: unknown) => void
  selectedSnapshot?: string
}

const messages = defineMessages({
  placeholder: {
    id: `snapshot-restore-from-remote.placeholder-latest-success`,
    defaultMessage: `Select snapshot (optional)`,
  },
  buttonMessage: {
    id: `snapshot-restore-from-remote.button`,
    defaultMessage: `restore snapshot`,
  },
})

class SelectSnapshot extends Component<Props> {
  render() {
    const {
      fetchSnapshotsRequest,
      intl: { formatMessage },
      onRestoreSnapshot,
      restoreSnapshotRequest,
      onUpdateIndexRestore,
      asRestoreForm = true,
      selectedSnapshot,
      selectedDeployment,
    } = this.props

    const { options, selectedOptions } = this.buildOptions()

    return (
      <Fragment>
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <EuiFormLabel style={{ width: `180px` }}>
              <FormattedMessage defaultMessage='Snapshot' id='select-snapshot-label' />
            </EuiFormLabel>
          }
        >
          <EuiComboBox
            fullWidth={true}
            isDisabled={selectedDeployment == null}
            async={true}
            isLoading={fetchSnapshotsRequest !== null && fetchSnapshotsRequest.inProgress}
            onChange={([selectedOption]) => this.onSelectSnapshot(selectedOption)}
            options={options}
            selectedOptions={selectedOptions}
            placeholder={formatMessage(messages.placeholder)}
            singleSelection={{ asPlainText: true }}
            renderOption={this.renderSnapshot}
            data-test-id='select-snapshot-combo'
          />
        </EuiFormControlLayout>

        <EuiSpacer size='s' />

        {asRestoreForm && (
          <RestoreFromSnapshot
            snapshot={Boolean(selectedSnapshot)}
            restoreSnapshot={onRestoreSnapshot}
            restoreSnapshotRequest={restoreSnapshotRequest}
            onBeforeRestore={onUpdateIndexRestore}
          />
        )}
      </Fragment>
    )
  }

  renderSnapshot = (snapshot) => (
    <EuiHealth color={getSnapshotHealthColor({ state: snapshot.state })}>
      {snapshot.label}
    </EuiHealth>
  )

  onSelectSnapshot(selectedOption) {
    const { selectedDeployment, onSelectSnapshot } = this.props

    if (!selectedDeployment) {
      return
    }

    const { id } = selectedDeployment

    if (onSelectSnapshot) {
      onSelectSnapshot(selectedOption as ClusterSnapshot, id)
    }
  }

  buildOptions() {
    const { searchResults, selectedSnapshot } = this.props

    if (searchResults == null) {
      return {
        options: [],
        selectedOptions: [],
      }
    }

    const successfulSnapshots = filter(searchResults, (el) => el.state === `SUCCESS`)

    const options: Array<EuiComboBoxOptionOption<ClusterSnapshot>> = successfulSnapshots.map(
      (el) => ({
        ...el,
        label: el.snapshot,
      }),
    )

    const selectedOptions = getSelectedOptions()

    return {
      options,
      selectedOptions,
    }

    function getSelectedOptions() {
      if (!selectedSnapshot) {
        return []
      }

      return options.filter((option) => option.label === selectedSnapshot)
    }
  }
}

export default injectIntl(SelectSnapshot)
