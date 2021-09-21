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
import { isEmpty } from 'lodash'

import { EuiFlexGroup, EuiFlexItem, EuiButton } from '@elastic/eui'

import CreateDeploymentButton from './CreateDeploymentButton'

import { validateIndexCuration, getCurationFields } from '../../../lib/stackDeployments'

import { AsyncRequestState, StackDeploymentCreateRequest } from '../../../types'

type Props = {
  createStackDeploymentRequest: AsyncRequestState
  editorState: StackDeploymentCreateRequest
  goToConfigureDeployment: () => void
  skippedCuration: boolean
  disabled?: boolean
}

const BottomNavForConfigureIndexManagement: FunctionComponent<Props> = ({
  disabled,
  createStackDeploymentRequest,
  editorState,
  goToConfigureDeployment,
  skippedCuration,
}) => {
  const { deployment } = editorState
  const fields = getCurationFields({
    deployment,
  })
  const fieldErrors = validateIndexCuration(fields)
  const disabledCreate = !skippedCuration && !isEmpty(fieldErrors)

  return (
    <EuiFlexGroup style={{ flexDirection: `row` }}>
      <EuiFlexItem grow={false}>
        <EuiButton
          onClick={goToConfigureDeployment}
          iconType='arrowLeft'
          disabled={disabled || createStackDeploymentRequest.inProgress}
        >
          <FormattedMessage
            id='create-deployment-from-template.customize-deployment'
            defaultMessage='Customize deployment'
          />
        </EuiButton>
      </EuiFlexItem>

      <CreateDeploymentButton
        disabled={disabled || disabledCreate}
        editorState={editorState}
        hasIndexCuration={true}
      />
    </EuiFlexGroup>
  )
}

export default BottomNavForConfigureIndexManagement
