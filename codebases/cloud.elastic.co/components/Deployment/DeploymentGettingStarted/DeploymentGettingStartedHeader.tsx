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

import { EuiFlexItem, EuiFlexGroup, EuiButton } from '@elastic/eui'

import StackDeploymentHealthProblems from '../../StackDeploymentHealthProblems'
import DeploymentCompletedMessage from '../../StackDeploymentActivity/DeploymentCompletedMessage'
import DeploymentFailedMessage from '../../StackDeploymentActivity/DeploymentFailedMessage'

import { deploymentUrl } from '../../../lib/urlBuilder'
import history from '../../../lib/history'

import { StackDeployment } from '../../../types'

import './deploymentGettingStarted.scss'

export type Props = {
  createFailed: boolean
  planInProgress: boolean
  showDeploymentCompletedMessage: boolean
  stackDeployment: StackDeployment
  deepLink: string | null
  disabled: boolean
}

const DeploymentGettingStartedHeader: FunctionComponent<Props> = ({
  planInProgress,
  stackDeployment,
  createFailed,
  showDeploymentCompletedMessage,
  deepLink,
  disabled,
}) => (
  <EuiFlexGroup responsive={false}>
    {planInProgress && !createFailed && (
      <EuiFlexItem grow={8} style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
        <StackDeploymentHealthProblems
          onGettingStartedPage={true}
          deployment={stackDeployment!}
          spacerAfter={false}
          linkRecentChanges={true}
          hideActivityBits={true}
        />
      </EuiFlexItem>
    )}
    {showDeploymentCompletedMessage && (
      <EuiFlexItem grow={8} style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
        <DeploymentCompletedMessage />
      </EuiFlexItem>
    )}

    {createFailed && (
      <EuiFlexItem grow={8}>
        <DeploymentFailedMessage />
      </EuiFlexItem>
    )}

    <EuiFlexItem grow={2} style={{ justifyContent: 'right' }}>
      <div style={{ textAlign: 'center' }}>
        {!deepLink ? (
          <EuiButton
            color='primary'
            isDisabled={disabled || planInProgress}
            onClick={() => history.replace(deploymentUrl(stackDeployment.id))}
            fill={true}
            data-test-id='deployment-waiting-experience.overview-button'
          >
            <FormattedMessage
              id='deployment-waiting-experience.continue.no-deep-link'
              defaultMessage='Continue'
            />
          </EuiButton>
        ) : (
          <EuiButton
            color='primary'
            isDisabled={disabled || planInProgress}
            href={deepLink}
            fill={true}
            data-test-id='continue-button'
          >
            <FormattedMessage
              id='deployment-waiting-experience.continue.deep-link'
              defaultMessage='Continue'
            />
          </EuiButton>
        )}
      </div>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default DeploymentGettingStartedHeader
