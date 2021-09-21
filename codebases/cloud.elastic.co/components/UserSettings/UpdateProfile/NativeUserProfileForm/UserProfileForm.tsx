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
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'
import { defaultsDeep, isEmpty, noop } from 'lodash'
import { Form, Formik, FormikErrors } from 'formik'

import { EuiBadge, EuiCallOut, EuiDescribedFormGroup, EuiForm, EuiFormRow } from '@elastic/eui'

import { User } from '../../../../lib/api/v1/types'
import { translateAndSortRoles } from '../../../../lib/roles'
import { DeepPartial } from '../../../../lib/ts-essentials'
import SpinButton from '../../../../components/SpinButton'
import { AsyncRequestState } from '../../../../types'
import { CuiFormField } from '../../../../cui/forms'

import messages from '../messages'

export interface Props {
  currentUser: User
  onUpdate: (user: DeepPartial<User>) => Promise<User>
  onUpdateRequest: AsyncRequestState
}

// We do a type union here instead of extending WrappedComponentProps in the Props definition
// so that we can re-use Props in the unit test
const UserProfileForm: FunctionComponent<Props & WrappedComponentProps> = ({
  currentUser,
  intl: { formatMessage },
  onUpdate,
  onUpdateRequest,
}) => {
  const roles = translateAndSortRoles(formatMessage, currentUser.security.roles || []).map(
    (role) => (
      <EuiBadge key={role} color='hollow'>
        {role}
      </EuiBadge>
    ),
  )

  const initialValues: User = defaultsDeep({}, currentUser, {
    email: '',
    full_name: '',
    security: {
      roles: [],
    },
  })

  return (
    <EuiForm data-test-id='user-settings-form'>
      <Formik initialValues={initialValues} onSubmit={onUpdateHandler} validate={validateUser}>
        {({ touched, isValid, handleSubmit }) => (
          <Form>
            <EuiDescribedFormGroup
              fullWidth={true}
              title={
                <h3>
                  <FormattedMessage {...messages.title} />
                </h3>
              }
              description={<FormattedMessage {...messages.profileDescriptionUsername} />}
            >
              <CuiFormField
                label={<FormattedMessage {...messages.username} />}
                name='user_name'
                isDisabled={true}
              />

              <CuiFormField
                label={<FormattedMessage {...messages.fullName} />}
                helpText={<FormattedMessage {...messages.optional} />}
                name='full_name'
              />

              <CuiFormField
                label={<FormattedMessage {...messages.contactEmail} />}
                helpText={<FormattedMessage {...messages.optional} />}
                name='email'
              />

              <EuiFormRow label={<FormattedMessage {...messages.roles} />}>
                <div data-test-id='roles'>{roles}</div>
              </EuiFormRow>

              <EuiFormRow>
                <div>
                  <SpinButton
                    data-test-id='submit-user-settings'
                    disabled={isEmpty(touched) || !isValid || onUpdateRequest.inProgress}
                    type='button'
                    onClick={() => handleSubmit()}
                    fill={false}
                    spin={onUpdateRequest.inProgress}
                  >
                    <FormattedMessage {...messages.updateProfile} />
                  </SpinButton>
                </div>
              </EuiFormRow>

              {onUpdateRequest.error && (
                <EuiCallOut
                  color='danger'
                  iconType='alert'
                  title={<FormattedMessage {...messages.updateFailed} />}
                >
                  {typeof onUpdateRequest.error === 'string'
                    ? onUpdateRequest.error
                    : onUpdateRequest.error.message}
                </EuiCallOut>
              )}

              {!onUpdateRequest.error && onUpdateRequest.isDone && (
                <EuiCallOut
                  color='success'
                  iconType='check'
                  title={<FormattedMessage {...messages.updateSucceeded} />}
                />
              )}
            </EuiDescribedFormGroup>
          </Form>
        )}
      </Formik>
    </EuiForm>
  )

  function validateUser(user: User) {
    const errors: FormikErrors<User> = {}

    if (user.email && !user.email.includes('@')) {
      errors.email = formatMessage(messages.invalidEmail)
    }

    return errors
  }

  function onUpdateHandler(updatedUser: User) {
    const payload: DeepPartial<User> = {}

    if (currentUser.full_name !== updatedUser.full_name) {
      payload.full_name = updatedUser.full_name
    }

    if (currentUser.email !== updatedUser.email) {
      payload.email = updatedUser.email
    }

    // The .catch() stops exceptions propagating to the browser console
    onUpdate(payload).catch(noop)
  }
}

export default injectIntl(UserProfileForm)
