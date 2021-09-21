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

import { keys } from 'lodash'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiButtonIcon,
  EuiDescribedFormGroup,
  EuiSpacer,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'

import { addToast, CuiAlert, CuiTable, CuiPermissibleControl } from '../../../cui'

import ManageKeystore from './ManageKeystore'

import DangerButton from '../../DangerButton'
import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

import Permission from '../../../lib/api/v1/permissions'

import { AsyncRequestState, Keystore as KeystoreType, StackDeployment } from '../../../types'
import DocLink from '../../DocLink'

export type Props = {
  deployment: StackDeployment
  fetchKeystore: () => Promise<any>
  keystore?: KeystoreType
  deleteSecretFromKeystore: (key: string) => Promise<any>
  deleteSecretRequest: (key: string) => AsyncRequestState
  systemOwned: boolean
}

type State = {
  isFlyoutOpen: boolean
  selectedToggleId: string
  hasDeletionError: boolean
  hasSaveError: boolean
}

const toastText = {
  secretDeletionSuccess: {
    family: 'keystore',
    title: (
      <FormattedMessage
        id='keystore.delete-setting.success'
        defaultMessage='Setting successfully deleted'
      />
    ),
    color: 'success',
  },
}

class Keystore extends Component<Props, State> {
  state: State = {
    isFlyoutOpen: false,
    selectedToggleId: 'single',
    hasDeletionError: false,
    hasSaveError: false,
  }

  componentDidMount() {
    const { fetchKeystore, systemOwned } = this.props

    if (!systemOwned) {
      fetchKeystore()
    }
  }

  render() {
    const { deployment, keystore, deleteSecretRequest, systemOwned } = this.props
    const { isFlyoutOpen, hasDeletionError, hasSaveError } = this.state

    const rows = keystore
      ? keys(keystore).map((key) => ({
          name: key,
        }))
      : []

    const columns = [
      {
        label: <FormattedMessage id='keystore.settingName' defaultMessage='Setting Name' />,
        render: (secret) => secret.name,
        sortKey: `name`,
      },
      {
        mobile: {
          label: <FormattedMessage id='keystore.actions' defaultMessage='Actions' />,
        },
        actions: true,
        render: (secret) => {
          const request = deleteSecretRequest(secret.name)

          return (
            <span data-test-id='keystore-deleteButton'>
              <CuiPermissibleControl permissions={Permission.setDeploymentEsResourceKeystore}>
                <DangerButton
                  buttonType={EuiButtonIcon}
                  buttonProps={{ color: `danger` }}
                  onConfirm={() => this.deleteSecret(secret.name)}
                  isBusy={request.inProgress}
                  spin={request.inProgress}
                  modal={{
                    title: (
                      <FormattedMessage
                        id='keystore.secret.confirm-to-delete'
                        defaultMessage='Delete keystore secret {name}?'
                        values={{ name: secret.name }}
                      />
                    ),
                  }}
                  iconType='trash'
                  aria-label='Delete'
                />
              </CuiPermissibleControl>
            </span>
          )
        },
        width: `50px`,
      },
    ]

    return (
      <PrivacySensitiveContainer>
        <EuiDescribedFormGroup
          fullWidth={true}
          title={
            <h3>
              <FormattedMessage id='keystore.title' defaultMessage='Elasticsearch keystore' />
            </h3>
          }
          description={
            <FormattedMessage
              id='keystore.description.how-to'
              tagName='p'
              defaultMessage='After adding a key and its secret value to the keystore, you can use the key in place of the secret value when you configure sensitive settings. IMPORTANT: Modifications to the non-reloadable keystore take effect only after restarting Elasticsearch. Reloadable keystore changes take effect after issuing a `reload_secure_settings` call. Adding unsupported settings to the keystore will cause Elasticsearch to fail to start. {learnMore}'
              values={{
                learnMore: (
                  <DocLink link='configureKeystore'>
                    <FormattedMessage id='keystore.learn-more' defaultMessage='Learn more' />
                  </DocLink>
                ),
              }}
            />
          }
        >
          <div>
            <div>
              {systemOwned ? (
                <EuiToolTip
                  position='right'
                  content={
                    <FormattedMessage
                      id='keystore.create-settings-button.disabled'
                      defaultMessage='Keystore settings cannot be added to system deployments.'
                    />
                  }
                >
                  <EuiButton data-test-id='keystore-createSettingsButton' size='s' disabled={true}>
                    <FormattedMessage
                      id='keystore.add-settings-button'
                      defaultMessage='Add settings'
                    />
                  </EuiButton>
                </EuiToolTip>
              ) : (
                <CuiPermissibleControl permissions={Permission.setDeploymentEsResourceKeystore}>
                  <EuiButton
                    data-test-id='keystore-createSettingsButton'
                    size='s'
                    onClick={() => this.setState({ isFlyoutOpen: true })}
                  >
                    <FormattedMessage
                      id='keystore.add-settings-button'
                      defaultMessage='Add settings'
                    />
                  </EuiButton>
                </CuiPermissibleControl>
              )}
            </div>

            {rows.length > 0 && (
              <Fragment>
                <EuiSpacer size='l' />

                <EuiTitle size='s'>
                  <h3>
                    <FormattedMessage id='keystore.list.title' defaultMessage='Security keys' />
                  </h3>
                </EuiTitle>

                <CuiTable rows={rows} columns={columns} />
              </Fragment>
            )}

            {hasDeletionError && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='error'>
                  <FormattedMessage
                    id='keystore.delete-setting.failure'
                    defaultMessage='Setting failed to be deleted'
                  />
                </CuiAlert>
              </Fragment>
            )}

            {hasSaveError && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='error'>
                  <FormattedMessage
                    id='keystore.add-setting.failure'
                    defaultMessage='Setting failed to be saved'
                  />
                </CuiAlert>
              </Fragment>
            )}
          </div>
        </EuiDescribedFormGroup>

        {isFlyoutOpen && (
          <ManageKeystore
            deployment={deployment}
            closeFlyout={this.closeFlyout}
            onSaveError={this.onSaveError}
          />
        )}
      </PrivacySensitiveContainer>
    )
  }

  closeFlyout = () => {
    this.setState({ isFlyoutOpen: false })
  }

  onDeleteError = () => {
    this.setState({ hasDeletionError: true })
  }

  onSaveError = () => {
    this.setState({ hasSaveError: true })
  }

  deleteSecret = (key: string): void => {
    const { deleteSecretFromKeystore } = this.props

    deleteSecretFromKeystore(key)
      .then(() => {
        addToast({
          ...toastText.secretDeletionSuccess,
        })
        return
      })
      .catch(() => {
        this.onDeleteError()
      })
  }
}

export default Keystore
