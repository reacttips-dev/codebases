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

import jif from 'jif'
import moment from 'moment'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiDatePicker,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'
import Permission from '../../../lib/api/v1/permissions'

import SpinButton from '../../SpinButton'
import FormGroup from '../../FormGroup'

import ZipInspectorModal from '../../ZipInspectorModal'
import { AsyncRequestState } from '../../../types'
import { AjaxResult } from '../../../lib/ajax'

export interface StateProps {
  clusterLogs?: AjaxResult
  isEnabled: boolean
  downloadClusterLogsRequest: AsyncRequestState
}

export interface ConsumerProps {
  regionId: string
  clusterId: string
  downloadClusterLogs: (regionId: string, clusterId: string, date: Date) => void
  resetDownloadClusterLogsRequest: (regionId: string, clusterId: string) => void
}

export interface State {}

export type Props = StateProps & ConsumerProps

class ClusterLogs extends Component<Props> {
  state = {
    date: moment(),
    inspecting: false,
  }

  componentWillUnmount() {
    this.resetDownloadRequest()
  }

  render() {
    const {
      downloadClusterLogs,
      downloadClusterLogsRequest,
      regionId,
      clusterId,
      isEnabled,
      clusterLogs,
    } = this.props

    const { inspecting } = this.state

    if (!isEnabled) {
      return null
    }

    const { date } = this.state
    const filename = this.getFilename()

    return (
      <FormGroup label={<FormattedMessage id='cluster-logs.title' defaultMessage='Logs' />}>
        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <EuiDatePicker
              data-test-subj='cluster-logs.date-picker'
              selected={date}
              onChange={(nextDate) => {
                this.resetDownloadRequest()
                this.setState({ date: nextDate })
              }}
              minDate={moment().subtract(7, 'days')}
              maxDate={moment()}
            />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <CuiPermissibleControl permissions={Permission.generateEsClusterLogs}>
              <SpinButton
                color='primary'
                onClick={() => downloadClusterLogs(regionId, clusterId, date.toDate())}
                disabled={downloadClusterLogsRequest.isDone}
                spin={downloadClusterLogsRequest.inProgress}
              >
                <FormattedMessage id='cluster-logs.prepare' defaultMessage='Prepare logs' />
              </SpinButton>
            </CuiPermissibleControl>
          </EuiFlexItem>

          {this.renderActions()}
        </EuiFlexGroup>

        {jif(downloadClusterLogsRequest.error, () => (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error'>{downloadClusterLogsRequest.error}</CuiAlert>
          </Fragment>
        ))}

        {inspecting && (
          <ZipInspectorModal
            title={
              <FormattedMessage id='cluster-logs.inspector-title' defaultMessage='Cluster logs' />
            }
            close={this.stopInspecting}
            zip={clusterLogs}
            filename={filename}
          />
        )}
      </FormGroup>
    )
  }

  renderActions() {
    const { clusterLogs } = this.props

    if (!clusterLogs) {
      return null
    }

    const filename = this.getFilename()

    const downloadButton = (
      // eslint-disable-next-line @elastic/eui/href-or-on-click
      <EuiButtonEmpty
        data-test-subj='cluster-logs.download-button'
        href={clusterLogs.blobUrl}
        download={filename}
        onClick={() => this.resetDownloadRequest()}
      >
        <FormattedMessage id='cluster-logs.download' defaultMessage='Download' />
      </EuiButtonEmpty>
    )

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiButton iconType='eye' onClick={() => this.inspect()}>
            <FormattedMessage id='cluster-logs.inspect' defaultMessage='Open inspector' />
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>{downloadButton}</EuiFlexItem>
      </Fragment>
    )
  }

  getFilename() {
    const { clusterId } = this.props
    return `logs-${clusterId.slice(0, 6)}-${moment().format(`YYYY-MMM-DD--HH_mm_ss`)}.zip`
  }

  resetDownloadRequest() {
    const { regionId, clusterId, resetDownloadClusterLogsRequest } = this.props
    resetDownloadClusterLogsRequest(regionId, clusterId)
  }

  inspect = () => {
    this.setState({ inspecting: true })
  }

  stopInspecting = () => {
    this.setState({ inspecting: false })
  }
}

export default ClusterLogs
