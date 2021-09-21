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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiButtonEmpty } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import CreateDeploymentButton from './CreateDeploymentButton'

import { AsyncRequestState, StackDeploymentCreateRequest } from '../../../types'

type Props = {
  disabled?: boolean
  createStackDeploymentRequest: AsyncRequestState
  editorState: StackDeploymentCreateRequest
  goToConfigureDeployment: () => void
  showConfigureButton: boolean
}

const BottomNavForSelectTemplate: FunctionComponent<Props> = ({
  disabled,
  editorState,
  goToConfigureDeployment,
  createStackDeploymentRequest,
  showConfigureButton,
}) => (
  <Fragment>
    <EuiFlexGroup>
      {showConfigureButton && (
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty
            onClick={goToConfigureDeployment}
            disabled={disabled}
            data-test-id='navigate-configure-deployment'
          >
            <FormattedMessage
              id='create-deployment-from-template.advanced-settings'
              defaultMessage='Advanced settings'
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      )}

      <CreateDeploymentButton
        showApiRequest={true}
        disabled={disabled}
        editorState={editorState}
        filterIngestPlugins={true}
      />
    </EuiFlexGroup>

    {createStackDeploymentRequest.error && (
      <EuiFlexGroup>
        <EuiFlexItem>
          <CuiAlert type='error'>{createStackDeploymentRequest.error}</CuiAlert>
        </EuiFlexItem>
      </EuiFlexGroup>
    )}
  </Fragment>
)

export default BottomNavForSelectTemplate
