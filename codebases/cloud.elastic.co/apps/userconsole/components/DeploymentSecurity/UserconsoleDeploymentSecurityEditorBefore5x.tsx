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
import { values, every } from 'lodash'

import { EuiFormHelpText, EuiFormLabel, EuiSpacer } from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import SpinButton from '../../../../components/SpinButton'

import EditUsers from '../../../../components/DeploymentSecurity/DeploymentSecurityEditorBefore5x/EditUsers'
import EditUsersPerRole from '../../../../components/DeploymentSecurity/DeploymentSecurityEditorBefore5x/EditUsersPerRole'
import EditRoles from '../../../../components/DeploymentSecurity/DeploymentSecurityEditorBefore5x/EditRoles'

import ensureHashedPasswords from '../../../../lib/ensureHashedPasswords'
import { replaceIn } from '../../../../lib/immutability-helpers'
import { isValidYaml, yamlToJson, jsonToYaml } from '../../../../lib/yaml'

import { AsyncRequestState, ElasticsearchCluster } from '../../../../types'

interface ShieldConfig {
  users: string
  users_roles: string
  roles: string
}

type SecurityConfig = ElasticsearchCluster['security']['config']

type Props = {
  config: SecurityConfig
  saveShieldConfig: (shieldConfig: ShieldConfig) => void
  saveShieldConfigRequest: AsyncRequestState
}

type State = {
  users: string
  usersPerRole: string
  roles: string
  isValid: {
    users: boolean
    usersPerRole: boolean
    roles: boolean
  }
  isHashingPasswords: boolean
  hasChanged: boolean
}

class UserconsoleDeploymentSecurityEditorBefore5x extends Component<Props, State> {
  state: State = {
    users: jsonToYaml(this.props.config.users) || ``,
    usersPerRole: jsonToYaml(this.props.config.usersPerRole) || ``,
    roles: jsonToYaml(this.props.config.roles) || ``,
    isValid: {
      users: true,
      usersPerRole: true,
      roles: true,
    },
    isHashingPasswords: false,
    hasChanged: false,
  }

  render() {
    const { saveShieldConfigRequest } = this.props
    const { users, usersPerRole, roles, isHashingPasswords, isValid, hasChanged } = this.state

    const isSaving = saveShieldConfigRequest.inProgress
    const isSaved = saveShieldConfigRequest.isDone && !saveShieldConfigRequest.error
    const error = saveShieldConfigRequest.error

    const allFieldsValid = every(values(isValid))

    return (
      <div data-test-id='deploymentSecurity-SecurityEditor'>
        <div>
          <EuiFormLabel>
            <FormattedMessage id='uc.deployment-security-editor.users' defaultMessage='Users' />
          </EuiFormLabel>

          <EditUsers users={users} onChange={this.updateField.bind(this, `users`)} />
        </div>

        <EuiSpacer size='m' />

        <div>
          <EuiFormLabel>
            <FormattedMessage
              id='uc.deployment-security-editor.users-per-role'
              defaultMessage='Users per role'
            />
          </EuiFormLabel>

          <EditUsersPerRole
            usersPerRole={usersPerRole}
            onChange={this.updateField.bind(this, `usersPerRole`)}
          />
        </div>

        <EuiSpacer size='m' />

        <div>
          <EuiFormLabel>
            <FormattedMessage id='uc.deployment-security-editor.roles' defaultMessage='Roles' />
          </EuiFormLabel>

          <EditRoles roles={roles} onChange={this.updateField.bind(this, `roles`)} />
        </div>

        <EuiSpacer size='m' />

        <SpinButton
          type='submit'
          fill={true}
          spin={isSaving}
          disabled={isHashingPasswords || !allFieldsValid}
          onClick={() => this.save()}
        >
          <FormattedMessage
            id='deployment-security-editor.save-security-config'
            defaultMessage='Save security configuration'
          />
        </SpinButton>

        {!allFieldsValid && (
          <EuiFormHelpText>
            <FormattedMessage
              id='deployment-security-editor.invalid-changes'
              defaultMessage='Your changes are invalid.'
            />
          </EuiFormHelpText>
        )}

        {!hasChanged && error && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='error'>{error}</CuiAlert>
          </Fragment>
        )}

        {!hasChanged && isSaved && (
          <Fragment>
            <EuiSpacer size='m' />

            <CuiAlert type='info'>
              <FormattedMessage
                id='deployment-security-editor.security-config-saved'
                defaultMessage='Security config saved'
              />
            </CuiAlert>
          </Fragment>
        )}
      </div>
    )
  }

  updateField(fieldName: 'users' | 'usersPerRole' | 'roles', value) {
    // @ts-ignore 🤷
    this.setState({
      [fieldName]: value,
      isValid: replaceIn(this.state.isValid, [fieldName], isValidYaml(value)),
      hasChanged: true,
    })
  }

  save() {
    const { saveShieldConfig } = this.props
    const { users, usersPerRole, roles } = this.state

    // As hashing might take some time, we want to be able
    // to show an update to the user, e.g. disabling submit
    this.setState({
      isHashingPasswords: true,
    })

    return ensureHashedPasswords(yamlToJson(users)).then((usersWithPasswords) => {
      const usersWithPasswordsYaml = jsonToYaml(usersWithPasswords) || ``

      this.setState({
        users: usersWithPasswordsYaml,
        isHashingPasswords: false,
        hasChanged: false,
      })

      return saveShieldConfig({
        users: usersWithPasswordsYaml,
        users_roles: usersPerRole,
        roles,
      })
    })
  }
}

export default UserconsoleDeploymentSecurityEditorBefore5x
