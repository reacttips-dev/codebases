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

import React, { Fragment } from 'react'
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiFlyoutFooter,
  EuiFormRow,
  EuiOverlayMask,
  EuiRadioGroup,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import SelectRemoteDeploymentsTable from '../SelectRemoteDeploymentsTable'

import {
  trustLevels,
  TrustLevel,
} from '../../../../../lib/stackDeployments/selectors/crossClusterReplication'
import { createUpdateTrustRequestFromGetResponse } from '../../../../../lib/stackDeployments'
import {
  getTrustLevelLabel,
  getTrustLevelFromRelationship,
  getTrustRelationshipId,
} from '../../../../../lib/stackDeployments/trustRelationships'

import { AccountTrustRelationship } from '../../../../../lib/api/v1/types'
import { AllProps, State } from './types'

const messages = defineMessages({
  setTrustLevelLabel: {
    id: 'deploymentTrustManagement.flyout.setTrustLevel.label',
    defaultMessage: 'Trust level',
  },
})

export type Props = AllProps & WrappedComponentProps

class DeploymentTrustRelationshipFlyout extends React.Component<Props, State> {
  state: State = this.createInitialState()

  componentWillUnmount(): void {
    this.props.resetUpdateStackDeployment()
  }

  render(): JSX.Element {
    const { children } = this.props

    return (
      <Fragment>
        {children({ openFlyout: this.onOpen.bind(this) })}
        {this.renderFlyout()}
      </Fragment>
    )
  }

  renderFlyout(): JSX.Element | null {
    const { updateStackDeploymentRequest } = this.props
    const { isOpen, trustedEnvironmentId, trustedClusterIds, trustLevel } = this.state

    const isDisabled =
      !trustedEnvironmentId || (trustLevel === 'specific' && trustedClusterIds.length === 0)

    if (!isOpen) {
      return null
    }

    return (
      <EuiOverlayMask headerZindexLocation='below'>
        <EuiFlyout maxWidth='32rem' onClose={() => this.onClose()}>
          <EuiFlyoutHeader hasBorder={true}>
            <EuiTitle size='m'>
              <h2>
                <FormattedMessage
                  id='deploymentTrustManagement.ess.flyout.title'
                  defaultMessage='Trust management'
                />
              </h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiFlexGroup direction='column' gutterSize='s'>
              <EuiFlexItem grow={false}>
                <EuiText>
                  <FormattedMessage
                    id='deploymentTrustManagement.ess.flyout.description'
                    defaultMessage='Choose which trust level this deployment has with other deployments from this account.'
                  />
                </EuiText>
                <EuiSpacer size='s' />
              </EuiFlexItem>
              <EuiFlexItem grow={true}>{this.renderFlyoutForm()}</EuiFlexItem>
              {updateStackDeploymentRequest.error && (
                <EuiFlexItem grow={false}>
                  <CuiAlert type='danger' data-test-id='update-deployment-request-error'>
                    {updateStackDeploymentRequest.error}
                  </CuiAlert>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          </EuiFlyoutBody>
          <EuiFlyoutFooter>
            <EuiFlexGroup justifyContent='spaceBetween'>
              <EuiFlexItem grow={false}>
                <EuiButtonEmpty onClick={() => this.onClose()} flush='left'>
                  <FormattedMessage
                    id='deploymentTrustManagement.flyout.cancel'
                    defaultMessage='Cancel'
                  />
                </EuiButtonEmpty>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton
                  type='button'
                  data-test-id='save-trust-relationship-button'
                  disabled={isDisabled}
                  onClick={() => this.onSave()}
                  isLoading={updateStackDeploymentRequest.inProgress}
                  fill={true}
                >
                  <FormattedMessage
                    id='deploymentTrustManagement.flyout.submit-edit'
                    defaultMessage='Update trust'
                  />
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </EuiOverlayMask>
    )
  }

  renderFlyoutForm(): JSX.Element {
    return (
      <Fragment>
        {this.renderTrustLevelFields()}
        {this.renderTrustSpecificDeploymentsField()}
      </Fragment>
    )
  }

  renderTrustLevelFields(): JSX.Element | null {
    const {
      intl: { formatMessage },
    } = this.props
    const { trustedEnvironmentId, trustLevel } = this.state

    if (!trustedEnvironmentId) {
      return null
    }

    const options: Array<{ id: TrustLevel; label: string }> = trustLevels.map((_trustLevel) => ({
      id: _trustLevel,
      label: formatMessage(getTrustLevelLabel(_trustLevel)),
    }))

    return (
      <EuiFormRow label={formatMessage(messages.setTrustLevelLabel)}>
        <EuiRadioGroup
          data-test-id='select-trust-level'
          options={options}
          idSelected={trustLevel}
          onChange={(value) => {
            this.setState({ trustLevel: value as TrustLevel })
          }}
        />
      </EuiFormRow>
    )
  }

  renderTrustSpecificDeploymentsField(): JSX.Element | null {
    const { deployment } = this.props
    const { trustLevel, trustedClusterIds } = this.state

    if (trustLevel !== `specific`) {
      return null
    }

    return (
      <SelectRemoteDeploymentsTable
        deployment={deployment}
        trustedClusterIds={trustedClusterIds}
        onChange={(nextIds) => this.setState({ trustedClusterIds: nextIds })}
      />
    )
  }

  getTrustRelationshipFromState(): AccountTrustRelationship {
    const { trustedEnvironmentId, trustLevel, trustedClusterIds } = this.state

    const trustFields = {
      account_id: trustedEnvironmentId,
      trust_all: trustLevel === `all`,
    }

    const optionalFields = trustLevel === `specific` ? { trust_allowlist: trustedClusterIds } : {}

    return { ...trustFields, ...optionalFields }
  }

  createInitialState(): State {
    const { trustRelationship } = this.props

    return {
      isOpen: false,
      trustLevel: getTrustLevelFromRelationship(trustRelationship),
      trustedEnvironmentId: getTrustRelationshipId({ trustRelationship }),
      trustedClusterIds: trustRelationship.trust_allowlist || [],
    }
  }

  onOpen(): void {
    this.setState({ isOpen: true })
  }

  onClose(): void {
    this.setState({ isOpen: false })
  }

  onSave(): void {
    const { deployment, updateStackDeployment } = this.props

    const trustRelationship = this.getTrustRelationshipFromState()

    const payload = createUpdateTrustRequestFromGetResponse({
      deployment,
      trustRelationships: [trustRelationship],
      type: `accounts`,
    })

    updateStackDeployment(payload).then(() => this.onClose())
  }
}

export default injectIntl(DeploymentTrustRelationshipFlyout)
