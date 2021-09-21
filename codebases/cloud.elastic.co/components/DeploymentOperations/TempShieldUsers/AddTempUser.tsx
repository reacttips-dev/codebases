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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiFormHelpText,
  EuiSpacer,
  EuiFieldText,
  EuiFormRow,
} from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'

import SpinButton from '../../SpinButton'

import TempUserCreationSuccess from './TempUserCreationSuccess'

import Permission from '../../../lib/api/v1/permissions'

import { AsyncRequestState, NewTempShieldUserState, UserState } from '../../../types'

type Props = {
  addTempUser: (username: string) => void
  createTempShieldUserInfo: AsyncRequestState
  deleteTempShieldUserInfo: AsyncRequestState
  newTempShieldUser: NewTempShieldUserState
  user: UserState
}

type State = {
  _user: boolean
  username: string
}

const maxUsernameLength = 15

export default class AddTempUser extends Component<Props, State> {
  state = {
    _user: Boolean(this.props.user),
    username: this.props.user ? this.props.user.username.substring(0, maxUsernameLength) : ``,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    if (!prevState._user && nextProps.user) {
      return {
        _user: true,
        username: nextProps.user.username.substring(0, maxUsernameLength),
      }
    }

    return null
  }

  render() {
    const { addTempUser, createTempShieldUserInfo, deleteTempShieldUserInfo, newTempShieldUser } =
      this.props

    const { username } = this.state

    return (
      <div>
        <EuiSpacer size='m' />

        <EuiFormLabel>
          <FormattedMessage
            id='cluster-manage-add-temp-user.add-a-new-temporary-shield-user-by-adding-a-username'
            defaultMessage='Create temporary shield users'
          />
        </EuiFormLabel>

        <EuiSpacer size='xs' />

        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={false}>
            <EuiFormRow>
              <EuiFieldText
                value={username}
                onChange={(e) => this.updateUsername(e.target.value)}
                maxLength={maxUsernameLength}
                className='tempShieldUsers-input'
              />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <div>
              <CuiPermissibleControl permissions={Permission.setEsClusterMetadataRaw}>
                <SpinButton
                  color='primary'
                  className='tempShieldUsers-btn'
                  onClick={() => addTempUser(username)}
                  disabled={
                    username === `` ||
                    deleteTempShieldUserInfo.inProgress ||
                    deleteTempShieldUserInfo.isDone
                  }
                  spin={createTempShieldUserInfo.inProgress || createTempShieldUserInfo.isDone}
                  requiresSudo={true}
                >
                  <FormattedMessage
                    id='cluster-manage-add-temp-user.add-new-user'
                    defaultMessage='Create'
                  />
                </SpinButton>
              </CuiPermissibleControl>

              <EuiFormHelpText>
                <FormattedMessage
                  id='cluster-manage-add-temp-user.new-username-explained'
                  defaultMessage='Creates a new user named { username }'
                  values={{ username: `cloud-internal-${username}` }}
                />
              </EuiFormHelpText>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>

        {createTempShieldUserInfo.error && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error'>{createTempShieldUserInfo.error}</CuiAlert>
          </Fragment>
        )}

        {!createTempShieldUserInfo.inProgress &&
          !createTempShieldUserInfo.isDone &&
          !createTempShieldUserInfo.error &&
          newTempShieldUser.username != null && (
            <Fragment>
              <EuiSpacer size='m' />

              <TempUserCreationSuccess newTempShieldUser={newTempShieldUser} />
            </Fragment>
          )}
      </div>
    )
  }

  updateUsername(username) {
    this.setState({
      username,
    })
  }
}
