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

import { isEmpty } from 'lodash'
import moment from 'moment'
import cx from 'classnames'

import React, { Component, Fragment, ReactElement } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButtonIcon,
  EuiFlexItem,
  EuiFlexGroup,
  EuiHorizontalRule,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { addToast, CuiAlert, CuiTable, CuiTableColumn, CuiPermissibleControl } from '../../cui'

import DocLink from '../DocLink'
import PrivacySensitiveContainer from '../PrivacySensitiveContainer'
import EmptyApiKeysTable from '../EmptyApiKeysTable'

import RevokeKeyModal from './RevokeKeyModal'
import GenerateKeyModal from './GenerateKeyModal'
import GenerateApiKeyButton from './GenerateApiKeyButton'

import messages from './messages'

import history from '../../lib/history'

import Permission from '../../lib/api/v1/permissions'

import { AsyncRequestState } from '../../types'
import { ApiKeyResponse } from '../../lib/api/v1/types'

import './apiKeys.scss'

export type Props = WrappedComponentProps & {
  fetchApiKeys: () => Promise<any>
  fetchKeysRequest: AsyncRequestState
  revokeApiKeyRequest: AsyncRequestState
  resetRevokeKeyRequest: () => void
  revokeApiKey: (id: string) => Promise<any>
  apiKeys: ApiKeyResponse[]
  generateApiKey: (key: { token: string; description: string }) => Promise<any>
  generateKeyRequest: AsyncRequestState
  showApiKeys: boolean
  eceDisplay?: boolean
  // adding type to string because then I don't have to import FormattedMessage in tests
  eceTitle?: string | ReactElement<typeof FormattedMessage>
}

type State = {
  showRevokeKeyModal: boolean
  showGenerateKeyModal: boolean
  key: ApiKeyResponse | null
}

class ApiKeys extends Component<Props, State> {
  state: State = {
    showRevokeKeyModal: false,
    showGenerateKeyModal: false,
    key: null,
  }

  componentDidMount() {
    const { fetchApiKeys, showApiKeys, eceDisplay } = this.props

    // `eceDisplay` means this is a top-level render, so we shouldn't navigate away
    if (!showApiKeys && !eceDisplay) {
      history.push(`/`)
      return
    }

    fetchApiKeys()
  }

  componentWillUnmount() {
    const { resetRevokeKeyRequest } = this.props
    resetRevokeKeyRequest()
  }

  render() {
    const {
      fetchKeysRequest,
      generateApiKey,
      generateKeyRequest,
      apiKeys,
      revokeApiKeyRequest,
      fetchApiKeys,
      showApiKeys,
      eceTitle,
      eceDisplay = false,
    } = this.props

    const { showGenerateKeyModal, showRevokeKeyModal, key } = this.state

    if (!showApiKeys) {
      return null
    }

    return (
      <Fragment>
        <div>
          {eceDisplay && <EuiHorizontalRule />}

          <PrivacySensitiveContainer id='api-keys' className={cx({ 'apiKeys-ece': eceDisplay })}>
            {eceDisplay && (
              <div>
                <EuiTitle size='xs'>
                  <h3>{eceTitle}</h3>
                </EuiTitle>
                <EuiSpacer size='s' />
              </div>
            )}

            <EuiFlexGroup direction={eceDisplay ? `row` : `column`}>
              {apiKeys?.length ? (
                <Fragment>
                  <EuiSpacer size='m' />
                  <EuiFlexItem>
                    <EuiText
                      grow={false}
                      color={eceDisplay ? 'subdued' : undefined}
                      size={eceDisplay ? 's' : undefined}
                    >
                      <FormattedMessage
                        id='api-keys.overview'
                        defaultMessage='An API key allows you to perform most of the operations available in the UI console through API calls. You can create and manage deployments, configure remote clusters, set up traffic filters, manage extensions, and much more. {learnMore}'
                        values={{
                          learnMore: (
                            <DocLink link='apiKeysDocLink'>
                              <FormattedMessage
                                id='api-keys.overview.learn-more'
                                defaultMessage='Learn more'
                              />
                            </DocLink>
                          ),
                        }}
                      />
                    </EuiText>
                  </EuiFlexItem>
                </Fragment>
              ) : null}

              <EuiFlexItem className={cx({ 'apiKeys-tableWrap': eceDisplay })}>
                {this.renderKeysTable()}

                <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='center'>
                  <EuiFlexItem grow={false}>
                    <CuiPermissibleControl
                      permissions={[Permission.reAuthenticate, Permission.createApiKey]}
                    >
                      <GenerateApiKeyButton
                        onClick={this.showGenerateKeyModal}
                        {...{ eceDisplay }}
                      />
                    </CuiPermissibleControl>
                  </EuiFlexItem>

                  {revokeApiKeyRequest.inProgress && (
                    <EuiFlexItem grow={false}>
                      <EuiLoadingSpinner size='l' />
                    </EuiFlexItem>
                  )}
                </EuiFlexGroup>
              </EuiFlexItem>

              {fetchKeysRequest.error && (
                <Fragment>
                  <EuiSpacer size='m' />
                  <CuiAlert type='danger'>{fetchKeysRequest.error}</CuiAlert>
                </Fragment>
              )}

              {revokeApiKeyRequest.error && (
                <Fragment>
                  <EuiSpacer size='m' />
                  <CuiAlert type='danger'>{revokeApiKeyRequest.error}</CuiAlert>
                </Fragment>
              )}

              {showGenerateKeyModal && (
                <GenerateKeyModal
                  generateApiKey={generateApiKey}
                  generateKeyRequest={generateKeyRequest}
                  apiKeys={apiKeys}
                  onCancel={this.closeGenerateKeyModal}
                  onConfirm={this.confirmGenerate}
                  fetchApiKeys={fetchApiKeys}
                />
              )}

              {showRevokeKeyModal && (
                <RevokeKeyModal
                  revokeApiKeysRequest={revokeApiKeyRequest}
                  keys={[key]}
                  onCancel={this.closeRevokeKeyModal}
                  onConfirm={this.confirmRevoke}
                />
              )}
            </EuiFlexGroup>
          </PrivacySensitiveContainer>
        </div>
      </Fragment>
    )
  }

  renderKeysTable = () => {
    const { apiKeys, fetchKeysRequest, intl, eceDisplay } = this.props
    const { formatMessage } = intl

    if (apiKeys && apiKeys.length === 0) {
      return <EmptyApiKeysTable loading={fetchKeysRequest.inProgress} />
    }

    const columns: Array<CuiTableColumn<ApiKeyResponse>> = [
      {
        label: formatMessage(messages.keyNameColumn),
        render: (apiKey) => apiKey.description,
        sortKey: `description`,
      },
      {
        label: formatMessage(messages.keyCreatedOnColumn),
        render: (apiKey) => moment(apiKey.creation_date).format('MMMM Do YYYY, h:mm a'),
        sortKey: `creation_date`,
      },
      {
        mobile: {
          label: formatMessage(messages.keyActionsColumn),
        },
        label: formatMessage(messages.keyRevokeColumn),
        actions: true,
        align: `right` as const,
        width: `15%`,
        render: (apiKey) => (
          <div data-test-id='revoke-api-key'>
            <EuiButtonIcon
              aria-label={formatMessage(messages.keyRevokeColumn)}
              onClick={() => this.showRevokeKeyModal(apiKey)}
              iconType='trash'
              color='danger'
            />
          </div>
        ),
      },
    ]

    return (
      <Fragment>
        {!eceDisplay && <EuiSpacer />}

        <CuiTable<ApiKeyResponse>
          className='apiKeys-table'
          columns={columns}
          rows={isEmpty(apiKeys) ? [] : apiKeys}
        />

        <EuiSpacer />
      </Fragment>
    )
  }

  showRevokeKeyModal = (apiKey: ApiKeyResponse) => {
    this.setState({ showRevokeKeyModal: true, key: apiKey })
  }

  closeRevokeKeyModal = () => {
    this.setState({ showRevokeKeyModal: false, key: null })
  }

  confirmRevoke = () => {
    const {
      intl: { formatMessage },
      revokeApiKey,
    } = this.props

    const { key } = this.state

    const revokeApiKeySuccess = {
      id: 'revokeKeySuccess',
      family: `api-key.revoke-key-success`,
      title: formatMessage(messages.revokeSuccess, {
        keyName: key!.description,
      }),
      color: 'success',
    }

    return revokeApiKey(key!.id)
      .then(() => {
        this.closeRevokeKeyModal()
        addToast(revokeApiKeySuccess)
        return
      })
      .catch(() => {
        this.closeRevokeKeyModal()
        return
      })
  }

  showGenerateKeyModal = () => {
    this.setState({ showGenerateKeyModal: true })
  }

  closeGenerateKeyModal = () => {
    this.setState({ showGenerateKeyModal: false })
  }

  confirmGenerate = () => {
    this.closeGenerateKeyModal()
  }
}

export default injectIntl(ApiKeys)
