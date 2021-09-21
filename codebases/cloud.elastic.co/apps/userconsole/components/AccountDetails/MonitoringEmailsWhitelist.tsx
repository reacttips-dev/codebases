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
import { defineMessages, FormattedMessage, injectIntl, IntlShape } from 'react-intl'
import { get } from 'lodash'
import { EuiCallOut, EuiFieldText, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiTable } from '../../../../cui'

import SpinButton from '../../../../components/SpinButton'

import { AsyncRequestState } from '../../../../types'

import './contactForm.scss'

type Props = {
  intl: IntlShape
  addMonitoringWhitelistEmailRequest: AsyncRequestState
  saveMonitoringEmailWhitelist: (email: string) => void
}

type State = {
  email: string
}

const messages = defineMessages({
  addNewEmail: {
    id: `uc.accountDetails.contactForm.placeholder`,
    defaultMessage: `Add new email`,
  },
})

class MonitoringEmailsWhitelist extends Component<Props, State> {
  state: State = {
    email: ``,
  }

  render() {
    const {
      intl: { formatMessage },
      addMonitoringWhitelistEmailRequest,
    } = this.props

    const { email } = this.state
    const addEmailPlaceholder = formatMessage(messages.addNewEmail)

    return (
      <div>
        <CuiTable
          className='contact-table'
          rows={[]}
          emptyMessage={
            null /* TODO: when we get from the API the data for the `rows` prop, we should remove this `emptyMessage` prop */
          }
          columns={[
            {
              id: `uc.accountDetails.monitoring.email.column`,
              footer: {
                verticalAlign: `top` as const,
                render: () => (
                  <Fragment>
                    <EuiSpacer size='xs' />
                    <EuiFieldText
                      type='email'
                      value={email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                      placeholder={addEmailPlaceholder}
                    />
                    <EuiSpacer size='xs' />
                  </Fragment>
                ),
              },
            },
            {
              id: `uc.accountDetails.monitoring.email.addButton.column`,
              footer: {
                verticalAlign: `top` as const,
                render: () => (
                  <Fragment>
                    <EuiSpacer size='xs' />
                    <SpinButton
                      color='primary'
                      disabled={email.trim().length === 0}
                      onClick={() => this.addEmail()}
                      spin={addMonitoringWhitelistEmailRequest.inProgress}
                    >
                      <FormattedMessage
                        id='uc.accountDetails.monitoring.email.addButton'
                        defaultMessage='Add'
                      />
                    </SpinButton>
                    <EuiSpacer size='xs' />
                  </Fragment>
                ),
              },
            },
          ]}
          hasFooterRow={true}
        />

        {this.renderAddMonitoringEmailError()}
        {addMonitoringWhitelistEmailRequest.isDone && (
          <Fragment>
            <EuiSpacer size='m' />
            <EuiCallOut
              title={
                <FormattedMessage
                  id='uc.accountDetails.monitoring.email.success'
                  defaultMessage='Email has been sent'
                />
              }
            />
          </Fragment>
        )}
      </div>
    )
  }

  renderAddMonitoringEmailError() {
    const {
      addMonitoringWhitelistEmailRequest: { error },
    } = this.props

    if (!error) {
      return null
    }

    if (get(error, [`response`, `status`]) === 409) {
      return (
        <Fragment>
          <EuiSpacer size='m' />
          <CuiAlert type='warning'>
            <FormattedMessage
              id='uc.accountDetails.monitoring.email.failure'
              defaultMessage='Your email is already whitelisted.'
            />
          </CuiAlert>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />
        <CuiAlert type='error'>
          <FormattedMessage
            id='uc.accountDetails.monitoring.email.general-failure'
            defaultMessage='Something has gone wrong. Please ensure your email address is formatted correctly'
          />
        </CuiAlert>
      </Fragment>
    )
  }

  addEmail() {
    const { saveMonitoringEmailWhitelist } = this.props
    const { email } = this.state

    saveMonitoringEmailWhitelist(email)
  }
}

export default injectIntl(MonitoringEmailsWhitelist)
