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

import SpinButton from '../../SpinButton'

import { AsyncRequestState } from '../../../types'

type Props = {
  save: () => void
  updateStackDeploymentRequest: AsyncRequestState
  disabled: boolean
}

const SaveButton: FunctionComponent<Props> = ({ save, updateStackDeploymentRequest, disabled }) => (
  <SpinButton
    data-test-id='editDeployment-submitBtn'
    disabled={disabled}
    color='primary'
    fill={true}
    requiresSudo={true}
    onClick={save}
    spin={updateStackDeploymentRequest.inProgress}
  >
    <FormattedMessage id='edit-cluster-simple.save-changes' defaultMessage='Save changes' />
  </SpinButton>
)

export default SaveButton
