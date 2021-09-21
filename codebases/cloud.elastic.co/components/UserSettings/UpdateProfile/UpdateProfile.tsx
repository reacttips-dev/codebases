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
import { get } from 'lodash'

import { EuiLoadingSpinner } from '@elastic/eui'

import { User } from '../../../lib/api/v1/types'
import { DeepPartial } from '../../../lib/ts-essentials'
import { AsyncRequestState } from '../../../types'

import NativeUserProfileForm from './NativeUserProfileForm'
import ExternalUserProfileForm from './ExternalUserProfileForm'
import SystemUserProfileForm from './SystemUserProfileForm'

export interface Props {
  currentUser: User | null
  onUpdateProfile: (user: DeepPartial<User>) => Promise<User>
  onChangePassword: (user: DeepPartial<User>) => Promise<User>
  onUpdateProfileRequest: AsyncRequestState
  onChangePasswordRequest: AsyncRequestState
}

const UpdateProfile: FunctionComponent<Props> = ({ currentUser, ...rest }) => {
  if (currentUser == null) {
    return <EuiLoadingSpinner />
  }

  if (currentUser.builtin) {
    return <SystemUserProfileForm currentUser={currentUser} {...rest} />
  }

  if (get(currentUser, ['security', 'security_realm', 'type']) !== 'native') {
    return <ExternalUserProfileForm currentUser={currentUser} {...rest} />
  }

  return <NativeUserProfileForm currentUser={currentUser} {...rest} />
}

export default UpdateProfile
