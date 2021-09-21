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

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { without } from 'lodash'

import { EuiDescribedFormGroup, EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import ContactTable from './ContactTable'
import MonitoringEmailsWhitelist from './MonitoringEmailsWhitelist'

import GovCloudGate from '../../../../components/GovCloudGate'

import { AsyncRequestState } from '../../../../types'

import './contactForm.scss'

const EMAIL_REGEX = /[^@]+@[^\.]+\..+/

type Props = {
  operationalContacts: string
  billingContacts: string
  onSave: (type: string, contacts: string) => void
  addMonitoringWhitelistEmailRequest: AsyncRequestState
  saveMonitoringEmailWhitelist: (email: string) => void
  showBillingFeature: boolean
}

type State = {
  errors: {
    operational: ReactNode
    billing: ReactNode
  }
}

class ContactForm extends Component<Props, State> {
  state: State = {
    errors: {
      operational: null,
      billing: null,
    },
  }

  render() {
    const {
      operationalContacts: rawOperationalContacts,
      billingContacts: rawBillingContacts,
      addMonitoringWhitelistEmailRequest,
      saveMonitoringEmailWhitelist,
      showBillingFeature,
    } = this.props

    const { errors } = this.state
    const operationalContacts = splitContacts(rawOperationalContacts)
    const billingContacts = splitContacts(rawBillingContacts)

    return (
      <div>
        <EuiSpacer size='m' />

        <EuiFlexGroup direction='column' gutterSize='xl'>
          {showBillingFeature ? (
            <GovCloudGate>
              <EuiFlexItem>
                <EuiDescribedFormGroup
                  title={
                    <h3>
                      <FormattedMessage
                        id='uc.accountDetails.billingContactForm.header'
                        defaultMessage='Billing contacts'
                      />
                    </h3>
                  }
                  description={
                    <p>
                      <FormattedMessage
                        id='uc.accountDetails.billing.emails.description'
                        defaultMessage='Customize who receives billing emails in your organization.'
                      />
                    </p>
                  }
                >
                  <ContactTable
                    contacts={billingContacts}
                    error={errors.billing}
                    onRemove={this.remove.bind(this, `billing`)}
                    onAdd={this.add.bind(this, `billing`)}
                  />
                </EuiDescribedFormGroup>
              </EuiFlexItem>
            </GovCloudGate>
          ) : null}

          <EuiFlexItem>
            <EuiDescribedFormGroup
              title={
                <h3>
                  <FormattedMessage
                    id='uc.accountDetails.operationalContactForm.header'
                    defaultMessage='Operational email contacts'
                  />
                </h3>
              }
              description={
                <p>
                  <FormattedMessage
                    id='uc.accountDetails.operationial.emails.description'
                    defaultMessage='Add contacts that should receive operational notifications, such as out-of-memory alerts, but would not have access to the console.'
                  />
                </p>
              }
            >
              <ContactTable
                contacts={operationalContacts}
                error={errors.operational}
                onRemove={this.remove.bind(this, `operational`)}
                onAdd={this.add.bind(this, `operational`)}
              />
            </EuiDescribedFormGroup>
          </EuiFlexItem>

          <EuiFlexItem>
            <EuiDescribedFormGroup
              title={
                <h3>
                  <FormattedMessage
                    id='uc.accountDetails.monitoring.emails.header'
                    defaultMessage='Monitoring email whitelist'
                  />
                </h3>
              }
              description={
                <p>
                  <FormattedMessage
                    id='uc.accountDetails.monitoring.emails.description'
                    defaultMessage='Whitelist an email address that should receive monitoring alerts. You must confirm the email address to start receiving these alerts.'
                  />
                </p>
              }
            >
              <MonitoringEmailsWhitelist
                addMonitoringWhitelistEmailRequest={addMonitoringWhitelistEmailRequest}
                saveMonitoringEmailWhitelist={saveMonitoringEmailWhitelist}
              />
            </EuiDescribedFormGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }

  add = (type: string, contactToAdd: string) => {
    const { onSave } = this.props
    const { errors } = this.state

    const existingContacts = this.getContacts(type)

    const nextErrors = getValidationErrors({ existingContacts, contactToAdd, type })

    this.setState({
      errors: {
        ...errors,
        ...nextErrors,
      },
    })

    if (nextErrors[type]) {
      return Promise.reject()
    }

    const nextContacts = existingContacts.concat([contactToAdd])
    return onSave(type, joinContacts(nextContacts))
  }

  remove = (type: string, contactToRemove: string) => {
    const { onSave } = this.props

    const existingContacts = this.getContacts(type)

    const nextContacts = without(existingContacts, contactToRemove)

    onSave(type, joinContacts(nextContacts))
  }

  getContacts(type: string) {
    const { operationalContacts, billingContacts } = this.props

    const contactTypes = {
      operational: operationalContacts,
      billing: billingContacts,
    }

    const contactsByType = contactTypes[type]
    const contacts = splitContacts(contactsByType)

    return contacts
  }
}

export default ContactForm

function getValidationErrors({ existingContacts, contactToAdd, type }) {
  return {
    [type]: getClientError(),
  }

  function getClientError(): ReactNode {
    const value = contactToAdd.trim()

    if (!EMAIL_REGEX.test(value)) {
      return (
        <FormattedMessage
          id='uc.accountDetails.billingContactForm.invalidEmailError'
          defaultMessage='Not a valid email address'
        />
      )
    }

    if (existingContacts.includes(value)) {
      return (
        <FormattedMessage
          id='uc.accountDetails.billingContactForm.emailAlreadyExistsError'
          defaultMessage='This contact is already included'
        />
      )
    }

    return null
  }
}

export function splitContacts(contacts: string): string[] {
  return contacts.split(/[,\n\s]+/).filter((contact) => contact.length > 0)
}

export function joinContacts(contacts: string[]): string {
  return contacts.join(`, `)
}
