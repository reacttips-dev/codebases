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

import React, { Fragment, Component } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiLoadingContent, EuiRadioGroup, EuiSpacer, EuiText } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'

import Permission from '../../../lib/api/v1/permissions'

import { AccountResponse, AccountUpdateRequest } from '../../../lib/api/v1/types'
import { AsyncRequestState } from '../../../types'

export type Props = {
  currentAccount: AccountResponse | null
  fetchCurrentAccount: () => void
  updateCurrentAccount: (payload: AccountUpdateRequest) => void
  fetchCurrentAccountRequest: AsyncRequestState
  updateCurrentAccountRequest: AsyncRequestState
  resetUpdateCurrentAccount: () => void
  resetFetchCurrentAccount: () => void
}

class SetDefaultTrust extends Component<Props> {
  componentDidMount(): void {
    const { fetchCurrentAccount } = this.props

    fetchCurrentAccount()
  }

  componentWillUnmount(): void {
    const { resetFetchCurrentAccount, resetUpdateCurrentAccount } = this.props

    resetFetchCurrentAccount()
    resetUpdateCurrentAccount()
  }

  render(): JSX.Element {
    const {
      currentAccount,
      updateCurrentAccount,
      fetchCurrentAccountRequest,
      updateCurrentAccountRequest,
    } = this.props

    if (fetchCurrentAccountRequest.error) {
      return (
        <Fragment>
          <CuiAlert type='error' data-test-id='fetch-current-account-request-error'>
            {fetchCurrentAccountRequest.error}
          </CuiAlert>

          <EuiSpacer size='s' />
        </Fragment>
      )
    }

    if (!currentAccount) {
      return <EuiLoadingContent data-test-id='current-account-loading' />
    }

    const trustAll = Boolean(currentAccount?.trust?.trust_all)

    return (
      <Fragment>
        <CuiPermissibleControl permissions={Permission.updateCurrentAccount}>
          <EuiRadioGroup
            options={[
              {
                id: `true`,
                value: `true`,
                'data-test-subj': `trust-all`,
                label: (
                  <FormattedMessage
                    id='trust-management.default-trust-radio-all'
                    defaultMessage='Trust all my deployments (includes future deployments)'
                  />
                ),
              },
              {
                id: `false`,
                value: `false`,
                'data-test-subj': `trust-none`,
                label: (
                  <FormattedMessage
                    id='trust-management.default-trust-radio-none'
                    defaultMessage='Trust no deployment'
                  />
                ),
              },
            ]}
            data-test-id='set-default-trust'
            idSelected={String(trustAll)}
            disabled={updateCurrentAccountRequest.inProgress}
            onChange={(radioId) => {
              updateCurrentAccount({
                trust: {
                  trust_all: radioId === `true` ? true : false,
                },
              })
            }}
          />
        </CuiPermissibleControl>

        <EuiSpacer size='s' />

        {updateCurrentAccountRequest.error && (
          <Fragment>
            <CuiAlert type='error' data-test-id='update-current-account-request-error'>
              {updateCurrentAccountRequest.error}
            </CuiAlert>

            <EuiSpacer size='s' />
          </Fragment>
        )}

        <EuiText color='subdued' size='xs'>
          <FormattedMessage
            id='trust-management.default-trust-radio-help-text'
            defaultMessage='At the deployment level, you can trust all, none, or specific deployments.'
          />
        </EuiText>
      </Fragment>
    )
  }
}

export default SetDefaultTrust
