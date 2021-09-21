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

import { isEmpty, get } from 'lodash'

import React, { Component, ElementType, Fragment } from 'react'
import { FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiCheckbox,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTitle,
  htmlIdGenerator,
} from '@elastic/eui'

import { gcpConsoleUrl, privacyUrl } from '../../urls'

import { CuiAlert } from '../../../../cui'
import ExternalLink from '../../../../components/ExternalLink'
import PrivacySensitiveContainer from '../../../../components/PrivacySensitiveContainer'
import GcpBillingMessage from '../Billing/GcpBillingMessage'

import validateEmail from '../../../../lib/validateEmail'
import messages from '../Billing/CreditCardModalButton/CreditCardModal/messages'
import validateDomain from '../../../../lib/validateDomain'

import { AsyncRequestState } from '../../../../types'
import { PartnerUser } from '../../actions/partner'
import './partnerSignup.scss'

type Props = {
  intl: IntlShape
  signUpPartnerUserRequest: AsyncRequestState
  signUpAwsUser: (token: any, args: PartnerUser) => void
  signUpGcpUser: (token: any, args: PartnerUser) => void
  signUpAzureUser: (token: any, args: PartnerUser) => void
  token: any
  partner: any
}

type State = {
  wantsInformationalEmailsId: string
  wantsInformationalEmails: boolean
  fullName: string
  email: string
  company: string
  errorMessages: {
    country?: string
    state?: string
  }
  errors: {
    firstName: boolean
    lastName: boolean
    email: boolean
    company: boolean
    wantsInformationalEmails: boolean
  }
}

type FieldOptions = {
  component?: ElementType
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
  required?: boolean
  options?: unknown[]
  hasNoInitialSelection?: boolean
  validations?: string[]
}

const makeId = htmlIdGenerator()

class PartnerSignupForm extends Component<Props, State> {
  state: State = {
    wantsInformationalEmailsId: makeId(),
    wantsInformationalEmails: true,
    fullName: ``,
    email: ``,
    company: ``,
    errorMessages: {},
    errors: {
      firstName: false,
      lastName: false,
      email: false,
      company: false,
      wantsInformationalEmails: false,
    },
  } as State

  render() {
    const { wantsInformationalEmails = false, wantsInformationalEmailsId, errors } = this.state
    const { partner } = this.props
    return (
      <div className='partnerSignup-form'>
        <EuiTitle>
          <h1>
            <FormattedMessage
              id='uc.partnerSignup.title-create'
              defaultMessage='Create your account'
            />
          </h1>
        </EuiTitle>
        {partner === `gcp` && <GcpBillingMessage />}
        <PrivacySensitiveContainer>{this.renderContactInfo()}</PrivacySensitiveContainer>
        <EuiFormRow
          isInvalid={!!errors.wantsInformationalEmails}
          error={errors.wantsInformationalEmails}
        >
          <EuiCheckbox
            className='marketingCommunications'
            data-test-id='partnerSignupForm-wantsInformationalEmails'
            id={wantsInformationalEmailsId}
            label={
              <FormattedMessage
                id='uc.partnerSignup.wantsInformationalEmailsLabel'
                defaultMessage="I'd like to receive communication about Elastic products and services."
              />
            }
            checked={wantsInformationalEmails}
            onChange={(e) => this.setState({ wantsInformationalEmails: e.target.checked })}
          />
        </EuiFormRow>
        <EuiSpacer size='l' />

        <EuiFlexGroup className='partnerSignupForm-submit' direction='column'>
          <EuiFlexItem>
            <EuiButton
              data-test-id='partnerSignupForm-submitButton'
              fill={true}
              onClick={this.save}
            >
              <FormattedMessage id='uc.partnerSignup.submitButton' defaultMessage='Sign up' />
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText className='privacyStatement' textAlign='center'>
              <FormattedMessage
                id='uc.partnerSignup.login'
                defaultMessage='Information on our data processing can be found in the Elastic {privacyStatement}.'
                values={{
                  privacyStatement: (
                    <ExternalLink href={privacyUrl}>
                      <FormattedMessage
                        id='uc.partnerSignup.privacy-statement-link'
                        defaultMessage='Privacy Statement'
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        {this.renderResponseErrors()}
      </div>
    )
  }

  renderContactInfo() {
    return (
      <Fragment>
        <EuiFlexGroup direction='column'>
          <EuiFlexItem>
            {this.field(`fullName`, {
              onChange: (e) =>
                this.setState({
                  fullName: (e.target as HTMLInputElement).value,
                }),
              validations: [`REQUIRED`],
            })}
          </EuiFlexItem>

          <EuiFlexItem>
            {this.field(`email`, {
              onChange: (e) =>
                this.setState({
                  email: (e.target as HTMLInputElement).value,
                }),
              validations: [`REQUIRED`, `EMAIL`],
            })}
          </EuiFlexItem>

          <EuiFlexItem>
            {this.field(`company`, {
              onChange: (e) => {
                this.setState({
                  company: (e.target as HTMLInputElement).value,
                })
              },
              validations: [`REQUIRED`],
            })}
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size='l' />
      </Fragment>
    )
  }

  renderResponseErrors() {
    const { partner, signUpPartnerUserRequest } = this.props

    if (!signUpPartnerUserRequest.error) {
      return null
    }

    const errorCode = get(signUpPartnerUserRequest, [`error`, `response`, `status`])
    const errorMessage = get(signUpPartnerUserRequest, [`error`, `body`, `msg`])

    if (errorCode === 401 && partner === `gcp`) {
      return (
        <EuiFlexGroup
          data-test-id='partnerSignupForm-gcpMarketplaceTokenError'
          className='errorMessage'
        >
          <EuiFlexItem grow={false}>
            <CuiAlert type='error'>
              <FormattedMessage
                id='uc.partnerSignup.gcp.token-error'
                defaultMessage='{errorMessage}. Please return to the {gcpMarketplace} and re-initiate with the Manage via Elastic.co link.'
                values={{
                  errorMessage,
                  gcpMarketplace: (
                    <ExternalLink href={gcpConsoleUrl}>
                      <FormattedMessage
                        id='uc.partnerSignup.gcp.marketplace-link'
                        defaultMessage='GCP Marketplace'
                      />
                    </ExternalLink>
                  ),
                }}
              />
            </CuiAlert>
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    return (
      <EuiFlexGroup data-test-id='partnerSignupForm-apiError' className='errorMessage'>
        <EuiFlexItem>
          <CuiAlert type='error'>{errorMessage}</CuiAlert>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  field(
    key,
    {
      component: FieldComponent = EuiFieldText,
      required = true,
      validations = [`REQUIRED`],
      ...rest
    }: FieldOptions = {},
  ) {
    const {
      intl: { formatMessage },
    } = this.props
    const { errorMessages } = this.state
    const errors = {}

    if (errorMessages[key]) {
      errors[key] = errorMessages[key]
    }

    const fieldProps = {
      name: key,
      required,
      ...rest,
    }

    const label = required
      ? formatMessage(messages[key])
      : `${formatMessage(messages[key])} ${formatMessage(messages.optional)}`

    return (
      <EuiFormRow
        id={`${key}`}
        label={label}
        error={errors[key] ? errors[key] : null}
        isInvalid={Boolean(errors[key])}
      >
        <FieldComponent
          {...fieldProps}
          data-test-id={`partnerSignupForm-${key}`}
          onBlur={this.validateField.bind(this, key, validations)}
          isInvalid={Boolean(errors[key])}
          required={false} // disable pre-validation
        />
      </EuiFormRow>
    )
  }

  generateValidationMessages(validations, value) {
    const {
      intl: { formatMessage },
    } = this.props

    const validationMessages = validations
      .map((validation) => {
        switch (validation) {
          case `REQUIRED`:
            if (value.length === 0) {
              return formatMessage(messages.fieldRequired)
            }

            break
          case `DOMAIN`:
            if (!validateDomain(value)) {
              return formatMessage(messages.feedbackDomain)
            }

            break
          case `EMAIL`:
            if (!validateEmail(value)) {
              return formatMessage(messages.feedbackEmail)
            }

            break
          default:
            return null
        }
      })
      .filter((x) => x)

    return validationMessages
  }

  validateField(key, validations, e) {
    const { errorMessages } = this.state
    const nextErrorMessages = { ...errorMessages }

    const {
      target: { value },
    } = e

    const validationMessages = this.generateValidationMessages(validations, value)

    if (validationMessages.length === 0) {
      delete nextErrorMessages[key]
    } else {
      nextErrorMessages[key] = validationMessages
    }

    this.setState({ errorMessages: nextErrorMessages })
  }

  validateForm(): boolean {
    const { errorMessages, fullName, email, company } = this.state

    const elements = {
      fullName,
      company,
      email,
    }

    const formFields = [
      { key: `fullName`, validations: [`REQUIRED`] },
      { key: `company`, validations: [`REQUIRED`] },
      { key: `email`, validations: [`REQUIRED`] },
    ]

    const nextErrorMessages = { ...errorMessages }

    formFields.forEach((field) => {
      const validationMessages = this.generateValidationMessages(
        field.validations,
        elements[field.key],
      )

      // Remove messages from last time validation occurred that are now passing
      if (validationMessages.length === 0) {
        delete nextErrorMessages[field.key]
      } else {
        nextErrorMessages[field.key] = validationMessages
      }
    })

    this.setState({ errorMessages: nextErrorMessages })

    return isEmpty(nextErrorMessages)
  }

  save = () => {
    const isValid = this.validateForm()

    if (!isValid) {
      return
    }

    const { token } = this.props

    const { email, company, wantsInformationalEmails } = this.state

    const { firstName, lastName } = splitFullName(this.state.fullName)

    const signUpPartnerUser = this.getPartnerAction()

    return signUpPartnerUser(token, {
      firstName,
      lastName,
      email,
      company,
      wantsInformationalEmails,
    })
  }

  getPartnerAction() {
    const { partner, signUpGcpUser, signUpAwsUser, signUpAzureUser } = this.props

    if (partner === `gcp`) {
      return signUpGcpUser
    }

    if (partner === `azure`) {
      return signUpAzureUser
    }

    return signUpAwsUser
  }
}

export default injectIntl(PartnerSignupForm)

function splitFullName(fullName) {
  const nameDividerIndex = fullName.indexOf(` `)

  if (nameDividerIndex === -1) {
    return {
      firstName: fullName,
      lastName: ``,
    }
  }

  return {
    firstName: fullName.substring(0, nameDividerIndex).trim(),
    lastName: fullName.substring(nameDividerIndex + 1).trim(),
  }
}
