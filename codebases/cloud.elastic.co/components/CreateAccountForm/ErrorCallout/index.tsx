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

import React, { Fragment, PureComponent } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { get } from 'lodash'
import { EuiCallOut, EuiSpacer, EuiText } from '@elastic/eui'

import { passwordErrorMessages } from '../../PasswordField/errorMessages'
import { extractEmailFromError, getMessages } from '../../../lib/error'

interface Props extends WrappedComponentProps {
  error?: string | Error
}

const messages = defineMessages({
  emailDisposableMailgun: {
    id: `registration-page.email-error-mailgun`,
    defaultMessage: `The provided email address appears to be invalid.`,
  },
  emailMisspellingMailgun: {
    id: `registration-page.email-misspelling-mailgun`,
    defaultMessage: `The provided email address appears to be invalid. Check for typos and misspellings.`,
  },
  userAlreadyExist: {
    id: 'registration-page.user-already-exist',
    defaultMessage:
      '{email} is already associated with an account. Please use another email address.',
  },
  internalUser: {
    id: 'registration-page.internal-user',
    defaultMessage: 'User activation is not allowed. Please use Google Sign-In.',
  },
})

class CreateAccountFormErrorCallout extends PureComponent<Props> {
  render() {
    const {
      intl: { formatMessage },
      error,
    } = this.props

    if (!error) {
      return null
    }

    const responseStatus = get(error, [`response`, `status`])
    const errorDetails = get(error, [`body`], {})
    const errorCode = get(error, [`body`, `errors`, `0`, `code`], ``)
    const didYouMean = get(error, [`body`, `errors`, `0`, `context`, `did_you_mean`], null)

    if (responseStatus >= 400 && responseStatus < 500) {
      const errorMsg = passwordErrorMessages[errorDetails.hint]

      if (errorMsg) {
        return this.renderErrorCalloutComponent({ content: formatMessage(errorMsg) })
      }

      if (errorDetails.detail) {
        return this.renderErrorCalloutComponent({ content: errorDetails.detail })
      }

      if (errorCode === `user.invalid_email`) {
        return this.renderErrorCalloutComponent({
          content: formatMessage(messages.emailMisspellingMailgun),
          details: didYouMean,
        })
      }

      if (errorCode === `user.is_disposable`) {
        return this.renderErrorCalloutComponent({
          content: formatMessage(messages.emailDisposableMailgun),
          details: didYouMean,
        })
      }

      if (errorCode === `user.activation_not_allowed`) {
        return this.renderErrorCalloutComponent({
          content: formatMessage(messages.internalUser),
        })
      }

      if (error instanceof Error && errorCode === `user.already_exists`) {
        const message = getMessages(error)
        const email = extractEmailFromError(message)

        return this.renderErrorCalloutComponent({
          content: formatMessage(messages.userAlreadyExist, { email }),
        })
      }
    }

    if (errorDetails && errorDetails.msg) {
      return this.renderErrorCalloutComponent({ content: errorDetails.msg })
    }

    const message = get(error, [`body`, `errors`, `0`, `message`], null)

    if (message) {
      return this.renderErrorCalloutComponent({ content: message })
    }

    if (responseStatus >= 500) {
      const messages = defineMessages({
        internalServerErrorMessage: {
          id: 'create-account-form.internal-server-error-message',
          defaultMessage: "It's not you, it's us - try again in a moment",
        },
      })
      return this.renderErrorCalloutComponent({
        content: formatMessage(messages.internalServerErrorMessage),
      })
    }

    return null
  }

  renderErrorCalloutComponent({ content, details }: { content: string; details?: string }) {
    return (
      <Fragment>
        <EuiSpacer size='m' />
        <EuiCallOut
          data-test-id='set-password-failed'
          title={<FormattedMessage id='registration.failed' defaultMessage='Registration error' />}
          color='danger'
          iconType='alert'
        >
          {content}
          {details && (
            <EuiText size='s'>
              <FormattedMessage
                id='set-password.failed-meaning'
                defaultMessage='Did you mean {mean}?'
                values={{
                  mean: details,
                }}
              />
            </EuiText>
          )}
        </EuiCallOut>
        <EuiSpacer size='m' />
      </Fragment>
    )
  }
}

export default injectIntl(CreateAccountFormErrorCallout)
