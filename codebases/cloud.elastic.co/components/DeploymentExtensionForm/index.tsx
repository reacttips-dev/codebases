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

import { cloneDeep, get, isEmpty, some, omit } from 'lodash'

import React, { Component, ReactNode, Fragment } from 'react'
import { injectIntl, defineMessages, FormattedMessage, IntlShape } from 'react-intl'

import {
  EuiFormRow,
  EuiFieldText,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiRadioGroup,
  EuiTextArea,
  EuiCode,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, CuiHelpTipIcon } from '../../cui'

import SpinButton from '../SpinButton'
import ExternalLink from '../ExternalLink'

import DeploymentExtensionUpload from './DeploymentExtensionUpload'

import { replaceIn } from '../../lib/immutability-helpers'

import { AsyncRequestState, PlainHashMap } from '../../types'
import { Extension, CreateExtensionRequest, UpdateExtensionRequest } from '../../lib/api/v1/types'

export type Props = {
  intl: IntlShape
  extensionUnderEdit?: Extension
  canEditPlugins: boolean
  canEditBundles: boolean
  busy?: boolean
  cancel?: () => void
  cancelButton?: ReactNode
  save: (changes: {
    extension: CreateExtensionRequest | UpdateExtensionRequest
    file: File | null
  }) => void
  saveRequest: AsyncRequestState
  uploadRequest?: AsyncRequestState
}

type State = {
  extension: CreateExtensionRequest | UpdateExtensionRequest
  file: File | null
  showErrors: boolean
}

type ExtensionType = Extension['extension_type']

export const validFormats = {
  bundle: [
    /^\d+\.\d+\.\d+$/, // x.y.z
    /^\d+\.\*$/, // x.*
    /^\*$/, // *
  ],
  plugin: [
    /^\d+\.\d+\.\d+$/, // x.y.z
  ],
}

const messages = defineMessages({
  featureDisabledHelp: {
    id: `deployment-extension-form.featureDisabledHelp`,
    defaultMessage: `Why is this disabled?`,
  },
})

class DeploymentExtensionForm extends Component<Props, State> {
  state: State = {
    extension: this.getInitialEditorState(this.props),
    file: null,
    showErrors: false,
  }

  render() {
    const {
      intl: { formatMessage },
      extensionUnderEdit,
      cancelButton,
      cancel,
      canEditPlugins,
      canEditBundles,
      saveRequest,
      uploadRequest,
      busy,
    } = this.props

    const { extension, showErrors } = this.state
    const { name, description, version, extension_type } = extension

    const isCreating = !extensionUnderEdit

    const errors = showErrors
      ? {
          ...parseClientErrors(extension),
          ...parseApiErrors(saveRequest),
        }
      : {}

    const pluginHelp = canEditPlugins ? undefined : (
      <CuiHelpTipIcon
        anchorPosition='rightCenter'
        aria-label={formatMessage(messages.featureDisabledHelp)}
      >
        <FormattedMessage
          id='deployment-extension-form.pluginDisabledExplanation'
          defaultMessage='This feature is not available for your {subscriptionLevel}.'
          values={{
            subscriptionLevel: (
              <ExternalLink href='https://www.elastic.co/cloud/elasticsearch-service/subscriptions'>
                <FormattedMessage
                  id='deployment-extension-form.subscription-level'
                  defaultMessage='subscription level'
                />
              </ExternalLink>
            ),
          }}
        />
      </CuiHelpTipIcon>
    )

    const typeOptions = [
      {
        id: `bundle`,
        label: (
          <FormattedMessage
            id='deployment-extension-form.bundleLabel'
            defaultMessage='A bundle containing a dictionary or script'
          />
        ),
        disabled: !canEditBundles,
      },
      {
        id: `plugin`,
        label: (
          <span>
            <EuiFlexGroup gutterSize='none' alignItems='center'>
              <EuiFlexItem grow={false}>
                <FormattedMessage
                  id='deployment-extension-form.pluginLabel'
                  defaultMessage='An installable plugin (compiled, no source code)'
                />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>{pluginHelp}</EuiFlexItem>
            </EuiFlexGroup>
          </span>
        ),
        disabled: !canEditPlugins,
      },
    ]

    const versionHelpText = (
      <FormattedMessage
        id='deployment-extension-form.version'
        defaultMessage='Numeric version for plugins, e.g. { exact }. Major version e.g. { majorVersion }, or wildcards e.g. { wildcard } for bundles.'
        values={{
          exact: <EuiCode>2.3.0</EuiCode>,
          majorVersion: <EuiCode>2.*</EuiCode>,
          wildcard: <EuiCode>*</EuiCode>,
        }}
      />
    )

    return (
      <div>
        <EuiFormRow
          label={
            <FormattedMessage id='deployment-extension-form.nameLabel' defaultMessage='Name' />
          }
          isInvalid={!!errors.name}
          error={errors.name}
          fullWidth={true}
        >
          <EuiFieldText
            data-test-id='plugin-form-name'
            isInvalid={!!errors.name}
            value={name}
            onChange={(e) =>
              this.setState({ extension: replaceIn(extension, `name`, e.target.value) })
            }
          />
        </EuiFormRow>

        <EuiFormRow
          label={
            <FormattedMessage
              id='deployment-extension-form.descriptionLabel'
              defaultMessage='Description'
            />
          }
          isInvalid={!!errors.description}
          error={errors.description}
          fullWidth={true}
        >
          <EuiTextArea
            data-test-id='plugin-form-description'
            isInvalid={!!errors.description}
            value={description || ``}
            onChange={(e) =>
              this.setState({ extension: replaceIn(extension, `description`, e.target.value) })
            }
          />
        </EuiFormRow>

        <EuiFormRow
          label={
            <FormattedMessage
              id='deployment-extension-form.versionLabel'
              defaultMessage='Version'
            />
          }
          isInvalid={!!errors.version}
          error={errors.version}
          helpText={versionHelpText}
        >
          <EuiFieldText
            data-test-id='plugin-form-version'
            isInvalid={!!errors.version}
            value={version}
            onChange={(e) =>
              this.setState({ extension: replaceIn(extension, `version`, e.target.value) })
            }
          />
        </EuiFormRow>

        <EuiFormRow
          label={
            <FormattedMessage id='deployment-extension-form.typeLabel' defaultMessage='Type' />
          }
          isInvalid={!!errors.extension_type}
          error={errors.extension_type}
        >
          <EuiRadioGroup
            data-test-id='plugin-form-type'
            options={typeOptions}
            idSelected={extension_type}
            onChange={(value: ExtensionType) =>
              this.setState({ extension: replaceIn(extension, `extension_type`, value) })
            }
          />
        </EuiFormRow>

        <EuiSpacer />

        <div data-test-id='deployment-extension-upload'>
          <DeploymentExtensionUpload
            extensionType={extension.extension_type}
            canEditPlugins={canEditPlugins}
            canEditBundles={canEditBundles}
            onChange={this.setFile}
          />
        </div>

        <EuiSpacer />

        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <SpinButton
              size='s'
              fill={true}
              onClick={this.save}
              data-test-id='extension-form-submit'
              spin={busy || saveRequest.inProgress || (uploadRequest && uploadRequest.inProgress)}
            >
              {isCreating ? (
                <FormattedMessage
                  id='deployment-extension-form.createButton'
                  defaultMessage='Create extension'
                />
              ) : (
                <FormattedMessage
                  id='deployment-extension-form.updateButton'
                  defaultMessage='Update extension'
                />
              )}
            </SpinButton>
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            {cancelButton || (
              <EuiButtonEmpty size='s' onClick={cancel}>
                <FormattedMessage
                  id='deployment-extension-form.cancelButton'
                  defaultMessage='Cancel'
                />
              </EuiButtonEmpty>
            )}
          </EuiFlexItem>
        </EuiFlexGroup>

        {!busy && (
          <Fragment>
            {saveRequest.error && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='error'>{saveRequest.error}</CuiAlert>
              </Fragment>
            )}

            {uploadRequest && uploadRequest.error && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='error'>{uploadRequest.error}</CuiAlert>
              </Fragment>
            )}

            {saveRequest.isDone && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='success'>
                  {isCreating ? (
                    <FormattedMessage
                      id='deployment-extension-form.create-success'
                      defaultMessage='Extension created successfully'
                    />
                  ) : (
                    <FormattedMessage
                      id='deployment-extension-form.update-success'
                      defaultMessage='Extension updated successfuly'
                    />
                  )}
                </CuiAlert>
              </Fragment>
            )}

            {uploadRequest && uploadRequest.isDone && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='success'>
                  <FormattedMessage
                    id='deployment-extension-form.upload-success'
                    defaultMessage='Extension uploaded successfuly'
                  />
                </CuiAlert>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    )
  }

  getInitialEditorState({ extensionUnderEdit, canEditPlugins }: Props): State['extension'] {
    if (extensionUnderEdit) {
      return omit(cloneDeep(extensionUnderEdit), `url`)
    }

    return {
      extension_type: canEditPlugins ? `plugin` : `bundle`,
      name: ``,
      description: ``,
      version: ``,
    }
  }

  setFile = (file: File) => {
    this.setState({ file })
  }

  save = () => {
    const { save } = this.props
    const { extension, file } = this.state
    const errors = parseClientErrors(extension)

    if (!isEmpty(errors)) {
      this.setState({ showErrors: true })
      return
    }

    save({ extension, file })
  }
}

export default injectIntl(DeploymentExtensionForm)

function isValidName(name) {
  return /^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(name)
}

export function isValidVersion(rawVersion = ``, formats: RegExp[] = []) {
  const version = rawVersion.trim()
  const formatsMet = formats.map((regex) => regex.test(version))

  if (!some(formatsMet)) {
    return false
  }

  return true
}

function parseApiErrors(request): PlainHashMap {
  const errors: PlainHashMap = {}
  const apiError = request.error

  if (!apiError) {
    return errors
  }

  const versionError = get(apiError, [`body`, `detail`, `version`])

  if (versionError) {
    errors.version = versionError
  }

  const nameError = get(apiError, [`body`, `detail`, `name`])

  if (nameError) {
    errors.name = nameError
  }

  return errors
}

function parseClientErrors(
  extension: CreateExtensionRequest | UpdateExtensionRequest,
): PlainHashMap {
  const errors: PlainHashMap = {}

  for (const fieldName of [`name`, `version`, `extension_type`]) {
    if (isEmpty(extension[fieldName])) {
      errors[fieldName] = (
        <FormattedMessage id='deplyoment-extension-form.required-field' defaultMessage='Required' />
      )
    }
  }

  if (!isValidName(extension.name)) {
    errors.name = (
      <FormattedMessage
        id='deplyoment-extension-form.invalid-name'
        defaultMessage='The name can only contain alphanumeric characters, dots, hyphens, or underscores, and it must begin with a letter'
      />
    )
  }

  if (!isValidVersion(extension.version, validFormats[extension.extension_type])) {
    errors.version = (
      <FormattedMessage
        id='deplyoment-extension-form.invalid-version'
        defaultMessage='Invalid version'
      />
    )
  }

  return errors
}
