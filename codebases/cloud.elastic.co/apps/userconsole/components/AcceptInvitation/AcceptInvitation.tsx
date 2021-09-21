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

import CreateAccountForm from '../../../../components/CreateAccountForm'
import PasswordUpdateViaEmailLink from '../CreatePassword/PasswordUpdateViaEmailLink'
import { CuiAlert } from '../../../../cui'

interface Props {
  email?: string
  expires?: number
  activationHash?: string
  redirectTo?: string
}

class AcceptInvitation extends PureComponent<Props> {
  render(): ReactElement {
    return (
      <PasswordUpdateViaEmailLink
        type='login'
        title={
          <FormattedMessage id='create-account-form.title' defaultMessage='Create your account' />
        }
      >
        {this.renderPasswordForm()}
      </PasswordUpdateViaEmailLink>
    )
  }

  renderPasswordForm(): ReactElement {
    const { email, expires, activationHash, redirectTo } = this.props

    if (!email || !expires || !activationHash) {
      return (
        <CuiAlert type='error'>
          <FormattedMessage
            id='accept-invite-error'
            defaultMessage='Your invitation link is not valid'
          />
        </CuiAlert>
      )
    }

    return <CreateAccountForm stagedUser={{ email, expires, activationHash, redirectTo }} />
  }
}

export default AcceptInvitation
