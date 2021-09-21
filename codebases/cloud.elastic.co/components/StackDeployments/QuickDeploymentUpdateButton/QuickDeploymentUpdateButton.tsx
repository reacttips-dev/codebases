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

import { identity, cloneDeep } from 'lodash'
import React, { Component, ReactElement } from 'react'

import { ButtonColor, ButtonSize } from '@elastic/eui'

import { CuiPermissibleControl } from '../../../cui'

import ClusterLockingGate from '../../ClusterLockingGate'
import DangerButton, { DangerButtonModalProps } from '../../DangerButton'

import {
  hasOngoingResourceConfigurationChange,
  createUpdateRequestFromGetResponse,
} from '../../../lib/stackDeployments'

import { mergeDeep } from '../../../lib/immutability-helpers'

import Permission from '../../../lib/api/v1/permissions'

import { DeepPartial } from '../../../lib/ts-essentials'

import { AsyncRequestState, AnyClusterPlanInfo, SliderInstanceType } from '../../../types'

import {
  DeploymentSearchResponse,
  DeploymentGetResponse,
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
} from '../../../lib/api/v1/types'

type StackDeployment = DeploymentSearchResponse | DeploymentGetResponse

type StateProps = {
  regionId: string
  hideExtraFailoverOptions: boolean
  hidePlanDetails: boolean
  showAdvancedEditor: boolean
  updateStackDeploymentRequest: AsyncRequestState
  deploymentTemplate?: DeploymentTemplateInfoV2
}

type DispatchProps = {
  updateDeployment: (params: { deploymentId: string; deployment: DeploymentUpdateRequest }) => void
  resetUpdateDeployment: (deploymentId: string) => void
}

type ConsumerProps = {
  fill?: boolean
  size?: ButtonSize
  color?: ButtonColor
  isEmpty?: boolean
  disabled?: boolean
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
  planAttemptUnderRetry: AnyClusterPlanInfo
  pruneOrphans?: boolean
  confirmTitle?: ReactElement
  customizeModal: (
    props: QuickDeploymentUpdateCustomModalProps,
  ) => DangerButtonModalProps | undefined
  transformBeforeSave?: (deployment: DeploymentUpdateRequest) => DeploymentUpdateRequest
  ['data-test-id']?: string
}

export type Props = StateProps & DispatchProps & ConsumerProps

type DefaultProps = {
  transformBeforeSave: (deployment: DeploymentUpdateRequest) => DeploymentUpdateRequest
}

type AdditionalModalProps = {
  updatePayload: DeploymentUpdateRequest
  onChange: (
    changes: DeepPartial<DeploymentUpdateRequest>,
    settings?: { shallow?: boolean },
  ) => void
}

export type QuickDeploymentUpdateCustomModalProps = Props & AdditionalModalProps

type State = {
  updatePayload: DeploymentUpdateRequest
}

class QuickDeploymentUpdateButton extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps = {
    transformBeforeSave: identity,
  }

  state: State = this.getInitialState()

  getInitialState(): State {
    const {
      deployment,
      deploymentTemplate,
      planAttemptUnderRetry,
      sliderInstanceType,
      pruneOrphans,
    } = this.props

    const updatePayload = createUpdateRequestFromGetResponse({
      deployment,
      deploymentTemplate,
      planAttemptUnderRetry: planAttemptUnderRetry && planAttemptUnderRetry.plan,
      planAttemptSliderInstanceType: sliderInstanceType,
      pruneOrphans,
    })

    return {
      updatePayload,
    }
  }

  render() {
    const {
      ['data-test-id']: dataTestSubj,
      children,
      color = `warning`,
      disabled,
      fill = false,
      isEmpty,
      size = `s`,
      updateStackDeploymentRequest,
      sliderInstanceType,
      deployment,
    } = this.props

    const [resource] = deployment.resources[sliderInstanceType]
    const ongoingChanges = hasOngoingResourceConfigurationChange({ resource })

    return (
      <ClusterLockingGate>
        <CuiPermissibleControl permissions={Permission.updateDeployment}>
          <DangerButton
            color={color}
            disabled={disabled || ongoingChanges}
            spin={updateStackDeploymentRequest.inProgress}
            data-test-id={dataTestSubj}
            isEmpty={isEmpty}
            fill={fill}
            requiresSudo={true}
            size={size}
            onConfirm={this.confirmedUpdate}
            onClose={this.revertState}
            modal={this.getModalProps()}
          >
            {children}
          </DangerButton>
        </CuiPermissibleControl>
      </ClusterLockingGate>
    )
  }

  getModalProps() {
    const { customizeModal } = this.props
    const { updatePayload } = this.state
    return (
      customizeModal && customizeModal({ ...this.props, updatePayload, onChange: this.onChange })
    )
  }

  onChange = (
    changes: DeepPartial<DeploymentUpdateRequest>,
    { shallow }: { shallow?: boolean } = {},
  ) => {
    if (shallow) {
      // NOTE: when doing shallow changes, ensure you actually send us whole objects!
      return this.onChangeShallow(changes as Partial<DeploymentUpdateRequest>)
    }

    return this.onChangeDeep(changes)
  }

  onChangeShallow = (changes: Partial<DeploymentUpdateRequest>) => {
    const { updatePayload } = this.state

    const nextUpdatePayload: DeploymentUpdateRequest = {
      ...updatePayload,
      ...changes,
    }

    this.setState({ updatePayload: nextUpdatePayload })
  }

  onChangeDeep = (changes: DeepPartial<DeploymentUpdateRequest>) => {
    const { updatePayload } = this.state
    const nextUpdatePayload = mergeDeep(updatePayload, changes)

    this.setState({ updatePayload: nextUpdatePayload })
  }

  confirmedUpdate = () => {
    const {
      deployment: { id },
      updateDeployment,
      transformBeforeSave,
    } = this.props

    const { updatePayload } = this.state

    const deployment = transformBeforeSave(cloneDeep(updatePayload))

    updateDeployment({ deploymentId: id, deployment })
  }

  revertState = () => {
    this.setState(this.getInitialState())
  }
}

export default QuickDeploymentUpdateButton
