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

import { isEqual } from 'lodash'

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { CuiTimeAgo, CuiTable, CuiTableColumn } from '../../../cui'

import DeleteTempUser from './DeleteTempUser'
import AddTempUser from './AddTempUser'

import { atPath } from '../../../lib/objects'

import {
  AsyncRequestState,
  RootConfig,
  ElasticsearchCluster,
  NewTempShieldUserState,
  UserState,
  FoundUser,
} from '../../../types'

type User = { username: string; validUntil: string }

type Props = {
  cluster?: ElasticsearchCluster | null
  clusterId: string
  createTempShieldUser: (cluster: ElasticsearchCluster, data: unknown, username: string) => void
  createTempShieldUserInfo: AsyncRequestState
  data: unknown
  deleteTempShieldUser: (cluster: ElasticsearchCluster, data: unknown, user: FoundUser) => void
  deleteTempShieldUserInfo: AsyncRequestState
  fetchUser: (root: RootConfig) => void
  newTempShieldUser: NewTempShieldUserState
  regionId: string
  resetCreateTempShieldUserStatus: (regionId: string, clusterId: string) => void
  resetDeleteTempShieldUserStatus: (regionId: string, clusterId: string) => void
  resetTempShieldUser: () => void
  root: RootConfig
  user: UserState
  users: User[]
}

class TempShieldUsers extends Component<Props> {
  componentDidMount() {
    const { root, fetchUser } = this.props
    fetchUser(root)
  }

  componentDidUpdate(prevProps: Props) {
    const {
      resetCreateTempShieldUserStatus,
      createTempShieldUserInfo,
      deleteTempShieldUserInfo,
      resetDeleteTempShieldUserStatus,
      regionId,
      clusterId,
    } = this.props

    if (
      !isEqual(this.props.data, prevProps.data) &&
      !createTempShieldUserInfo.error &&
      !deleteTempShieldUserInfo.error
    ) {
      resetCreateTempShieldUserStatus(regionId, clusterId)
      resetDeleteTempShieldUserStatus(regionId, clusterId)
    }
  }

  componentWillUnmount() {
    const { resetTempShieldUser } = this.props
    resetTempShieldUser()
  }

  render() {
    const { users, createTempShieldUserInfo, deleteTempShieldUserInfo, newTempShieldUser, user } =
      this.props

    const columns: Array<CuiTableColumn<User>> = [
      {
        label: (
          <FormattedMessage id='cluster-manage-temp-shield-users.name' defaultMessage='Name' />
        ),
        render: atPath(`username`),
        sortKey: `username`,
      },
      {
        label: (
          <FormattedMessage
            id='cluster-manage-temp-shield-users.expiration'
            defaultMessage='Expiration'
          />
        ),
        className: 'tempShieldUsers-expiration',
        render: (row) =>
          row.validUntil ? (
            <CuiTimeAgo date={row.validUntil} longTime={true} />
          ) : (
            <FormattedMessage
              id='cluster-manage-temp-shield-users.expiration-never'
              defaultMessage='Never'
            />
          ),
        sortKey: `validUntil`,
      },
      {
        label: (
          <FormattedMessage
            id='cluster-manage-temp-shield-users.actions'
            defaultMessage='Actions'
          />
        ),
        render: this.renderDelete.bind(this),
      },
    ]

    return (
      <div className='tempShieldUsers-table'>
        <CuiTable<User>
          fullWidth={false}
          rows={users}
          getRowId={atPath(`username`)}
          columns={columns}
        />

        <AddTempUser
          user={user}
          addTempUser={this.addTempUser}
          newTempShieldUser={newTempShieldUser}
          deleteTempShieldUserInfo={deleteTempShieldUserInfo}
          createTempShieldUserInfo={createTempShieldUserInfo}
        />
      </div>
    )
  }

  renderDelete(user: User) {
    const {
      data,
      cluster,
      createTempShieldUserInfo,
      deleteTempShieldUserInfo,
      deleteTempShieldUser,
    } = this.props

    return (
      <DeleteTempUser
        user={user}
        data={data}
        cluster={cluster}
        createTempShieldUserInfo={createTempShieldUserInfo}
        deleteTempShieldUserInfo={deleteTempShieldUserInfo}
        deleteTempShieldUser={deleteTempShieldUser}
      />
    )
  }

  addTempUser = (username: string) => {
    const { cluster, data, createTempShieldUser } = this.props
    createTempShieldUser(cluster!, data, username)
  }
}

export default TempShieldUsers
