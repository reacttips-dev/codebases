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

import TempShieldUsers from './TempShieldUsers'

import { fetchUser } from '../../../actions/user'

import {
  createTempShieldUser,
  resetCreateTempShieldUserStatus,
  deleteTempShieldUser,
  resetDeleteTempShieldUserStatus,
  resetTempShieldUser,
} from '../../../actions/clusters'

import {
  getCluster,
  getCreateTempShieldUsersInformation,
  getDeleteTempShieldUsersInformation,
  getNewTempShieldUser,
  getUser,
  getRoot,
} from '../../../reducers'

import {
  AsyncRequestState,
  RootConfig,
  ElasticsearchCluster,
  ReduxState,
  NewTempShieldUserState,
  UserState,
  FoundUser,
} from '../../../types'

type StateProps = {
  cluster?: ElasticsearchCluster | null
  createTempShieldUserInfo: AsyncRequestState
  deleteTempShieldUserInfo: AsyncRequestState
  newTempShieldUser: NewTempShieldUserState
  root: RootConfig
  user: UserState
}

type DispatchProps = {
  createTempShieldUser: (cluster: ElasticsearchCluster, data: unknown, username: string) => void
  deleteTempShieldUser: (cluster: ElasticsearchCluster, data: unknown, user: FoundUser) => void
  fetchUser: (root: RootConfig) => void
  resetCreateTempShieldUserStatus: (regionId: string, clusterId: string) => void
  resetDeleteTempShieldUserStatus: (regionId: string, clusterId: string) => void
  resetTempShieldUser: () => void
}

type ConsumerProps = {
  regionId: string
  clusterId: string
  data: unknown
  users: Array<{ username: string; validUntil: string }>
}

const mapStateToProps = (
  state: ReduxState,
  { regionId, clusterId }: ConsumerProps,
): StateProps => ({
  cluster: getCluster(state, regionId, clusterId),
  createTempShieldUserInfo: getCreateTempShieldUsersInformation(state, regionId, clusterId),
  deleteTempShieldUserInfo: getDeleteTempShieldUsersInformation(state, regionId, clusterId),
  newTempShieldUser: getNewTempShieldUser(state),
  root: getRoot(state),
  user: getUser(state),
})

const mapDispatchToProps: DispatchProps = {
  createTempShieldUser,
  deleteTempShieldUser,
  fetchUser,
  resetCreateTempShieldUserStatus,
  resetDeleteTempShieldUserStatus,
  resetTempShieldUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(TempShieldUsers)
