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

import DocLink from '../../../components/DocLink'

import { User } from '../../../lib/api/v1/types'
import { translateAndSortRoles } from '../../../lib/roles'
import messages from './messages'

export interface Props {
  currentUser: User
}

// We do a type union here instead of extending WrappedComponentProps in the Props definition
// so that we can re-use Props in the unit test
const SystemUserProfileForm: FunctionComponent<Props & WrappedComponentProps> = ({
  currentUser,
  intl: { formatMessage },
}) => {
  const roles = translateAndSortRoles(formatMessage, currentUser.security.roles || [])

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
              <FormattedMessage
                {...messages.profileDescriptionBuiltIn}
                values={{
                  documentation: (
                    <DocLink link='manageSystemPasswords'>
                      <FormattedMessage {...messages.documentation} />
                    </DocLink>
                  ),
                }}
              />
            </p>
          </EuiText>
        }
      >
        <EuiFormRow label={<FormattedMessage {...messages.username} />}>
          <EuiFieldText name='username' disabled={true} value={currentUser.user_name} />
        </EuiFormRow>

        <EuiFormRow label={<FormattedMessage {...messages.roles} />}>
          <div data-test-id='roles'>
            {roles.map((role) => (
              <EuiBadge color='hollow' key={role}>
                {role}
              </EuiBadge>
            ))}
          </div>
        </EuiFormRow>
      </EuiDescribedFormGroup>
    </EuiForm>
  )
}

export default injectIntl(SystemUserProfileForm)
