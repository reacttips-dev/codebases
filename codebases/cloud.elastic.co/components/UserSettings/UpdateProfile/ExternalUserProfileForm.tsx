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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  EuiBadge,
  EuiDescribedFormGroup,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiText,
} from '@elastic/eui'

import { User } from '../../../lib/api/v1/types'
import { translateAndSortRoles } from '../../../lib/roles'
import messages from './messages'

export interface Props {
  currentUser: User
}

// We do a type union here instead of extending WrappedComponentProps in the Props definition
// so that we can re-use Props in the unit test
const ExternalUserProfileForm: FunctionComponent<Props & WrappedComponentProps> = ({
  currentUser,
  intl: { formatMessage },
}) => {
  const roles = translateAndSortRoles(formatMessage, currentUser.security.roles || [])

  const securityRealm = currentUser.security.security_realm

  // This should already have been checked in <UserSettings />
  if (securityRealm == null) {
    throw new Error('Cannot render ExternalUserSettingsForm without any security realm information')
  }

  // Sanity check
  if (securityRealm.type === 'native') {
    throw new Error('Cannot render ExternalUserSettingsForm with a user from the native realm')
  }

  return (
    <EuiForm data-test-id='user-settings-form'>
      <EuiDescribedFormGroup
        fullWidth={true}
        title={
          <h3>
            <FormattedMessage {...messages.title} />
          </h3>
        }
        description={
          <EuiText>
            <p>
              <FormattedMessage {...messages.profileDescriptionReadonlyUsername} />
            </p>
          </EuiText>
        }
      >
        <EuiFormRow
          label={<FormattedMessage {...messages.username} />}
          helpText={<FormattedMessage {...messages.optional} />}
        >
          <EuiFieldText name='username' disabled={true} value={currentUser.user_name} />
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.realmType} />}>
          <div data-test-id='realmType'>
            <EuiBadge>{securityRealm.type}</EuiBadge>
          </div>
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.realmId} />}>
          <EuiFieldText name='realm_id' disabled={true} value={securityRealm.id} />
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.fullName} />}>
          <EuiFieldText name='fullName' disabled={true} value={currentUser.full_name || ''} />
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.contactEmail} />}>
          <EuiFieldText name='contactEmail' disabled={true} value={currentUser.email || ''} />
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.roles} />}>
          <div data-test-id='roles'>
            {roles.map((role) => (
              <EuiBadge key={role} color='hollow'>
                {role}
              </EuiBadge>
            ))}
          </div>
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </EuiForm>
  )
}

export default injectIntl(ExternalUserProfileForm)
