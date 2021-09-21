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

import { cloneDeep, filter } from 'lodash'

import React, { Component, Fragment } from 'react'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTextArea,
  EuiTitle,
  htmlIdGenerator,
} from '@elastic/eui'

import { addToast } from '../../../../cui'

import SpinButton from '../../../SpinButton'

import SecretType from '../SecretType'

import untab from '../../../../lib/untab'

import { AsyncRequestState, Keystore } from '../../../../types'

import './ManageKeystore.scss'

const makeId = htmlIdGenerator()

const messages = defineMessages({
  type: {
    id: `keystore.flyout.form.type-label`,
    defaultMessage: `Type`,
  },
  key: {
    id: `keystore.flyout.form.key-label`,
    defaultMessage: `Key`,
  },
  settingName: {
    id: `keystore.flyout.form.settingName-label`,
    defaultMessage: `Setting name`,
  },
  secret: {
    id: `keystore.flyout.form.secret-label`,
    defaultMessage: `Secret`,
  },
  json: {
    id: `keystore.flyout.form.edit-as-json`,
    defaultMessage: `Edit as JSON`,
  },
  parentKeyPlaceholder: {
    id: `keystore.flyout.form.parent-key-placeholder`,
    defaultMessage: `e.g. s3.client.example.access_key`,
  },
  required: {
    id: `keystore.flyout.required`,
    defaultMessage: `Required`,
  },
  matchRegex: {
    id: `keystore.flyout.match-regex`,
    defaultMessage: `Setting name may only contain lower case letters, numbers, and the following characters: _-.`,
  },
  removeLine: {
    id: `keystore.flyout.remove-line`,
    defaultMessage: `Remove Line`,
  },
})

const filePlaceholder = untab(`// Include the contents of the value field
// Below is an example of how to format a GCS Client
// {
//    "type": "<TYPE>"
//    "project_id": "<PROJECT_ID>"
//    "private_key_id": "<PRIVATE_KEY_ID>"
//    "private_key": "<PRIVATE_KEY>"
//    "client_email": "<CLIENT_EMAIL>"
//    "auth_uri": "<AUTH_URI>"
//    "token_uri": "<TOKEN_URI>"
//    "auth_provider_x509_cert_url": "<AUTH_PROVIDER_X509_CERT_URL>"
//    "client_x509_cert_url": "<CLIENT_X509_CERT_URL>"
// }
`)

const toastText = {
  secretCreationSuccess: {
    family: 'keystore',
    title: (
      <FormattedMessage
        id='keystore.add-setting.success'
        defaultMessage='Setting successfully saved'
      />
    ),
    color: 'success',
  },
}

type KeySecretPair = {
  key: string
  secret: string
  id: string
}

export type Props = {
  intl: IntlShape
  closeFlyout: () => void
  addSecretToKeystore: (secrets: Keystore) => Promise<any>
  createSecretRequest: AsyncRequestState
  onSaveError: () => void
}

type State = {
  type: 'single' | 'multi' | 'file'
  keySecretPairs: KeySecretPair[]
  parentKey: string
  secret: string
  isInvalid: boolean
  invalidReason: string | null
}

class ManageKeystore extends Component<Props, State> {
  state: State = {
    type: 'single',
    keySecretPairs: [{ key: '', secret: '', id: makeId() }],
    parentKey: '',
    secret: '',
    isInvalid: false,
    invalidReason: null,
  }

  render() {
    const { closeFlyout } = this.props

    return (
      <EuiFlyout
        onClose={closeFlyout}
        maxWidth={600}
        aria-labelledby='manageKeystore-flyoutTitle'
        ownFocus={true}
      >
        {this.renderHeader()}

        {this.renderBody()}
        {this.renderFooter()}
      </EuiFlyout>
    )
  }

  renderHeader() {
    return (
      <EuiFlyoutHeader>
        <EuiTitle size='m'>
          <h2 id='manageKeystore-flyoutTitle'>
            <FormattedMessage
              id='keystore.flyout.title.create-setting'
              defaultMessage='Create setting'
            />
          </h2>
        </EuiTitle>
      </EuiFlyoutHeader>
    )
  }

  renderBody() {
    const { type, parentKey, isInvalid, invalidReason } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <EuiFlyoutBody>
        <EuiFlexGroup
          direction='column'
          className='manageKeystore-flyoutBody'
          justifyContent='spaceBetween'
          gutterSize='none'
        >
          <EuiFlexItem grow={false}>
            <EuiFlexGroup direction='column' gutterSize='none'>
              <EuiFormRow
                fullWidth={true}
                label={formatMessage(messages.settingName)}
                isInvalid={isInvalid}
                error={isInvalid && invalidReason ? formatMessage(messages[invalidReason]) : null}
              >
                <EuiFieldText
                  value={parentKey}
                  onChange={this.onChangeParentKey}
                  fullWidth={true}
                  placeholder={formatMessage(messages.parentKeyPlaceholder)}
                  isInvalid={isInvalid}
                  data-test-id='manageKeystore-keyName'
                />
              </EuiFormRow>
              <EuiText color='subdued' size='xs' className='manageKeystore-helpText'>
                <FormattedMessage
                  id='keystore.flyout.form.settingName-help'
                  defaultMessage='Must be unique. For certain values, strict formatting is required.'
                />
              </EuiText>

              <EuiSpacer />

              <SecretType
                selected={type}
                label={formatMessage(messages.type)}
                onChange={this.onChangeButtonGroup}
              />

              {this.renderFields()}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutBody>
    )
  }

  renderFooter() {
    const { closeFlyout, createSecretRequest } = this.props
    const { isInvalid } = this.state

    return (
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty iconType='cross' onClick={closeFlyout} flush='left'>
              <FormattedMessage id='keystore.flyout.close' defaultMessage='Close' />
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <SpinButton
              disabled={isInvalid}
              onClick={this.createSecret}
              spin={createSecretRequest.inProgress}
              fill={true}
              className='manageKeystore-saveButton'
              data-test-id='manageKeystore-saveButton'
            >
              <FormattedMessage id='keystore.flyout.save' defaultMessage='Save' />
            </SpinButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    )
  }

  renderFields() {
    const { type } = this.state

    if (type === 'single') {
      return this.renderSingleField()
    }

    if (type === 'multi') {
      return this.renderMultiFields()
    }

    if (type === 'file') {
      return this.renderFileField()
    }

    return null
  }

  renderSingleField() {
    const {
      intl: { formatMessage },
    } = this.props
    const { secret } = this.state

    return (
      <EuiFormRow label={formatMessage(messages.secret)} fullWidth={true}>
        <EuiFieldText
          name='secret'
          value={secret}
          onChange={this.onChangeSecret}
          fullWidth={true}
        />
      </EuiFormRow>
    )
  }

  renderMultiFields() {
    const { keySecretPairs } = this.state
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Fragment>
        {keySecretPairs.map((pair, i) => (
          <EuiFlexGroup key={pair.id} className='manageKeystore-keySecretPair'>
            <EuiFlexItem>
              <EuiFormRow label={formatMessage(messages.key)}>
                <EuiFieldText
                  name={`key-${i}`}
                  value={pair.key}
                  onChange={this.onChangeKeySecret}
                  data-name='key'
                  data-id={i}
                  data-test-id='manageKeystore-keyField'
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow label={formatMessage(messages.secret)}>
                <EuiFieldText
                  name={`secret-${i}`}
                  value={pair.secret}
                  onChange={this.onChangeKeySecret}
                  data-name='secret'
                  data-id={i}
                  data-test-id='manageKeystore-secretField'
                />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup alignItems='center'>
                <EuiButtonIcon
                  onClick={() => this.deleteRow(pair.id)}
                  aria-label={formatMessage(messages.removeLine)}
                  iconType='cross'
                  color='danger'
                  disabled={i === 0}
                  className='manageKeystore-deleteRow'
                />
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        ))}

        <div>
          <EuiButtonEmpty onClick={this.addValue} data-test-id='manageKeystore-addField'>
            <FormattedMessage id='keystore.flyout.form.add-field' defaultMessage='Add Field' />
          </EuiButtonEmpty>
        </div>
      </Fragment>
    )
  }

  renderFileField() {
    const {
      intl: { formatMessage },
    } = this.props
    const { secret } = this.state
    return (
      <EuiFormRow label={formatMessage(messages.secret)} fullWidth={true}>
        <EuiTextArea
          value={secret}
          onChange={this.onChangeSecret}
          fullWidth={true}
          className='manageKeystore-fileInput'
          placeholder={filePlaceholder}
          rows={15}
        />
      </EuiFormRow>
    )
  }

  addValue = (): void => {
    const { keySecretPairs } = this.state
    const newKeySecretPairs = cloneDeep(keySecretPairs)
    newKeySecretPairs.push({ key: '', secret: '', id: makeId() })
    this.setState({ keySecretPairs: newKeySecretPairs })
  }

  createSecret = (): void => {
    const { addSecretToKeystore, closeFlyout, onSaveError } = this.props
    const { parentKey } = this.state

    if (parentKey.length === 0) {
      this.setState({ isInvalid: true, invalidReason: 'required' })
      return
    }

    const secrets = this.formatData()

    addSecretToKeystore(secrets)
      .then(() => {
        closeFlyout()
        addToast({
          ...toastText.secretCreationSuccess,
        })
        return
      })
      .catch(() => {
        closeFlyout()
        onSaveError()
      })
  }

  formatData = (): Keystore => {
    const { keySecretPairs, type, parentKey, secret } = this.state

    if (type === 'single') {
      return {
        [parentKey]: {
          value: secret,
        },
      }
    }

    if (type === 'file') {
      return {
        [parentKey]: {
          value: secret,
          as_file: true,
        },
      }
    }

    if (type === 'multi') {
      return {
        [parentKey]: {
          value: keySecretPairs.reduce((obj, item) => {
            obj[item.key] = item.secret
            return obj
          }, {}),
        },
      }
    }

    return {}
  }

  onChangeButtonGroup = (optionId) => {
    this.setState({
      type: optionId,
      keySecretPairs: [{ key: '', secret: '', id: makeId() }],
      secret: '',
    })
  }

  onChangeParentKey = (e) => {
    const {
      target: { value },
    } = e
    const parentKeyRegExp = /^[a-z0-9_\-.]+$/

    if (!parentKeyRegExp.test(value)) {
      this.setState({ isInvalid: true, invalidReason: 'matchRegex' })
    } else {
      this.setState({ isInvalid: false, invalidReason: null })
    }

    this.setState({ parentKey: value })
  }

  onChangeKeySecret = (e) => {
    const { keySecretPairs } = this.state
    const newKeySecretPairs = cloneDeep(keySecretPairs)
    newKeySecretPairs[e.target.dataset.id][e.target.dataset.name] = e.target.value

    this.setState({ keySecretPairs: newKeySecretPairs })
  }

  onChangeSecret = (e) => {
    this.setState({ secret: e.target.value })
  }

  deleteRow(id) {
    const { keySecretPairs } = this.state

    const remainingPairs = filter(keySecretPairs, (pair) => pair.id !== id)

    this.setState({ keySecretPairs: remainingPairs })
  }
}

export default injectIntl(ManageKeystore)
