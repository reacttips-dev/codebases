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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiAlert, CuiTimeAgo } from '../../../cui'
import CopyButton from '../../CopyButton'

export default function TempUserCreationSuccess({ newTempShieldUser }) {
  return (
    <CuiAlert type='info'>
      <p>
        <strong data-test-id='successfully-added-temporary-user'>
          <FormattedMessage
            id='cluster-manage-temporary-user-creation-success.successfully-added-temporary-user'
            defaultMessage='Successfully added temporary user.'
          />
        </strong>
      </p>

      <p>
        <FormattedMessage
          id='cluster-manage-temporary-user-creation-success.you-can-use-the-credentials-below-to-login-make-sure-to-save-the-password-somewhere-as-this-is-the-only-time-we-can-show-it-to-you'
          defaultMessage='You can use the credentials below to login. Make sure to save the password somewhere as this is the only time we can show it to you.'
        />
      </p>

      <div data-test-id='new-temp-username'>
        <FormattedMessage
          id='cluster-manage-temporary-user-creation-success.username'
          defaultMessage='Username: {username}'
          values={{
            username: <strong>{newTempShieldUser.username}</strong>,
          }}
        />
        <CopyButton value={newTempShieldUser.username} className='tempShieldUsers-copyButton' />
      </div>

      <div data-test-id='new-temp-password'>
        <FormattedMessage
          id='cluster-manage-temporary-user-creation-success.password'
          defaultMessage='Password:'
        />
        <span className='tempShieldUsers-password'>
          <span className='tempShieldUsers-passwordText'>{newTempShieldUser.password}</span>
          <CopyButton value={newTempShieldUser.password} className='tempShieldUsers-copyButton' />
        </span>
      </div>

      <div>
        <FormattedMessage
          id='cluster-manage-temporary-user-creation-success.expires-strong'
          defaultMessage='Expires: {validUntil}'
          values={{
            validUntil: (
              <strong>
                <CuiTimeAgo date={newTempShieldUser.validUntil} longTime={true} />
              </strong>
            ),
          }}
        />
      </div>
    </CuiAlert>
  )
}
