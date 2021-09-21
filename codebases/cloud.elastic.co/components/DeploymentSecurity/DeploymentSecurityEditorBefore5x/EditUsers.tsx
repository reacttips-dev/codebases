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

import { EuiCode, EuiText } from '@elastic/eui'

import { CuiCodeEditor } from '../../../cui'

type Props = {
  users: string
  onChange: (nextRoles: string) => void
}

const EditUsers: FunctionComponent<Props> = ({ users, onChange }) => (
  <div className='row'>
    <EuiText className='col-xs-12 col-sm-4'>
      <p>
        <FormattedMessage
          id='deployment-security-edit-users.this-is-where-you-edit-security-s-users-and-their-password-em-hashed-using-bcrypt'
          defaultMessage="This is where you edit Security's users and their password {hashes}, hashed using bcrypt."
          values={{
            hashes: (
              <em>
                <FormattedMessage
                  id='deployment-security-edit-users.hashes'
                  defaultMessage='hashes'
                />
              </em>
            ),
          }}
        />
      </p>
      <p>
        <FormattedMessage
          id='deployment-security-edit-users.clear-text-passwords-will-be-hashed-in-your-browser-before-being-saved-passwords-cannot-be-recovered-after-you-save'
          defaultMessage='Clear text passwords will be hashed (in your browser) before being saved. Passwords cannot be recovered after you save.'
        />
      </p>
      <p>
        <FormattedMessage
          id='deployment-security-edit-users.a-hash-is-not-the-password-itself-but-a-safe-way-to-store-it-if-you-need-to-reset-a-password-replace-the-hash-with-your-new-password-and-then-click-save'
          defaultMessage='A hash is e.g. {example}. It is not the password itself, but a safe way to store it. If you need to reset a password, replace the hash with your new password and then click save.'
          values={{
            example: <EuiCode>$2a$12$xoBo...</EuiCode>,
          }}
        />
      </p>
      <p>
        <FormattedMessage
          id='deployment-security-edit-users.add-e-g-username-and-password-on-a-new-line-and-save-to-add-a-new-user'
          defaultMessage='Add e.g. {userAndPassword} on a new line and save to add a new user.'
          values={{
            userAndPassword: <EuiCode>username: password</EuiCode>,
          }}
        />
      </p>
    </EuiText>

    <div className='col-xs-12 col-sm-8'>
      <CuiCodeEditor language='yaml' value={users} onChange={onChange} />
    </div>
  </div>
)

export default EditUsers
