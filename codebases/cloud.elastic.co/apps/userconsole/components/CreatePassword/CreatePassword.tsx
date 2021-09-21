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

import PasswordUpdateViaEmailLink from './PasswordUpdateViaEmailLink'
import ChangePasswordForm from '../ChangePasswordForm'

import './createPassword.scss'

const CreatePassword: FunctionComponent = () => (
  <PasswordUpdateViaEmailLink requiresAccountVerification={true}>
    <ChangePasswordForm isReset={false} />
  </PasswordUpdateViaEmailLink>
)

export default CreatePassword
