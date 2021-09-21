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

import { EuiFormHelpText, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import DangerButton from '../../DangerButton'
import FormGroup from '../../FormGroup'

import { AsyncRequestState } from '../../../types'

type Props = {
  canToggleClusterLock: boolean
  isLocked: boolean
  setClusterLock: (enabled: boolean) => Promise<any>
  setClusterLockRequest: AsyncRequestState
  resetClusterLock: () => void
}

class ClusterLocking extends Component<Props> {
  componentWillUnmount() {
    this.props.resetClusterLock()
  }

  render() {
    const { canToggleClusterLock, isLocked, setClusterLock, setClusterLockRequest } = this.props

    if (!canToggleClusterLock) {
      return null
    }

    return (
      <Fragment>
        <FormGroup
          label={
            <FormattedMessage
              id='cluster-operations-cluster-locking.title'
              defaultMessage='Cluster locking'
            />
          }
        >
          <EuiSpacer size='s' />

          <DangerButton
            color='warning'
            iconType={isLocked ? `lockOpen` : `lock`}
            requiresSudo={true}
            spin={setClusterLockRequest.inProgress}
            onConfirm={() => setClusterLock(!isLocked)}
            modal={
              isLocked
                ? {
                    title: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.unlock-title'
                        defaultMessage='Unlock this deployment?'
                      />
                    ),
                    body: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.unlock-body'
                        defaultMessage='Unlocking the deployment allows users to initiate configuration changes.'
                      />
                    ),
                    confirmButtonText: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.unlock-confirm'
                        defaultMessage='Unlock'
                      />
                    ),
                  }
                : {
                    title: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.lock-title'
                        defaultMessage='Lock this deployment?'
                      />
                    ),
                    body: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.lock-body'
                        defaultMessage='Locking the deployment prevents users from initiating configuration changes.'
                      />
                    ),
                    confirmButtonText: (
                      <FormattedMessage
                        id='cluster-operations-cluster-locking.lock-confirm'
                        defaultMessage='Lock'
                      />
                    ),
                  }
            }
          >
            {isLocked ? (
              <FormattedMessage
                id='cluster-operations-cluster-locking.turn-off'
                defaultMessage='Unlock'
              />
            ) : (
              <FormattedMessage
                id='cluster-operations-cluster-locking.turn-on'
                defaultMessage='Lock'
              />
            )}
          </DangerButton>

          <EuiFormHelpText>
            <FormattedMessage
              id='cluster-operations-cluster-locking.description'
              defaultMessage="When a deployment is locked, users can't initiate configuration changes."
            />
          </EuiFormHelpText>

          {setClusterLockRequest.error && (
            <Fragment>
              <EuiSpacer size='m' />
              <CuiAlert type='error'>{setClusterLockRequest.error}</CuiAlert>
            </Fragment>
          )}
        </FormGroup>
      </Fragment>
    )
  }
}

export default ClusterLocking
