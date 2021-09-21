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

import moment from 'moment'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiButton, EuiButtonEmpty, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import SpinButton from '../../SpinButton'
import FormGroup from '../../FormGroup'

import ZipInspectorModal from '../../ZipInspectorModal'

class ClusterDiagnosticBundle extends Component {
  state = {
    inspecting: false,
  }

  componentWillUnmount() {
    this.resetDownloadRequest()
  }

  render() {
    const {
      downloadClusterDiagnosticBundle,
      downloadClusterDiagnosticBundleRequest,
      regionId,
      clusterId,
      clusterDiagnosticBundle,
    } = this.props

    const { inspecting } = this.state

    const filename = this.getFilename()

    return (
      <FormGroup
        label={
          <FormattedMessage
            id='cluster-diagnostic-bundle.title'
            defaultMessage='Diagnostic bundle'
          />
        }
      >
        <EuiSpacer size='s' />

        <EuiFlexGroup gutterSize='m'>
          <EuiFlexItem grow={false}>
            <SpinButton
              color='primary'
              size='s'
              onClick={() => downloadClusterDiagnosticBundle(regionId, clusterId)}
              disabled={downloadClusterDiagnosticBundleRequest.isDone}
              spin={downloadClusterDiagnosticBundleRequest.inProgress}
            >
              <FormattedMessage
                id='cluster-diagnostic-bundle.prepare'
                defaultMessage='Prepare diagnostic bundle'
              />
            </SpinButton>
          </EuiFlexItem>

          {this.renderActions()}
        </EuiFlexGroup>

        {downloadClusterDiagnosticBundleRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error'>{downloadClusterDiagnosticBundleRequest.error}</CuiAlert>
          </Fragment>
        )}

        {inspecting && (
          <ZipInspectorModal
            title={
              <FormattedMessage
                id='cluster-diagnostic-bundle.inspector-title'
                defaultMessage='Diagnostic bundle'
              />
            }
            close={this.stopInspecting}
            zip={clusterDiagnosticBundle}
            filename={filename}
          />
        )}
      </FormGroup>
    )
  }

  renderActions() {
    const { clusterDiagnosticBundle } = this.props

    if (!clusterDiagnosticBundle) {
      return null
    }

    const filename = this.getFilename()

    const downloadButton = (
      // eslint-disable-next-line @elastic/eui/href-or-on-click
      <EuiButtonEmpty
        size='s'
        href={clusterDiagnosticBundle.blobUrl}
        download={filename}
        onClick={() => this.resetDownloadRequest()}
      >
        <FormattedMessage id='cluster-diagnostic-bundle.download' defaultMessage='Download' />
      </EuiButtonEmpty>
    )

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiButton size='s' iconType='eye' onClick={() => this.inspect()}>
            <FormattedMessage
              id='cluster-diagnostic-bundle.inspect'
              defaultMessage='Open inspector'
            />
          </EuiButton>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>{downloadButton}</EuiFlexItem>
      </Fragment>
    )
  }

  getFilename() {
    const { clusterId } = this.props
    return `diagnostic-${clusterId.slice(0, 6)}-${moment().format(`YYYY-MMM-DD--HH_mm_ss`)}.zip`
  }

  resetDownloadRequest() {
    const { regionId, clusterId, resetDownloadClusterDiagnosticBundleRequest } = this.props
    resetDownloadClusterDiagnosticBundleRequest(regionId, clusterId)
  }

  inspect = () => {
    this.setState({ inspecting: true })
  }

  stopInspecting = () => {
    this.setState({ inspecting: false })
  }
}

export default ClusterDiagnosticBundle
