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
import { RouteComponentProps } from 'react-router'
import { FormattedMessage } from 'react-intl'

import { CuiAlert } from '../../../../cui'

import PasswordUpdateViaEmailLink from '../CreatePassword/PasswordUpdateViaEmailLink'
import ChangePasswordForm from '../ChangePasswordForm'

interface Props {
  email?: string
  expires?: number
  activationHash?: string
  redirectTo?: string | string[]
  location: RouteComponentProps['location']
}

class ResetPassword extends PureComponent<Props> {
  render(): ReactElement {
    return (
      <PasswordUpdateViaEmailLink
        title={<FormattedMessage id='set-password-form.title' defaultMessage='Set your password' />}
      >
        {this.renderPasswordForm()}
      </PasswordUpdateViaEmailLink>
    )
  }

  renderPasswordForm(): ReactElement {
    const { email, expires, activationHash } = this.props

    if (!email || !expires || !activationHash) {
      return (
        <CuiAlert type='error'>
          <FormattedMessage
            id='resetPasswordForm-error'
            defaultMessage='Your password reset link is not valid'
          />
        </CuiAlert>
      )
    }

    return <ChangePasswordForm isReset={true} />
  }
}

export default ResetPassword
