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

import React, { Component, Fragment, ReactNode } from 'react'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { noop } from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiFormRow,
  EuiIcon,
  EuiSpacer,
} from '@elastic/eui'

import { CuiTable } from '../../../../cui'

const messages = defineMessages({
  addNewEmail: {
    id: `uc.accountDetails.contactForm.placeholder`,
    defaultMessage: `Add new email`,
  },
})

type Props = {
  intl: IntlShape
  contacts: string[]
  onAdd: (emailAddress: string) => Promise<any>
  onRemove: (emailAddress: string) => void
  error: ReactNode
}

type State = {
  toBeAdded: string
  adding: boolean
}

class ContactTable extends Component<Props, State> {
  inputRef: HTMLInputElement | null

  state: State = {
    toBeAdded: ``,
    adding: false,
  }

  render() {
    const { adding, toBeAdded } = this.state
    const {
      intl: { formatMessage },
      contacts,
      onRemove,
      error,
    } = this.props

    const disabled = adding || toBeAdded.length === 0

    const addEmailPlaceholder = formatMessage(messages.addNewEmail)

    const columns = [
      {
        label: <FormattedMessage id='deployment-activity-table.contact' defaultMessage='Contact' />,
        render: (contact) => contact,
        footer: {
          verticalAlign: `top` as const,
          render: () => (
            <Fragment>
              <EuiSpacer size='xs' />
              <EuiFormRow isInvalid={!!error} error={error}>
                <EuiFieldText
                  inputRef={(r) => {
                    this.inputRef = r
                  }}
                  isInvalid={!!error}
                  value={this.state.toBeAdded}
                  onChange={(e) =>
                    this.setState({ toBeAdded: (e.target as HTMLInputElement).value })
                  }
                  placeholder={addEmailPlaceholder}
                />
              </EuiFormRow>
              <EuiSpacer size='xs' />
            </Fragment>
          ),
        },
      },
      {
        label: <FormattedMessage id='deployment-activity-table.actions' defaultMessage='Actions' />,
        render: (contact) => (
          <EuiButtonEmpty size='s' onClick={() => onRemove(contact)}>
            <EuiIcon type='cross' color='danger' />
          </EuiButtonEmpty>
        ),
        footer: {
          verticalAlign: `top` as const,
          render: () => (
            <Fragment>
              <EuiSpacer size='xs' />
              <EuiButton onClick={this.add} disabled={disabled}>
                <FormattedMessage
                  id='uc.accountDetails.contactForm.addButton'
                  defaultMessage='Add'
                />
              </EuiButton>
              <EuiSpacer size='xs' />
            </Fragment>
          ),
        },
      },
    ]

    return (
      <CuiTable className='contact-table' rows={contacts} columns={columns} hasFooterRow={true} />
    )
  }

  add = () => {
    this.setState({ adding: true })
    return this.props
      .onAdd(this.state.toBeAdded)
      .then(() => this.setState({ toBeAdded: `` }))
      .catch(noop)
      .finally(() => {
        this.setState({ adding: false })

        if (this.inputRef) {
          this.inputRef.focus()
        }
      })
  }
}

export default injectIntl(ContactTable)
