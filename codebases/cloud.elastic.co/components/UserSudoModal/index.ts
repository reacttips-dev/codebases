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

import UserSudoModal from './UserSudoModal'

import { fetchAuthenticationInfoIfNeeded } from '../../actions/auth'

import { fetchAuthenticationInfoRequest, getAuthenticationInfo } from '../../reducers'

import { AsyncRequestState } from '../../types'
import { AuthenticationInfo } from '../../lib/api/v1/types'

type StateProps = {
  authenticationInfo: AuthenticationInfo | null
  fetchAuthenticationInfoRequest: AsyncRequestState
}

type DispatchProps = {
  fetchAuthenticationInfo: () => void
}

type ConsumerProps = {
  onSudo?: (result: any) => void
  close: (success: boolean) => void
}

const mapStateToProps = (state): StateProps => ({
  authenticationInfo: getAuthenticationInfo(state),
  fetchAuthenticationInfoRequest: fetchAuthenticationInfoRequest(state),
})

const mapDispatchToProps: DispatchProps = {
  fetchAuthenticationInfo: fetchAuthenticationInfoIfNeeded,
}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(UserSudoModal)
