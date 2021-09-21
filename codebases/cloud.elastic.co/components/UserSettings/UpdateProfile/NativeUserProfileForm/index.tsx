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

import { EuiHorizontalRule } from '@elastic/eui'

import { User } from '../../../../lib/api/v1/types'
import { DeepPartial } from '../../../../lib/ts-essentials'
import { AsyncRequestState } from '../../../../types'
import UserProfileForm from './UserProfileForm'
import ChangePasswordForm from './ChangePasswordForm'

export interface Props {
  currentUser: User
  onUpdateProfile: (user: DeepPartial<User>) => Promise<User>
  onChangePassword: (user: DeepPartial<User>) => Promise<User>
  onUpdateProfileRequest: AsyncRequestState
  onChangePasswordRequest: AsyncRequestState
}

const NativeUserProfileForm: FunctionComponent<Props> = ({
  currentUser,
  onUpdateProfile,
  onUpdateProfileRequest,
  onChangePassword,
  onChangePasswordRequest,
}) => (
  <Fragment>
    <UserProfileForm
      currentUser={currentUser}
      onUpdate={onUpdateProfile}
      onUpdateRequest={onUpdateProfileRequest}
    />

    <EuiHorizontalRule />

    <ChangePasswordForm onChange={onChangePassword} onChangeRequest={onChangePasswordRequest} />
  </Fragment>
)

export default NativeUserProfileForm
