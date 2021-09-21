/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
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

import React, { FunctionComponent, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiButtonEmpty, EuiFieldText, EuiForm, EuiFormRow, EuiFormRowProps } from '@elastic/eui'

import { CuiButton } from '../../cui'

import messages from './messages'

import { AsyncRequestState } from '../../types'

type Props = {
  onChange: (e: React.SyntheticEvent) => void
  onNext: () => void
  keyNameInvalid: boolean
  errors: EuiFormRowProps['error']
}

type FooterProps = {
  onCancel: () => void
  onNext: () => void
  generateKeyRequest: AsyncRequestState
}

export const GenerateKeyForm: FunctionComponent<Props> = ({
  errors,
  keyNameInvalid,
  onChange,
  onNext,
}) => {
  const helpText = !keyNameInvalid ? <FormattedMessage {...messages.keyNameHelpText} /> : null

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onNext()
    }
  }

  return (
    <EuiForm>
      <EuiFormRow
        helpText={helpText}
        error={errors}
        isInvalid={keyNameInvalid}
        label='API key name'
      >
        <EuiFieldText
          name='newKeyName'
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => onChange(e)}
        />
      </EuiFormRow>
    </EuiForm>
  )
}

export const GenerateKeyFormFooter: FunctionComponent<FooterProps> = ({
  generateKeyRequest,
  onCancel,
  onNext,
}) => (
  <Fragment>
    <EuiButtonEmpty onClick={() => onCancel()}>
      <FormattedMessage {...messages.apiKeyCancel} />
    </EuiButtonEmpty>

    <CuiButton
      spin={generateKeyRequest && generateKeyRequest.inProgress}
      onClick={() => onNext()}
      fill={true}
      requiresSudo={true}
    >
      <FormattedMessage {...messages.generateKeyFooterNext} />
    </CuiButton>
  </Fragment>
)
