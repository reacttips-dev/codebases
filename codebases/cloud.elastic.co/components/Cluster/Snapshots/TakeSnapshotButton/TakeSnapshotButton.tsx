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

import { CuiPermissibleControl } from '../../../../cui'

import SpinButton from '../../../SpinButton'

import Permission from '../../../../lib/api/v1/permissions'

import { AllProps } from './types'

class TakeSnapshotButton extends Component<AllProps> {
  componentWillUnmount() {
    this.props.resetTakeSnapshotRequest()
  }

  render() {
    const {
      takeSnapshot,
      takeSnapshotRequest,
      children,
      onSnapshotTaken,
      fill = true,
      ...rest
    } = this.props

    return (
      <CuiPermissibleControl permissions={Permission.snapshotEsCluster}>
        <SpinButton
          data-test-id='es-snapshot-take-now-btn'
          fill={fill}
          requiresSudo={true}
          onClick={() => {
            takeSnapshot().then(({ payload }) => {
              if (onSnapshotTaken) {
                // SLM response is `snapshot_name`; legacy is just `name`.
                onSnapshotTaken({ snapshotName: payload.snapshot_name || payload.name })
              }
            })
          }}
          spin={takeSnapshotRequest.inProgress}
          {...rest}
        >
          {children || (
            <FormattedMessage id='take-snapshot-button' defaultMessage='Take snapshot now' />
          )}
        </SpinButton>
      </CuiPermissibleControl>
    )
  }
}

export default TakeSnapshotButton
