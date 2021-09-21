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

import { EuiFlexGroup, EuiFlexItem, EuiButton, EuiButtonEmpty } from '@elastic/eui'

import CreateDeploymentButton from './CreateDeploymentButton'

import { couldHaveCuration } from '../../../lib/stackDeployments/indexManagement'

import { AsyncRequestState, StackDeploymentCreateRequest } from '../../../types'

type Props = {
  disabled?: boolean
  createStackDeploymentRequest: AsyncRequestState
  editorState: StackDeploymentCreateRequest
  goToSelectTemplate: () => void
  goToIndexCuration: () => void
}

const BottomNavForConfigureDeployment: FunctionComponent<Props> = ({
  disabled,
  editorState,
  goToSelectTemplate,
  goToIndexCuration,
  createStackDeploymentRequest,
}) => (
  <EuiFlexGroup justifyContent='flexEnd'>
    <EuiFlexItem grow={false}>
      <EuiButtonEmpty
        onClick={goToSelectTemplate}
        disabled={disabled || createStackDeploymentRequest.inProgress}
      >
        <FormattedMessage
          id='create-deployment-from-template.select-template'
          defaultMessage='Back'
        />
      </EuiButtonEmpty>
    </EuiFlexItem>

    {couldHaveCuration({ deployment: editorState.deployment }) ? (
      <EuiFlexItem grow={false}>
        <EuiButton
          data-test-id='navigate-index-management'
          iconType='arrowRight'
          iconSide='right'
          onClick={goToIndexCuration}
          disabled={disabled}
          fill={true}
        >
          <FormattedMessage
            id='create-deployment-from-template.configure-index-curation'
            defaultMessage='Configure index management'
          />
        </EuiButton>
      </EuiFlexItem>
    ) : (
      <CreateDeploymentButton showApiRequest={true} disabled={disabled} editorState={editorState} />
    )}
  </EuiFlexGroup>
)

export default BottomNavForConfigureDeployment
