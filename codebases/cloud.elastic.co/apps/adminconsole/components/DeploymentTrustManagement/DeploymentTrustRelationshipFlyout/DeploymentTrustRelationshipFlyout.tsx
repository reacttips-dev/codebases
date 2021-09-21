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

import { noop } from 'lodash'

import React, { Fragment } from 'react'
import { defineMessages, injectIntl, FormattedMessage, WrappedComponentProps } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiFlyoutFooter,
  EuiFormRow,
  EuiIcon,
  EuiOverlayMask,
  EuiRadioGroup,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui'

import { CuiAlert } from '../../../../../cui'

import SelectRemoteDeploymentsTable from '../SelectRemoteDeploymentsTable'

import {
  trustLevels,
  TrustLevel,
} from '../../../../../lib/stackDeployments/selectors/crossClusterReplication'
import {
  createUpdateTrustRequestFromGetResponse,
  getDeploymentSettingsFromGet,
} from '../../../../../lib/stackDeployments'
import {
  getTrustLevelLabel,
  getTrustLevelFromRelationship,
  getTrustRelationshipDisplayName,
  getTrustRelationshipId,
  isAccountRelationship,
} from '../../../../../lib/stackDeployments/trustRelationships'

import {
  AccountTrustRelationship,
  ExternalTrustRelationship,
  TrustRelationshipGetResponse,
} from '../../../../../lib/api/v1/types'
import { AllProps, State } from './types'

const messages = defineMessages({
  addEnvironmentLabel: {
    id: 'deploymentTrustManagement.flyout.addEnvironment.label',
    defaultMessage: 'Select ECE environment',
  },
  addEnvironmentPlaceholder: {
    id: 'deploymentTrustManagement.flyout.addEnvironment.placeholder',
    defaultMessage: 'Select account',
  },
  setTrustLevelLabel: {
    id: 'deploymentTrustManagement.flyout.setTrustLevel.label',
    defaultMessage: 'Trust level',
  },
  setTrustLevelLabelHelpText: {
    id: 'deploymentTrustManagement.flyout.setTrustLevel.helpText',
    defaultMessage: `Use the deployment's cluster ID, e.g.: eb4908`,
  },
})

export type Props = AllProps & WrappedComponentProps

class DeploymentTrustRelationshipFlyout extends React.Component<Props, State> {
  comboboxInput: HTMLInputElement | null = null

  mounted: boolean = false

  state: State = this.createInitialState()

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount(): void {
    this.mounted = false
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
    const { trustRelationships, updateStackDeploymentRequest } = this.props
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
                {this.isEditing() ? (
                  getTrustRelationshipDisplayName(trustRelationships, trustedEnvironmentId)
                ) : (
                  <FormattedMessage
                    id='deploymentTrustManagement.flyout.title'
                    defaultMessage='Add trusted environment'
                  />
                )}
              </h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiFlexGroup direction='column' gutterSize='s'>
              {this.isEditing() && (
                <EuiFlexItem grow={false}>
                  <EuiText>
                    <FormattedMessage
                      id='deploymentTrustManagement.flyout.description'
                      defaultMessage='Choose which trust level this deployment has with other deployments within this ECE environment.'
                    />
                  </EuiText>
                  <EuiSpacer size='s' />
                </EuiFlexItem>
              )}
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
                  {this.isEditing() ? (
                    <FormattedMessage
                      id='deploymentTrustManagement.flyout.submit-edit'
                      defaultMessage='Update trust'
                    />
                  ) : (
                    <FormattedMessage
                      id='deploymentTrustManagement.flyout.submit-add'
                      defaultMessage='Add trusted environment'
                    />
                  )}
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
        {this.renderEnvironmentField()}
        {this.renderTrustLevelFields()}
        {this.renderTrustSpecificDeploymentsField()}
      </Fragment>
    )
  }

  renderEnvironmentField(): JSX.Element | null {
    const {
      intl: { formatMessage },
    } = this.props
    const { trustedEnvironmentId } = this.state

    if (this.isEditing()) {
      return null
    }

    const options = this.getTrustRelationshipOptionsForDeployment().map(({ id, name }) => ({
      value: id,
      text: name,
    }))

    if (options.length) {
      options.unshift({ value: ``, text: formatMessage(messages.addEnvironmentPlaceholder) })
    }

    return (
      <EuiFormRow label={formatMessage(messages.addEnvironmentLabel)}>
        <EuiSelect
          data-test-id='select-trusted-environment'
          options={options}
          value={trustedEnvironmentId}
          onChange={({ target: { value } }) => {
            this.setState({ trustedEnvironmentId: value })
          }}
        />
      </EuiFormRow>
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

    const options: Array<{ id: TrustLevel; value: TrustLevel; label: string }> = trustLevels.map(
      (_trustLevel) => ({
        id: _trustLevel,
        value: _trustLevel,
        label: formatMessage(getTrustLevelLabel(_trustLevel)),
      }),
    )

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
    const { deployment, trustRelationship } = this.props
    const { trustLevel, trustedClusterIds } = this.state

    if (trustLevel !== `specific`) {
      return null
    }

    return isAccountRelationship(trustRelationship) ? (
      <SelectRemoteDeploymentsTable
        deployment={deployment}
        trustedClusterIds={trustedClusterIds}
        onChange={(nextIds) => this.setState({ trustedClusterIds: nextIds })}
      />
    ) : (
      this.renderTrustExternalDeployments()
    )
  }

  renderTrustExternalDeployments(): JSX.Element | null {
    const { trustedClusterIds } = this.state

    return (
      <EuiFormRow
        helpText={
          <Fragment>
            <FormattedMessage {...messages.setTrustLevelLabelHelpText} />
            {` `}
            <EuiToolTip
              position='bottom'
              content={
                <FormattedMessage
                  id='deploymentTrustManagement.flyout.setTrustLevel.tooltip'
                  defaultMessage='The cluster ID is different from the deployment ID and can be found on the main page of your deployment'
                />
              }
            >
              <EuiIcon type='alert' color='primary' />
            </EuiToolTip>
          </Fragment>
        }
      >
        <EuiFlexGroup gutterSize='s'>
          <EuiFlexItem grow={true}>
            <EuiComboBox
              data-test-id='select-trusted-deployments'
              noSuggestions={true}
              selectedOptions={trustedClusterIds.map((id) => ({
                label: id,
              }))}
              onCreateOption={(id) => {
                this.setState({ trustedClusterIds: [...trustedClusterIds, id] })
              }}
              onChange={(options) => {
                this.setState({ trustedClusterIds: options.map(({ label }) => label) })
              }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            {/*
              No additional logic is required for the onClick here, as using
              the button triggers the required onBlur event for the combobox
            */}
            <EuiButton data-test-id='select-trusted-deployments-cta' onClick={noop}>
              <FormattedMessage
                id='deploymentTrustManagement.flyout.addDeploymentIdsButton'
                defaultMessage='Add'
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFormRow>
    )
  }

  getTrustRelationshipOptionsForDeployment(): TrustRelationshipGetResponse[] {
    const { deployment, trustRelationships } = this.props

    const settings = getDeploymentSettingsFromGet({ deployment })
    const externalTrustRelationships = settings?.trust?.external || []

    // We only display options that aren't already trusted by default,
    // and ones that aren't already configured for this deployment.
    return trustRelationships.filter(
      (trustRelationship) =>
        !trustRelationship.trust_by_default &&
        !trustRelationship.local &&
        externalTrustRelationships.every(
          ({ trust_relationship_id }) => trust_relationship_id !== trustRelationship.id,
        ),
    )
  }

  getTrustRelationshipFromState(): ExternalTrustRelationship | AccountTrustRelationship {
    const { trustRelationship } = this.props
    const { trustedEnvironmentId, trustLevel, trustedClusterIds } = this.state

    const idField = isAccountRelationship(trustRelationship)
      ? { account_id: trustedEnvironmentId }
      : { trust_relationship_id: trustedEnvironmentId }

    const trustLevelField = {
      trust_all: trustLevel === `all`,
    }

    const optionalFields = trustLevel === `specific` ? { trust_allowlist: trustedClusterIds } : {}

    return { ...idField, ...trustLevelField, ...optionalFields }
  }

  createInitialState(): State {
    const { trustRelationship } = this.props

    return trustRelationship
      ? {
          isOpen: false,
          trustLevel: getTrustLevelFromRelationship(trustRelationship),
          trustedEnvironmentId: getTrustRelationshipId({ trustRelationship }),
          trustedClusterIds: trustRelationship.trust_allowlist || [],
        }
      : {
          isOpen: false,
          trustLevel: `all`,
          trustedEnvironmentId: ``,
          trustedClusterIds: [],
        }
  }

  isEditing(): boolean {
    return Boolean(this.props.trustRelationship)
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
      type: isAccountRelationship(trustRelationship) ? `accounts` : `external`,
    })

    updateStackDeployment(payload).then(() => {
      if (this.mounted) {
        this.onClose()
      }
    })
  }
}

export default injectIntl(DeploymentTrustRelationshipFlyout)
