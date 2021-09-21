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

import { get } from 'lodash'

import cx from 'classnames'

import React, { Component } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui'

import { GenerateKeyForm, GenerateKeyFormFooter } from './GenerateKeyForm'

import GeneratedApiKey from './GeneratedApiKey'
import GeneratedApiKeyFooter from './GeneratedApiKeyFooter'

import messages from './messages'

import { AsyncRequestState } from '../../types'
import { ApiKeyResponse } from '../../lib/api/v1/types'

interface Props extends WrappedComponentProps {
  onCancel: () => void
  onConfirm: () => void
  apiKeys: ApiKeyResponse[]
  generateApiKey: (key: { description: string }) => Promise<any>
  generateKeyRequest: AsyncRequestState
  fetchApiKeys: () => Promise<any>
}

type Step = 'create-step' | 'download-step'

type State = {
  apiKey: ApiKeyResponse | null
  authenticated: boolean
  currentStep: Step
  password: string
  authError: string | null
  passwordInvalid: boolean
  keyNameInvalid: boolean
  newKeyName: string | null
  keyError: JSX.Element[]
  lastStep: boolean
}

class GenerateKeyModal extends Component<Props, State> {
  mounted = false

  state: State = {
    apiKey: null,
    authenticated: false,
    currentStep: 'create-step',
    password: ``,
    authError: ``,
    passwordInvalid: false,
    keyNameInvalid: false,
    newKeyName: ``,
    keyError: [],
    lastStep: false,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { generateKeyRequest, onCancel } = this.props
    const { currentStep, keyNameInvalid, keyError, apiKey, lastStep } = this.state

    const keyName = apiKey && apiKey.description ? apiKey.description : ``

    const createStep = {
      title: messages.generateModalTitle,
      component: (
        <GenerateKeyForm
          onChange={this.onChange}
          onNext={this.generateApiKey}
          keyNameInvalid={keyNameInvalid}
          errors={keyError}
        />
      ),
      footer: (
        <GenerateKeyFormFooter
          generateKeyRequest={generateKeyRequest}
          onCancel={onCancel}
          onNext={this.generateApiKey}
        />
      ),
    }

    const downloadStep = {
      title: keyName,
      component: <GeneratedApiKey apiKey={apiKey!} />,
      footer: <GeneratedApiKeyFooter apiKey={apiKey!} onClose={onCancel} />,
    }

    const step = currentStep === 'create-step' ? createStep : downloadStep

    const stepTitle =
      typeof step.title === `string` ? step.title : <FormattedMessage {...step.title} />

    return (
      <EuiOverlayMask>
        <EuiModal
          onClose={onCancel}
          className={cx('apiKey-modal', {
            keyStep: currentStep === 'create-step',
          })}
        >
          <div
            className={cx('apiKey-modal', {
              transitionHideContent: lastStep,
              transitionShowContent: currentStep,
            })}
          >
            <EuiModalHeader data-test-id='generateKey-modal'>
              <EuiModalHeaderTitle>{stepTitle}</EuiModalHeaderTitle>
            </EuiModalHeader>
            <EuiModalBody>{step.component}</EuiModalBody>
            <EuiModalFooter>{step.footer}</EuiModalFooter>
          </div>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  onChange = (e: React.SyntheticEvent): void => {
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value })
  }

  generateApiKey = () => {
    const { apiKeys, generateApiKey, fetchApiKeys } = this.props
    const { newKeyName } = this.state

    const isNameValid =
      apiKeys && apiKeys.length > 0
        ? apiKeys.filter((key) => key.description === newKeyName).length === 0
        : true

    if (!newKeyName || newKeyName.length < 1) {
      this.setState({
        newKeyName: null,
        keyNameInvalid: true,
        keyError: [
          <FormattedMessage key={messages.keyNameEmptyError.id} {...messages.keyNameEmptyError} />,
        ],
      })
      return
    }

    if (!isNameValid) {
      this.setState({
        newKeyName: ``,
        keyNameInvalid: true,
        keyError: [<FormattedMessage key={messages.keyNameError.id} {...messages.keyNameError} />],
      })
      return
    }

    generateApiKey({ description: newKeyName })
      .then((response) => {
        if (this.mounted) {
          this.setState({
            apiKey: response.payload,
            newKeyName: response.payload.description,
            currentStep: 'download-step',
          })
        }

        // Fetching the latest list of api keys here rather than in the
        // generateApiKey action because we need to response from the
        // generateApiKey action for the last modal step (download and view
        // the new api key)
        fetchApiKeys()
        return
      })
      .catch(() => {
        const { generateKeyRequest } = this.props
        const error = get(generateKeyRequest, [`error`, `body`, `errors`, `0`, `message`])
        this.setState({
          newKeyName: ``,
          keyNameInvalid: true,
          keyError: [error],
        })
        return
      })
  }
}

export default injectIntl(GenerateKeyModal)
