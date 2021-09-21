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

import React, { PureComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'

import { EuiCallOut, EuiFormRow } from '@elastic/eui'
import { passwordErrorMessages } from '../../../../../components/PasswordField/errorMessages'

interface Props {
  error?: string | Error
}

class ChangePasswordFormErrorCallout extends PureComponent<Props> {
  render() {
    const { error } = this.props

    if (!error) {
      return null
    }

    const responseStatus = get(error, [`response`, `status`])
    const errorDetails = get(error, [`body`], {})

    if (responseStatus === 400) {
      const errorMsg = passwordErrorMessages[errorDetails.hint]

      if (errorMsg) {
        return this.renderErrorCalloutComponent(<FormattedMessage {...errorMsg} />)
      }

      if (errorDetails.detail) {
        return this.renderErrorCalloutComponent(errorDetails.detail)
      }
    }

    if (responseStatus >= 500) {
      return this.renderErrorCalloutComponent(
        <FormattedMessage
          id='change-password-form.internal-server-error-message'
          defaultMessage="It's not you, it's us - try again in a moment"
        />,
      )
    }

    if (errorDetails.msg) {
      return this.renderErrorCalloutComponent(errorDetails.msg)
    }

    const message = get(error, [`body`, `errors`, `0`, `message`], null)

    if (!message) {
      return null
    }

    return this.renderErrorCalloutComponent(message)
  }

  renderErrorCalloutComponent(content: ReactElement): ReactElement {
    return (
      <EuiFormRow>
        <EuiCallOut
          data-test-id='set-password-failed'
          title={
            <FormattedMessage id='set-password.failed' defaultMessage='Error setting password' />
          }
          color='danger'
          iconType='alert'
        >
          {content}
        </EuiCallOut>
      </EuiFormRow>
    )
  }
}

export default ChangePasswordFormErrorCallout
