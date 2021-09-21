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
import { noop } from 'lodash'
import { Form, Formik, FormikErrors } from 'formik'

import {
  EuiCallOut,
  EuiDescribedFormGroup,
  EuiFieldPassword,
  EuiForm,
  EuiFormRow,
} from '@elastic/eui'

import { User } from '../../../../lib/api/v1/types'
import { DeepPartial } from '../../../../lib/ts-essentials'
import SpinButton from '../../../../components/SpinButton'
import { AsyncRequestState } from '../../../../types'
import { CuiFormField } from '../../../../cui/forms'

import messages from '../messages'

export interface Props {
  onChange: (user: DeepPartial<User>) => Promise<User>
  onChangeRequest: AsyncRequestState
}

interface PasswordFormShape {
  password: string
  confirmPassword: string
}

// We do a type union here instead of extending WrappedComponentProps in the Props definition
// so that we can re-use Props in the unit test
const ChangePasswordForm: FunctionComponent<Props & WrappedComponentProps> = ({
  intl: { formatMessage },
  onChange,
  onChangeRequest,
}) => {
  return (
    <EuiForm data-test-id='user-settings-password-form'>
      <Formik<PasswordFormShape>
        initialValues={{ password: '', confirmPassword: '' }}
        onSubmit={onChangeHandler}
        validate={validatePassword}
      >
        {({ dirty, isValid, handleSubmit }) => (
          <Form>
            <EuiDescribedFormGroup
              fullWidth={true}
              title={
                <h3>
                  <FormattedMessage {...messages.password} />
                </h3>
              }
              description={<FormattedMessage {...messages.profileDescriptionPassword} />}
            >
              <CuiFormField
                label={<FormattedMessage {...messages.password} />}
                component={EuiFieldPassword}
                name='password'
              />

              <CuiFormField
                label={<FormattedMessage {...messages.confirmPassword} />}
                component={EuiFieldPassword}
                name='confirmPassword'
              />

              <EuiFormRow>
                <div>
                  <SpinButton
                    data-test-id='submit-change-password'
                    disabled={!dirty || !isValid || onChangeRequest.inProgress}
                    type='button'
                    onClick={() => handleSubmit()}
                    fill={false}
                    spin={onChangeRequest.inProgress}
                  >
                    <FormattedMessage {...messages.changePassword} />
                  </SpinButton>
                </div>
              </EuiFormRow>

              {onChangeRequest.error && (
                <EuiCallOut
                  color='danger'
                  iconType='alert'
                  title={<FormattedMessage {...messages.passwordUpdateFailed} />}
                >
                  {typeof onChangeRequest.error === 'string'
                    ? onChangeRequest.error
                    : onChangeRequest.error.message}
                </EuiCallOut>
              )}

              {!onChangeRequest.error && onChangeRequest.isDone && (
                <EuiCallOut
                  color='success'
                  iconType='check'
                  title={<FormattedMessage {...messages.passwordUpdateSucceeded} />}
                />
              )}
            </EuiDescribedFormGroup>
          </Form>
        )}
      </Formik>
    </EuiForm>
  )

  function validatePassword(form: PasswordFormShape) {
    const errors: FormikErrors<PasswordFormShape> = {}

    if (form.password.length < 8) {
      errors.password = formatMessage(messages.passwordMustBeValid)
    }

    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = formatMessage(messages.passwordMustMatch)
    }

    return errors
  }

  function onChangeHandler(form: PasswordFormShape) {
    const payload: DeepPartial<User> = {
      security: {
        password: form.password,
      },
    }

    // The .catch() stops exceptions propagating to the browser console
    onChange(payload).catch(noop)
  }
}

export default injectIntl(ChangePasswordForm)
