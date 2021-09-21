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

import CustomerProfile from './CustomerProfile'

import { withSmallErrorBoundary } from '../../cui'

import { getProfile } from '../../apps/userconsole/reducers'
import { SAD_getAuthTokenUserId, SAD_getAuthTokenUsername } from '../../lib/auth'

import { getConfigForKey } from '../../selectors'

import { ProfileState } from '../../types'

type StateProps = {
  isHeroku: boolean
  isPrivate: boolean
  profile: ProfileState
  userIdFromToken: string | null
  usernameFromToken: string | null
}

interface DispatchProps {}

interface ConsumerProps {}

const mapStateToProps = (state): StateProps => ({
  isHeroku: getConfigForKey(state, `APP_FAMILY`) === `heroku`,
  isPrivate: getConfigForKey(state, `APP_FAMILY`) === `essp`,
  profile: getProfile(state),
  userIdFromToken: SAD_getAuthTokenUserId(),
  usernameFromToken: SAD_getAuthTokenUsername(),
})

const mapDispatchToProps = {}

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(withSmallErrorBoundary(CustomerProfile))

export { default as CustomerLevel } from './CustomerLevel'
