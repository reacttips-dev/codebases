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
  EuiButton,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiOverlayMask,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import DocLink from '../../DocLink'
import NodeRolesWarning from '../../StackDeploymentEditor/EditStackDeploymentEditor/EditDeploymentFromTemplate/NodeRolesWarning'

import {
  createUpdateRequestFromGetResponse,
  getRegionId,
  sanitizeUpdateRequestBeforeSend,
  getBlankNodeConfigurationPerTemplate,
  setAutoscalingEnabled,
} from '../../../lib/stackDeployments'

import { getEnableAutoscalingLsKey } from '../../../constants/localStorageKeys'

import { StackDeployment } from '../../../types'
import {
  DeploymentTemplateInfoV2,
  DeploymentUpdateRequest,
  ElasticsearchClusterPlan,
} from '../../../lib/api/v1/types'

import '../autoscalingCallout.scss'

interface Props extends WrappedComponentProps {
  stackDeployment: StackDeployment
  deploymentTemplate?: DeploymentTemplateInfoV2
  updateDeployment: (settings: {
    regionId: string
    deploymentId: string
    deployment: DeploymentUpdateRequest
  }) => void
}

type State = {
  isDismissed: boolean
  isModalOpen: boolean
}

const messages = defineMessages({
  dismiss: {
    id: 'autoscaling-available-callout.dismiss',
    defaultMessage: 'Dismiss',
  },
})

class AutoscalingAvailableCallout extends Component<Props, State> {
  state: State = {
    isDismissed: this.isCalloutDismissed(),
    isModalOpen: false,
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props
    const { isDismissed } = this.state

    if (isDismissed) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut
          data-test-id='autoscalingAvailable-callout'
          className='autoscaling-callout'
          title={
            <EuiFlexGroup responsive={false}>
              <EuiFlexItem>
                <FormattedMessage
                  id='autoscaling-available-callout.title'
                  defaultMessage='Autoscaling is available'
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  onClick={this.dismissCookie}
                  iconType='cross'
                  aria-label={formatMessage(messages.dismiss)}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          }
        >
          <Fragment>
            <p>
              <FormattedMessage
                id='autoscaling-available-callout.description'
                defaultMessage='You can now enable autoscaling on your deployment. When the deployment approaches the disk allocation threshold, storage capacity will scale up automatically. Additionally, for machine learning nodes RAM can scale both up and down. {learnMore}'
                values={{
                  learnMore: (
                    <DocLink link='autoscalingEnableDocLink'>
                      <FormattedMessage
                        id='autoscaling-available-callout.learn-more'
                        defaultMessage='Learn more'
                      />
                    </DocLink>
                  ),
                }}
              />
            </p>
            <EuiButton
              fill={true}
              onClick={() => this.setState({ isModalOpen: true })}
              data-test-id='autoscaling-available-callout-button'
            >
              <FormattedMessage
                id='autoscaling-available-callout.enable-autoscaling'
                defaultMessage='Enable autoscaling'
              />
            </EuiButton>
          </Fragment>
        </EuiCallOut>
        <EuiSpacer />

        {this.renderModal()}
      </Fragment>
    )
  }

  renderModal = () => {
    const { stackDeployment } = this.props
    const { isModalOpen } = this.state

    if (!isModalOpen) {
      return null
    }

    return (
      <EuiOverlayMask>
        <EuiModal
          onClose={() => this.setState({ isModalOpen: false })}
          data-test-id='enable-autoscaling-modal'
        >
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='autoscaling-available-callout-modal.title'
                defaultMessage='Enable autoscaling'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            <EuiText>
              <NodeRolesWarning deploymentUnderEdit={stackDeployment} />
              <p>
                <FormattedMessage
                  id='autoscaling-available-callout-modal.body-intro'
                  defaultMessage='Autoscaling increases deployment storage capacity automatically. For ML nodes both storage capacity and RAM increase and decrease. Future capacity needs are forecasted based on past usage.'
                />
              </p>
              <p>
                <FormattedMessage
                  id='autoscaling-available-callout-modal.body-second'
                  defaultMessage='You can set the maximum size per zone in order to avoid excess costs. For ML nodes you can set a maximum and minimum.'
                />
              </p>
            </EuiText>
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty
              onClick={() => this.setState({ isModalOpen: false })}
              data-test-id='autoscaling-enable-modal-cancel'
            >
              <FormattedMessage
                id='autoscaling-available-callout-modal.cancel'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>

            <EuiButton
              onClick={this.enableAutoscaling}
              data-test-id='autoscaling-enable-modal-confirm'
              fill={true}
            >
              <FormattedMessage
                id='autoscaling-available-callout-modal.enable'
                defaultMessage='Enable autoscaling'
              />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  enableAutoscaling = () => {
    const { updateDeployment, stackDeployment } = this.props
    const updatePayload = this.getUpdatePayload()

    this.setState({ isModalOpen: false })
    this.dismissCookie()

    updateDeployment({
      regionId: getRegionId({ deployment: stackDeployment! })!,
      deploymentId: stackDeployment!.id,
      deployment: updatePayload,
    })
  }

  dismissCookie = () => {
    const { stackDeployment } = this.props
    this.setState({ isDismissed: true })
    localStorage.setItem(getEnableAutoscalingLsKey({ deploymentId: stackDeployment!.id }), `true`)
  }

  getUpdatePayload = () => {
    const { stackDeployment, deploymentTemplate } = this.props
    const updateRequest = createUpdateRequestFromGetResponse({
      deployment: stackDeployment,
      deploymentTemplate,
    })

    const blankTemplate = getBlankNodeConfigurationPerTemplate({
      sliderInstanceType: 'elasticsearch',
      deploymentTemplate: deploymentTemplate!,
    }) as ElasticsearchClusterPlan

    const updateRequestWithEnabledAutoscaling = setAutoscalingEnabled({
      deployment: updateRequest,
      blankTemplate,
    })

    return sanitizeUpdateRequestBeforeSend({ deployment: updateRequestWithEnabledAutoscaling })
  }

  isCalloutDismissed(): boolean {
    const { stackDeployment } = this.props

    if (
      localStorage.getItem(getEnableAutoscalingLsKey({ deploymentId: stackDeployment!.id })) ===
      `true`
    ) {
      return true
    }

    return false
  }
}

export default injectIntl(AutoscalingAvailableCallout)
