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

import { connect } from 'react-redux'

import { User } from '../../../lib/api/v1/types'
import { getCurrentUser, updateCurrentUserRequest } from '../../../reducers'
import { AsyncRequestState, ReduxState, ThunkDispatch } from '../../../types'
import { updateCurrentUser } from '../../../actions/currentUser'
import { DeepPartial } from '../../../lib/ts-essentials'

import UpdateProfile from './UpdateProfile'

interface StateProps {
  currentUser: User | null
  onUpdateProfileRequest: AsyncRequestState
  onChangePasswordRequest: AsyncRequestState
}

interface DispatchProps {
  onUpdateProfile: (user: DeepPartial<User>) => Promise<User>
  onChangePassword: (user: DeepPartial<User>) => Promise<User>
}

const mapStateToProps: (state: ReduxState) => StateProps = (state) => {
  const currentUser = getCurrentUser(state)

  return {
    currentUser,
    onUpdateProfileRequest: updateCurrentUserRequest(state, 'update_profile'),
    onChangePasswordRequest: updateCurrentUserRequest(state, 'change_password'),
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onUpdateProfile: (user: DeepPartial<User>) => dispatch(updateCurrentUser(user, 'update_profile')),
  onChangePassword: (user: DeepPartial<User>) =>
    dispatch(updateCurrentUser(user, 'change_password')),
})

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateProfile)
