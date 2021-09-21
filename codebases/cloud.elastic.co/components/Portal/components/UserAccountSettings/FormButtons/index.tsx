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
import { EuiButtonEmpty, EuiFlexItem, EuiFlexGroup } from '@elastic/eui'
import SpinButton from '../../../../SpinButton'

interface Props {
  disableSubmit: boolean
  inProgress: boolean
  onSubmit: () => void
  onCancel: () => void
}

const FormButtons: FunctionComponent<Props> = ({
  disableSubmit,
  inProgress,
  onSubmit,
  onCancel,
}) => (
  <EuiFlexGroup style={{ maxWidth: 300, marginTop: 0 }} gutterSize='s'>
    <EuiFlexItem grow={2}>
      <SpinButton
        disabled={disableSubmit}
        color='primary'
        fill={true}
        onClick={onSubmit}
        spin={inProgress}
      >
        <FormattedMessage id='user-settings-profile-save-changes' defaultMessage='Save' />
      </SpinButton>
    </EuiFlexItem>
    <EuiFlexItem grow={3}>
      <EuiButtonEmpty onClick={onCancel} flush='left' isDisabled={inProgress}>
        <FormattedMessage
          id='user-settings-profile-discard-changes'
          defaultMessage='Discard changes'
        />
      </EuiButtonEmpty>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default FormButtons
