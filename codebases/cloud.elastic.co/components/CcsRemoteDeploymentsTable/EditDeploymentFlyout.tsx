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

import sluggish from 'sluggish'
import { find, isEmpty } from 'lodash'
import React, { Component, Fragment } from 'react'
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

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
  EuiFormHelpText,
  EuiFormRow,
  EuiHealth,
  EuiIcon,
  EuiSpacer,
  EuiText,
  EuiTitle,
  IconType,
} from '@elastic/eui'

import { CuiAlert } from '../../cui'

import SpinButton from '../SpinButton'

import SelectRemoteDeployment from './SelectRemoteDeployment'

import { DeploymentHealthProblemsSummary } from '../StackDeploymentHealthProblems/StackDeploymentHealthProblemsTitle'

import {
  getDeploymentEuiHealthColor,
  getDeploymentHealthProblems,
} from '../../lib/healthProblems/stackDeploymentHealth'
import { getProductSliderTypesForStackDeployment, getSliderDefinition } from '../../lib/sliders'
import { describeTopology } from '../../lib/stackDeployments/topology'
import {
  getDisplayName,
  getDeploymentTopologyInstances,
  getFirstEsRefId,
  getVersion,
} from '../../lib/stackDeployments/selectors'

import { DeploymentSearchResponse, RemoteResourceRef } from '../../lib/api/v1/types'
import { AsyncRequestState, SliderInstanceType, StackDeployment } from '../../types'

type Props = {
  intl: IntlShape
  deployment?: StackDeployment
  deploymentVersion: string
  ccsDeployments?: StackDeployment[]
  changeRequest?: AsyncRequestState
  pendingRemote?: RemoteResourceRef | null
  isEditing: boolean
  unavailableAliases: string[]
  resetChangeRequest?: () => void
  onClose: () => void
  onSave: (pendingRemote: RemoteResourceRef) => void
}

type State = {
  pendingRemote: RemoteResourceRef | null
  ccsDeployment: DeploymentSearchResponse | null
}

type TopologyItem = {
  id: SliderInstanceType
  iconType: IconType
  title: string
  description: string
}

const messages = defineMessages({
  deploymentNameField: {
    id: `edit-deployment-flyout.name-field`,
    defaultMessage: `Deployment name`,
  },
  deploymentAliasField: {
    id: `edit-deployment-flyout.alias-field`,
    defaultMessage: `Deployment alias`,
  },
  deploymentVersionField: {
    id: `edit-deployment-flyout.version-field`,
    defaultMessage: `Deployment version`,
  },
  deploymentStatusField: {
    id: `edit-deployment-flyout.status-field`,
    defaultMessage: `Deployment status`,
  },
  deploymentHealthy: {
    id: `edit-deployment-flyout.status-healthy`,
    defaultMessage: `Healthy`,
  },
  deploymentUnhealthy: {
    id: `edit-deployment-flyout.status-unhealthy`,
    defaultMessage: `Unhealthy`,
  },
  deploymentTopologyField: {
    id: `edit-deployment-flyout.topology-field`,
    defaultMessage: `Deployment topology`,
  },
  sliderInstances: {
    id: `edit-deployment-flyout.topology-slider-instances`,
    defaultMessage: `{instanceCount} {sliderName} {instanceCount, plural, one {instance} other {instances}}`,
  },
  emptyAlias: {
    id: `edit-deployment-flyout.empty-alias`,
    defaultMessage: `The alias cannot be empty.`,
  },
  unavailableAlias: {
    id: `edit-deployment-flyout.invalid-alias`,
    defaultMessage: `This alias is already in use.`,
  },
})

class EditDeploymentFlyout extends Component<Props, State> {
  state: State = {
    pendingRemote: this.props.pendingRemote || null,
    ccsDeployment: null,
  }

  componentDidMount() {
    const { resetChangeRequest } = this.props

    if (resetChangeRequest) {
      resetChangeRequest()
    }
  }

  render() {
    const {
      intl: { formatMessage },
      isEditing,
      changeRequest,
      onClose,
      onSave,
    } = this.props

    const { pendingRemote } = this.state
    const clusterId = pendingRemote?.elasticsearch_ref_id

    const aliasErrors: string[] = []
    const emptyAlias = this.hasEmptyAlias()
    const unavailableAlias = this.hasUnavailableAlias()

    if (emptyAlias) {
      aliasErrors.push(formatMessage(messages.emptyAlias))
    }

    if (unavailableAlias) {
      aliasErrors.push(formatMessage(messages.unavailableAlias))
    }

    return (
      <EuiFlyout
        size='s'
        onClose={onClose}
        aria-labelledby='pending-remote-deployment-title'
        ownFocus={true}
      >
        <EuiFlyoutHeader>
          <EuiTitle size='m'>
            <h2 id='pending-remote-deployment-title'>
              {isEditing ? (
                <FormattedMessage
                  id='remote-deployments-table.edit-deployment'
                  defaultMessage='Edit cross cluster search deployment'
                />
              ) : (
                <FormattedMessage
                  id='remote-deployments-table.add-deployment'
                  defaultMessage='Add cross cluster search deployment'
                />
              )}
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>

        <EuiFlyoutBody>
          <EuiForm>
            <EuiFormRow label={formatMessage(messages.deploymentNameField)}>
              <div>{this.renderDeploymentDropdown()}</div>
            </EuiFormRow>

            <EuiFormRow
              label={formatMessage(messages.deploymentAliasField)}
              isInvalid={!isEmpty(aliasErrors)}
              error={aliasErrors}
            >
              <div>{this.renderAlias()}</div>
            </EuiFormRow>

            <EuiFormRow label={formatMessage(messages.deploymentVersionField)}>
              <div>{this.renderVersion()}</div>
            </EuiFormRow>

            <EuiFormRow label={formatMessage(messages.deploymentStatusField)}>
              <div>{this.renderStatus()}</div>
            </EuiFormRow>

            <EuiFormRow label={formatMessage(messages.deploymentTopologyField)}>
              <div>{this.renderTopology()}</div>
            </EuiFormRow>
          </EuiForm>
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup gutterSize='m' justifyContent='spaceBetween'>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType='cross' onClick={onClose}>
                <FormattedMessage
                  id='remote-deployments-table.cancel-pending'
                  defaultMessage='Cancel'
                />
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <SpinButton
                fill={true}
                disabled={!clusterId || !isEmpty(aliasErrors)}
                spin={Boolean(changeRequest && changeRequest.inProgress)}
                onClick={() => {
                  onSave(pendingRemote!)
                }}
              >
                <FormattedMessage
                  id='remote-deployments-table.commit-pending'
                  defaultMessage='Save'
                />
              </SpinButton>
            </EuiFlexItem>
          </EuiFlexGroup>

          {changeRequest && changeRequest.error && (
            <Fragment>
              <EuiSpacer size='m' />
              <CuiAlert type='error'>{changeRequest.error}</CuiAlert>
            </Fragment>
          )}
        </EuiFlyoutFooter>
      </EuiFlyout>
    )
  }

  renderDeploymentDropdown() {
    const { deployment, deploymentVersion, isEditing } = this.props
    const { ccsDeployment } = this.state

    if (isEditing) {
      const ccsDeploymentWhileEditing = this.getCcsDeployment()

      if (ccsDeploymentWhileEditing) {
        return getDisplayName({ deployment: ccsDeploymentWhileEditing })
      }
    }

    return (
      <SelectRemoteDeployment
        deployment={deployment}
        deploymentVersion={deploymentVersion}
        onChange={this.selectDeployment}
        selectedDeployment={ccsDeployment}
      />
    )
  }

  renderAlias() {
    const { pendingRemote } = this.state

    if (typeof pendingRemote?.alias !== `string`) {
      return <span>—</span>
    }

    return (
      <Fragment>
        <EuiFieldText
          value={pendingRemote.alias}
          onChange={(e) => this.updateAlias(e.target.value)}
          onBlur={() => this.updateAlias(sluggish(pendingRemote.alias))}
        />

        <EuiFormHelpText>
          <FormattedMessage
            id='remote-deployments-table.alias-help-description'
            defaultMessage='You can provide your own unique alias'
          />
        </EuiFormHelpText>
      </Fragment>
    )
  }

  renderVersion() {
    const ccsDeployment = this.getCcsDeployment()

    if (!ccsDeployment) {
      return <span>—</span>
    }

    const version = getVersion({ deployment: ccsDeployment })

    return <EuiText size='s'>{version}</EuiText>
  }

  renderStatus() {
    const ccsDeployment = this.getCcsDeployment()

    if (!ccsDeployment) {
      return <span>—</span>
    }

    const [problems] = getDeploymentHealthProblems({ deployment: ccsDeployment })

    return (
      <EuiHealth color={getDeploymentEuiHealthColor({ deployment: ccsDeployment })}>
        <DeploymentHealthProblemsSummary problems={problems} />
      </EuiHealth>
    )
  }

  renderTopology() {
    const ccsDeployment = this.getCcsDeployment()

    if (!ccsDeployment) {
      return <span>—</span>
    }

    const topologyItems = this.getTopologyItemsForDeployment(ccsDeployment)

    return (
      <Fragment>
        {topologyItems.map(({ id, iconType, title, description }) => (
          <div key={id}>
            <EuiFlexGroup gutterSize='m' alignItems='center'>
              <EuiFlexItem grow={false}>
                <EuiIcon type={iconType} />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiText size='s'>{title}</EuiText>
                <EuiText size='s' color='subdued'>
                  {description}
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        ))}
      </Fragment>
    )
  }

  getTopologyItemsForDeployment(deployment: StackDeployment): TopologyItem[] {
    const {
      intl: { formatMessage },
    } = this.props

    return getProductSliderTypesForStackDeployment(deployment).map(({ sliderInstanceType }) => {
      const { messages: sliderMessages, iconType } = getSliderDefinition({ sliderInstanceType })
      const instanceSummaries = getDeploymentTopologyInstances({
        deployment,
        sliderInstanceType,
      })

      return {
        id: sliderInstanceType,
        iconType,
        title: formatMessage(messages.sliderInstances, {
          sliderName: <FormattedMessage {...sliderMessages.prettyName} />,
          instanceCount: instanceSummaries.length,
        }) as string,
        description: describeTopology({ instanceSummaries, formatMessage }),
      }
    })
  }

  selectDeployment = (deployment: DeploymentSearchResponse) => {
    if (deployment === null) {
      this.setState({
        pendingRemote: null,
        ccsDeployment: null,
      })

      return
    }

    this.setState({
      pendingRemote: {
        deployment_id: deployment.id,
        alias: sluggish(getDisplayName({ deployment })),
        elasticsearch_ref_id: getFirstEsRefId({ deployment })!,
      },
      ccsDeployment: deployment,
    })
  }

  updateAlias(alias: string) {
    this.setState({
      pendingRemote: {
        // We have the rest of the required object from the previous selectDeployment step
        ...this.state.pendingRemote!,
        alias,
      },
    })
  }

  hasEmptyAlias() {
    const { pendingRemote } = this.state

    const alias = pendingRemote?.alias

    return typeof alias === `string` && isEmpty(alias.trim())
  }

  hasUnavailableAlias() {
    const { unavailableAliases } = this.props
    const { pendingRemote } = this.state

    const unavailableAlias = unavailableAliases.includes(pendingRemote?.alias || ``)

    return unavailableAlias
  }

  getCcsDeployment(): StackDeployment | null {
    const { ccsDeployment } = this.state

    if (ccsDeployment) {
      return ccsDeployment
    }

    const { ccsDeployments } = this.props
    const { pendingRemote } = this.state
    const deploymentId = pendingRemote?.deployment_id

    const ccsDeploymentFromSearch = find(ccsDeployments, { id: deploymentId }) || null

    return ccsDeploymentFromSearch
  }
}

export default injectIntl(EditDeploymentFlyout)
