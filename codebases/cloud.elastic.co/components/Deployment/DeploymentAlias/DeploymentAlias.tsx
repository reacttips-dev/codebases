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

import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  EuiFormLabel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiLink,
  EuiLoadingContent,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert, CuiHelpTipIcon } from '../../../cui'

import DeploymentAliasEdit from './DeploymentAliasEdit'
import PrivacySensitiveContainer from '../../PrivacySensitiveContainer'

import { AsyncRequestState, StackDeployment } from '../../../types'

export type Props = WrappedComponentProps & {
  deployment: StackDeployment
  deploymentAliasEditAccess: boolean
  fetchDeploymentAliasEditAccess: (params: { regionId: string }) => Promise<any>
  fetchDeploymentDomainAliasEditAccessRequest: AsyncRequestState
  isEceAdminconsole: boolean
  regionId: string
  updateDeploymentAliasRequest: AsyncRequestState
}

type State = {
  editing: boolean
}

const messages = defineMessages({
  helpIcon: {
    id: `deployment-name.deployment-alias-tooltip-message`,
    defaultMessage: `Simplify the endpoint URL to a unique name that you choose.`,
  },
})

class DeploymentAlias extends Component<Props, State> {
  state: State = {
    editing: false,
  }

  componentDidMount() {
    const { fetchDeploymentAliasEditAccess, regionId, isEceAdminconsole } = this.props

    if (isEceAdminconsole) {
      fetchDeploymentAliasEditAccess({ regionId })
    }
  }

  render() {
    const {
      deploymentAliasEditAccess,
      fetchDeploymentDomainAliasEditAccessRequest,
      isEceAdminconsole,
    } = this.props

    // Permissions are only checked for alias editing on ECE. Allowed everywhere else.
    const hasPermissions = isEceAdminconsole ? deploymentAliasEditAccess : true

    return (
      <div>
        <EuiFormLabel data-test-id='deployment-alias-section-label'>
          <EuiFlexGroup
            alignItems='center'
            gutterSize='none'
            justifyContent='flexStart'
            responsive={false}
          >
            <EuiFlexItem grow={false}>
              <FormattedMessage
                id='deployment-manage-name.custom-endpoint-alias'
                defaultMessage='Custom endpoint alias'
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>{this.renderPopover({ hasPermissions })}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormLabel>

        <EuiSpacer size='s' />

        {!isEceAdminconsole ? (
          <Fragment>{this.renderEditableAliasField()}</Fragment>
        ) : (
          <Fragment>{this.renderAliasPermissionField()}</Fragment>
        )}

        {fetchDeploymentDomainAliasEditAccessRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{fetchDeploymentDomainAliasEditAccessRequest.error}</CuiAlert>
          </Fragment>
        )}
      </div>
    )
  }

  renderAliasPermissionField() {
    const { deploymentAliasEditAccess, fetchDeploymentDomainAliasEditAccessRequest } = this.props

    if (fetchDeploymentDomainAliasEditAccessRequest.inProgress) {
      return <EuiLoadingContent lines={1} />
    }

    if (deploymentAliasEditAccess) {
      return this.renderEditableAliasField()
    }

    return this.renderReadOnlyAliasField()
  }

  renderReadOnlyAliasField() {
    const { deployment, updateDeploymentAliasRequest } = this.props
    const { alias } = deployment

    if (updateDeploymentAliasRequest.inProgress) {
      return <EuiLoadingContent lines={1} />
    }

    if (alias) {
      return (
        <EuiText data-test-id='deployment-alias-show-no-permissions' size='s'>
          {alias}
        </EuiText>
      )
    }

    return (
      <EuiText size='s' data-test-id='deployment-alias-no-alias'>
        <FormattedMessage
          id='deployment-name.no-custom-endpoint-alias'
          defaultMessage='No custom endpoint alias'
        />
      </EuiText>
    )
  }

  renderEditableAliasField() {
    const { updateDeploymentAliasRequest } = this.props

    return (
      <div>
        {updateDeploymentAliasRequest.inProgress ? (
          <EuiLoadingContent lines={1} />
        ) : (
          this.renderAliasContent()
        )}

        {this.renderEditFlyout()}
      </div>
    )
  }

  renderAliasContent() {
    const { deployment } = this.props
    const { alias } = deployment

    return (
      <EuiFlexGroup
        alignItems='center'
        gutterSize='m'
        justifyContent='flexStart'
        data-test-id='deployment-alias-show-alias'
        responsive={false}
      >
        {!alias ? (
          <EuiFlexItem grow={false}>
            <EuiLink
              data-test-id='deploymentManage-deploymentAliasCreate'
              onClick={() => this.setState({ editing: true })}
            >
              <FormattedMessage
                id='deployment-name.create-an-alias-link'
                defaultMessage='Create an alias'
              />
            </EuiLink>
          </EuiFlexItem>
        ) : (
          <Fragment>
            <EuiFlexItem grow={false} style={{ minWidth: 150 }}>
              <PrivacySensitiveContainer>
                <EuiText size='s'>{alias}</EuiText>
              </PrivacySensitiveContainer>
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <EuiLink
                data-test-id='deploymentManage-deploymentAliasEdit'
                onClick={() => this.setState({ editing: true })}
              >
                <FormattedMessage id='deployment-name.edit-alias-link' defaultMessage='Edit' />
              </EuiLink>
            </EuiFlexItem>
          </Fragment>
        )}
      </EuiFlexGroup>
    )
  }

  renderEditFlyout() {
    const { deployment } = this.props
    const { editing } = this.state

    if (!editing) {
      return null
    }

    return (
      <DeploymentAliasEdit
        deployment={deployment}
        onClose={() => this.setState({ editing: false })}
      />
    )
  }

  renderPopover({ hasPermissions = false }: { hasPermissions: boolean }) {
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <CuiHelpTipIcon
        aria-label={formatMessage(messages.helpIcon)}
        anchorPosition='rightCenter'
        color='primary'
      >
        {hasPermissions ? (
          <EuiFormHelpText>
            <FormattedMessage
              id='deployment-name.deployment-alias-tooltip-message'
              defaultMessage='Simplify the endpoint URL to a unique name that you choose.'
            />
          </EuiFormHelpText>
        ) : (
          <EuiFormHelpText>
            <FormattedMessage
              id='deployment-name.deployment-alias-tooltip-message-nopermission'
              defaultMessage='Contact your platform admin to set custom endpoint aliases. They need to add certificates for the domain support and enable setting up aliases.'
            />
          </EuiFormHelpText>
        )}
      </CuiHelpTipIcon>
    )
  }
}

export default injectIntl(DeploymentAlias)
