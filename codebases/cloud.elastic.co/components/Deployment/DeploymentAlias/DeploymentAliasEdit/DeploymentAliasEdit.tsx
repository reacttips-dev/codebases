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

import { FormattedMessage } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiTable, CuiTableColumn, withErrorBoundary } from '../../../../cui'

import AliasPreview from './AliasPreview'
import SpinButton from '../../../SpinButton'

import { getLinks } from '../../../../lib/deployments/links'

import { AsyncRequestState, AjaxRequestError, LinkInfo, StackDeployment } from '../../../../types'

export type Props = {
  updateDeploymentAliasRequest: AsyncRequestState
  updateDeploymentAlias: (alias: string) => Promise<any>
  deployment: StackDeployment
  onClose: () => void
}

type State = {
  currentAlias: string
}

class DeploymentAliasEdit extends Component<Props, State> {
  state: State = {
    currentAlias: this.props.deployment.alias || '',
  }

  render() {
    const { onClose } = this.props

    return (
      <EuiFlyout data-test-id='deployment-alias-flyout' size='m' ownFocus={true} onClose={onClose}>
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='m'>
            <h2 data-test-id='deployment-alias-title'>
              <FormattedMessage
                id='deployment-alias.custom-endpoint-title'
                defaultMessage='Custom endpoint alias'
              />
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody data-test-id='deployment-alias-flyout-body'>
          {this.renderContent()}
        </EuiFlyoutBody>

        <EuiFlyoutFooter>{this.renderFooter()}</EuiFlyoutFooter>
      </EuiFlyout>
    )
  }

  renderContent() {
    const { deployment, updateDeploymentAliasRequest } = this.props
    const { currentAlias } = this.state

    const isInvalid: boolean = updateDeploymentAliasRequest.error !== undefined

    const updatedError = getValidationError(updateDeploymentAliasRequest)

    const columns: Array<CuiTableColumn<LinkInfo>> = [
      {
        label: 'Application',
        sortKey: 'name',
        render: (link) => <div>{link.label.defaultMessage}</div>,
        width: '190px',
      },
      {
        label: 'URL',
        sortKey: 'url',
        render: (link) => (
          <AliasPreview deployment={deployment} link={link} currentAlias={currentAlias} />
        ),
      },
    ]

    // ignoreAlias: true means we always start from a baseline unaliased URL.
    // This makes it easier to preview the removal of an existing alias; instead
    // of having to recalculate the service URL from the aliased version, we
    // just show the service URL directly.
    const endpoints = getLinks({ deployment, ignoreAlias: true })

    return (
      <Fragment>
        <EuiText size='s'>
          <FormattedMessage
            id='deployment-alias.custom-endpoint-message'
            defaultMessage='Customize the ID portion of the endpoint URLs for all applications in the deployment. The name must be unique for each region, across all accounts.'
          />
        </EuiText>

        <EuiSpacer size='l' />

        <EuiForm>
          <EuiFormRow
            error={updatedError}
            isInvalid={isInvalid}
            label={
              <FormattedMessage
                id='deployment-alias.custom-endpoint-title'
                defaultMessage='Custom endpoint alias'
              />
            }
            helpText={
              isInvalid ? null : (
                <FormattedMessage
                  id='deployment-alias.endpoint-help-text'
                  defaultMessage="Use 'a-z', '0-9', or '-'. The alias can't start with '-' or 'system'"
                />
              )
            }
          >
            <EuiFieldText
              placeholder='mydeployment'
              data-test-id='deployment-alias-edit-field'
              isInvalid={isInvalid}
              value={currentAlias}
              onChange={(e) => {
                // @ts-ignore - ts does not see the target value
                const alias = e.target.value.toLowerCase()
                this.setState({ currentAlias: alias })
              }}
            />
          </EuiFormRow>
        </EuiForm>

        <EuiSpacer size='l' />

        <CuiTable<LinkInfo>
          emptyMessage='empty'
          data-test-id='domain-alias-application-table'
          rows={endpoints}
          columns={columns}
        />
      </Fragment>
    )
  }

  renderFooter() {
    const { updateDeploymentAlias, updateDeploymentAliasRequest, onClose } = this.props
    const { currentAlias } = this.state

    return (
      <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
        <EuiFlexItem grow={false}>
          <EuiButtonEmpty data-test-id='deploymentManage-deploymentAliasEdit' onClick={onClose}>
            <FormattedMessage id='deployment-alias.flyout-cancel' defaultMessage='Cancel' />
          </EuiButtonEmpty>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <SpinButton
            requiresSudo={true}
            size='s'
            disabled={false}
            data-test-id='deploymentManage-deploymentAliasEdit'
            color='primary'
            spin={updateDeploymentAliasRequest.inProgress}
            onClick={() => updateDeploymentAlias(currentAlias)}
          >
            <FormattedMessage
              id='deployment-alias.flyout-update-alias'
              defaultMessage='Update alias'
            />
          </SpinButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }
}

function getValidationError(updateDeploymentAliasRequest: AsyncRequestState) {
  const { error } = updateDeploymentAliasRequest

  if (!error) {
    return null
  }

  if (typeof error === 'string') {
    return null
  }

  const ajaxError: AjaxRequestError = error as AjaxRequestError

  if (!(ajaxError instanceof Object)) {
    return null
  }

  if (!ajaxError.body || !ajaxError.body.errors) {
    return null
  }

  const messages = ajaxError.body?.errors?.map((error) => error.message)

  return messages
}

export default withErrorBoundary(DeploymentAliasEdit)
