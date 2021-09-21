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

import React, { PureComponent, Fragment, ReactNode } from 'react'
import { defineMessages, FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiContextMenu,
  EuiHorizontalRule,
  EuiPopover,
  EuiSpacer,
  EuiToolTip,
} from '@elastic/eui'

import { CuiButtonEmpty, CuiPermissibleControl } from '../../../../cui'

import StopRoutingRequestsModal from '../StopRoutingRequestsModal'
import PauseInstanceModal from '../PauseInstanceModal'

import VacateNodeThroughClusterModal from '../../StackDeploymentNodesVisualization/VacateNodeThroughClusterModal'
import VacateNodeThroughAllocatorModal from '../../StackDeploymentNodesVisualization/VacateNodeThroughAllocatorModal'
import InstanceCapacityOverrideModal from '../../StackDeploymentNodesVisualization/InstanceCapacityOverrideModal'
import DiskQuotaOverrideModal from '../../StackDeploymentNodesVisualization/DiskQuotaOverrideModal'

import ClusterLockingGate from '../../../ClusterLockingGate'
import LogicSudoGate from '../../../LogicSudoGate'

import {
  isSystemOwned,
  hasStoppedRoutingRequests,
  isNodePausedByUser,
} from '../../../../lib/stackDeployments'

import { deploymentEditUrl } from '../../../../lib/urlBuilder'

import { isPermitted } from '../../../../lib/requiresPermission'

import Permission from '../../../../lib/api/v1/permissions'

import {
  ClusterInstanceConfigurationInfo,
  ClusterInstanceInfo,
  ElasticsearchResourceInfo,
} from '../../../../lib/api/v1/types'

import {
  startHeapDumpCaptureSuccessToast,
  startHeapDumpCaptureFailToast,
} from '../../../ManageHeapDumps/ManageHeapDumps'

import { AsyncRequestState, SliderInstanceType, StackDeployment } from '../../../../types'

import './nodeTileMenu.scss'

export interface Props extends WrappedComponentProps {
  canCaptureHeapDumps: boolean
  canMoveNode: boolean
  deployment: StackDeployment
  disableNodeControlsIfPlanPending?: boolean
  diskQuotaOverride: boolean
  fetchDeployment: () => void
  hasSudo: boolean
  instance: ClusterInstanceInfo
  instanceCapacityOverride: boolean
  instanceConfiguration?: ClusterInstanceConfigurationInfo
  isAdminConsole: boolean
  isSudoFeatureActivated: boolean
  kind: SliderInstanceType
  resource: ElasticsearchResourceInfo
  startHeapDumpCapture: () => Promise<void>
  startHeapDumpCaptureRequest: AsyncRequestState
  startInstance: () => Promise<void>
  startRouting: () => Promise<void>
  stopInstance: () => Promise<void>
  stopRouting: () => Promise<void>
  type: 'node' | 'instance'
}

interface State {
  isPopoverOpen: boolean
  showMoveNodeModal: boolean
  showInstanceCapacityModal: boolean
  showDiskQuotaModal: boolean
  showStopRoutingRequestsModal: boolean
  showPauseInstanceModal: boolean
  startInstance: boolean
  startRoutingRequests: boolean
}

const messages = defineMessages({
  buttonAriaLabel: {
    id: 'node-tile-menu-button-aria-label',
    defaultMessage: 'Instance menu items',
  },
  editSettings: {
    id: 'node-tile-menu-edit-configuration',
    defaultMessage: 'Edit configuration',
  },
  stopRoutingRequests: {
    id: 'node-tile-menu-stop-routing-requests',
    defaultMessage: 'Stop routing requests',
  },
  startRoutingRequests: {
    id: 'node-tile-menu-start-routing-requests',
    defaultMessage: 'Start routing requests',
  },
  pauseInstance: {
    id: 'node-tile-menu-pause-instance',
    defaultMessage: 'Pause instance',
  },
  startInstance: {
    id: 'node-tile-menu-start-instance',
    defaultMessage: 'Resume instance',
  },
  moveInstance: {
    id: 'node-tile-menu-stop-move-instance',
    defaultMessage: 'Move instance (node)',
  },
  overrideInstanceSize: {
    id: 'node-tile-menu-stop-override-instance-size',
    defaultMessage: 'Override instance size',
  },
  overrideDiskQuota: {
    id: 'node-tile-menu-stop-override-disk-quota',
    defaultMessage: 'Override disk quota',
  },
  captureHeapDump: {
    id: 'node-tile-menu-capture-heap-dump',
    defaultMessage: 'Capture heap dump',
  },
  disabledWhileConfigurationInProgress: {
    id: 'node-tile-menu.disabled-while-configuring',
    defaultMessage: 'Disabled while configuration in progress.',
  },
  enableSecondFactorAuthentication: {
    id: 'node-tile-menu.requires-sudo-message',
    defaultMessage: 'Enter second factor authentication to enable additional operations',
  },
})

class NodeTileMenu extends PureComponent<Props, State> {
  private configurationChangeInProgress

  state = {
    isPopoverOpen: false,
    showMoveNodeModal: false,
    showInstanceCapacityModal: false,
    showDiskQuotaModal: false,
    showStopRoutingRequestsModal: false,
    showPauseInstanceModal: false,
    startInstance: false,
    startRoutingRequests: false,
  }

  componentDidMount() {
    this.configurationChangeInProgress = this.isConfigurationChangeInProgress()
  }

  componentDidUpdate() {
    this.configurationChangeInProgress = this.isConfigurationChangeInProgress()
  }

  render() {
    const {
      intl: { formatMessage },
      deployment,
      instance,
      instanceConfiguration,
      isAdminConsole,
      resource,
      type,
    } = this.props

    const {
      showInstanceCapacityModal,
      showDiskQuotaModal,
      showStopRoutingRequestsModal,
      showPauseInstanceModal,
      startInstance,
      startRoutingRequests,
    } = this.state

    return (
      <ClusterLockingGate>
        <EuiPopover
          button={
            <EuiButtonIcon
              aria-label={formatMessage(messages.buttonAriaLabel)}
              color='text'
              iconType='boxesVertical'
              onClick={this.toggle}
              data-test-id='node-tile-menu-button'
            />
          }
          isOpen={this.state.isPopoverOpen}
          closePopover={this.closePopover}
          panelPaddingSize='none'
        >
          {isAdminConsole
            ? this.renderAdminConsoleMenuContent()
            : this.renderUserConsoleMenuContent()}
        </EuiPopover>

        {this.renderMoveInstanceModal()}

        {showInstanceCapacityModal && (
          <InstanceCapacityOverrideModal
            deployment={deployment}
            instance={instance}
            resource={resource}
            instanceConfiguration={instanceConfiguration!}
            close={this.hideInstanceCapacityModal}
          />
        )}

        {showDiskQuotaModal && (
          <DiskQuotaOverrideModal
            deployment={deployment}
            instance={instance}
            resource={resource}
            instanceConfiguration={instanceConfiguration}
            close={this.hideDiskQuotaModal}
          />
        )}

        {showStopRoutingRequestsModal && (
          <StopRoutingRequestsModal
            type={type}
            close={this.hideStopRoutingRequestsModal}
            onConfirm={this.onConfirmStopRoutingRequests}
          />
        )}

        {showPauseInstanceModal && (
          <PauseInstanceModal
            type={type}
            close={this.hidePauseInstanceModal}
            onConfirm={this.onConfirmPauseInstance}
          />
        )}

        {startInstance && (
          <LogicSudoGate onSudo={this.onCanStartInstance} onCancel={this.onCancelStartInstance} />
        )}

        {startRoutingRequests && (
          <LogicSudoGate
            onSudo={this.onCanStartRoutingRequests}
            onCancel={this.onCancelStartRoutingRequests}
          />
        )}
      </ClusterLockingGate>
    )
  }

  renderUserConsoleMenuContent() {
    return (
      <Fragment>
        <EuiContextMenu
          className='node-tile-menu-panel-content'
          initialPanelId='root'
          data-test-id='node-tile-menu-root'
          panels={[
            {
              id: 'root',
              content: (
                <Fragment>
                  {this.renderStopRoutingRequestsItem()}

                  <EuiSpacer size='xs' />

                  {this.renderEditConfigurationsItem()}
                </Fragment>
              ),
            },
          ]}
        />
      </Fragment>
    )
  }

  renderAdminConsoleMenuContent() {
    return (
      <Fragment>
        <EuiContextMenu
          className='node-tile-menu-panel-content'
          initialPanelId='root'
          data-test-id='node-tile-menu-root'
          panels={[
            {
              id: 'root',
              content: (
                <Fragment>
                  <EuiSpacer size='xs' />

                  {this.renderEditConfigurationsItem()}

                  <EuiSpacer size='xs' />

                  <EuiHorizontalRule margin='none' />

                  {this.renderEceInstanceActionItems()}

                  <EuiHorizontalRule margin='none' />

                  {this.renderEceOverrideActionItems()}
                  {this.renderEceHeapDumpActionItems()}
                </Fragment>
              ),
            },
          ]}
        />
      </Fragment>
    )
  }

  renderMoveInstanceModal() {
    const { fetchDeployment, instance, kind, resource } = this.props

    const { showMoveNodeModal } = this.state

    if (!showMoveNodeModal) {
      return null
    }

    if (kind === 'elasticsearch') {
      return (
        <VacateNodeThroughClusterModal
          resource={resource}
          instance={instance}
          close={this.hideMoveNodeModal}
          onAfterVacate={fetchDeployment}
        />
      )
    }

    return (
      <VacateNodeThroughAllocatorModal
        kind={kind}
        resource={resource}
        instance={instance}
        close={this.hideMoveNodeModal}
        onAfterVacate={fetchDeployment}
      />
    )
  }

  renderEditConfigurationsItem(): ReactNode {
    const {
      intl: { formatMessage },
      instance,
      instanceConfiguration,
    } = this.props

    const isTieBreaker = instance.instance_name.includes(`tiebreaker`)
    const hash = getInstanceConfigurationHash()

    const disabled = this.configurationChangeInProgress

    const content = (
      <EuiButtonEmpty
        color='text'
        iconType='pencil'
        data-test-id='node-tile-menu-edit-configuration'
        href={this.getEditPageHref(hash)}
        disabled={disabled}
      >
        {formatMessage(messages.editSettings)}
      </EuiButtonEmpty>
    )

    if (disabled) {
      return (
        <EuiToolTip
          position='right'
          content={formatMessage(messages.disabledWhileConfigurationInProgress)}
        >
          {content}
        </EuiToolTip>
      )
    }

    return content

    function getInstanceConfigurationHash(): string | undefined {
      if (isTieBreaker) {
        return 'tiebreaker'
      }

      if (instanceConfiguration) {
        return instanceConfiguration.id
      }
    }
  }

  renderManageInstanceItems() {
    return (
      <Fragment>
        <EuiSpacer size='xs' />

        {this.renderStopRoutingRequestsItem()}

        <EuiSpacer size='xs' />

        {this.renderPauseInstanceItem()}
      </Fragment>
    )
  }

  renderStopRoutingRequestsItem(): ReactNode {
    const {
      deployment,
      instance,
      intl: { formatMessage },
    } = this.props
    const systemOwned = isSystemOwned({ deployment })
    const disabled = this.configurationChangeInProgress || systemOwned
    const stoppedRoutingRequests = hasStoppedRoutingRequests(instance)
    const permissionRequired = stoppedRoutingRequests
      ? Permission.stopDeploymentResourceInstancesAllMaintenanceMode
      : Permission.startDeploymentResourceInstancesAllMaintenanceMode

    let toolTipContent

    if (disabled) {
      if (this.configurationChangeInProgress) {
        toolTipContent = formatMessage(messages.disabledWhileConfigurationInProgress)
      }

      if (systemOwned) {
        if (stoppedRoutingRequests) {
          toolTipContent = (
            <FormattedMessage
              id='node-tile-menu.cannot-start-system-deployment'
              defaultMessage='You cannot start a system deployment.'
            />
          )
        }

        if (!stoppedRoutingRequests) {
          toolTipContent = (
            <FormattedMessage
              id='node-tile-menu.cannot-stop-system-deployment'
              defaultMessage='You cannot stop a system deployment.'
            />
          )
        }
      }
    }

    const panelContent = (
      <CuiPermissibleControl permissions={permissionRequired}>
        {stoppedRoutingRequests ? (
          <EuiButtonEmpty
            color='text'
            data-test-id='node-tile-menu-start-routing-requests'
            disabled={disabled}
            iconType='play'
            onClick={this.onClickStartRoutingRequests}
          >
            {formatMessage(messages.startRoutingRequests)}
          </EuiButtonEmpty>
        ) : (
          <EuiButtonEmpty
            color='text'
            data-test-id='node-tile-menu-stop-routing-requests'
            disabled={disabled}
            iconType='stop'
            onClick={this.onClickStopRoutingRequests}
          >
            {formatMessage(messages.stopRoutingRequests)}
          </EuiButtonEmpty>
        )}
      </CuiPermissibleControl>
    )

    if (disabled) {
      return (
        <EuiToolTip position='right' content={toolTipContent}>
          {panelContent}
        </EuiToolTip>
      )
    }

    return panelContent
  }

  renderPauseInstanceItem() {
    const {
      deployment,
      instance,
      intl: { formatMessage },
    } = this.props

    const systemOwned = isSystemOwned({ deployment })
    const disabled = this.configurationChangeInProgress || systemOwned
    const isStarted = !isNodePausedByUser(instance)
    const permissionRequired = isStarted
      ? Permission.stopDeploymentResourceInstancesAllMaintenanceMode
      : Permission.startDeploymentResourceInstancesAllMaintenanceMode
    let toolTipContent

    if (disabled) {
      if (this.configurationChangeInProgress) {
        toolTipContent = formatMessage(messages.disabledWhileConfigurationInProgress)
      }

      if (systemOwned) {
        if (isStarted) {
          toolTipContent = (
            <FormattedMessage
              id='node-tile-menu.cannot-pause-deployment'
              defaultMessage='You cannot pause a system deployment.'
            />
          )
        }

        if (!isStarted) {
          toolTipContent = (
            <FormattedMessage
              id='node-tile-menu.cannot-resume-deployment'
              defaultMessage='You cannot resume a system deployment.'
            />
          )
        }
      }
    }

    const content = (
      <CuiPermissibleControl permissions={permissionRequired}>
        {isStarted ? (
          <EuiButtonEmpty
            color='text'
            data-test-id='node-tile-menu-pause-instance'
            disabled={disabled}
            iconType='pause'
            onClick={this.onClickPauseInstance}
          >
            {formatMessage(messages.pauseInstance)}
          </EuiButtonEmpty>
        ) : (
          <EuiButtonEmpty
            color='text'
            data-test-id='node-tile-menu-resume-instance'
            disabled={disabled}
            iconType='play'
            onClick={this.onClickStartInstance}
          >
            {formatMessage(messages.startInstance)}
          </EuiButtonEmpty>
        )}
      </CuiPermissibleControl>
    )

    return disabled ? (
      <EuiToolTip position='right' content={toolTipContent}>
        {content}
      </EuiToolTip>
    ) : (
      content
    )
  }

  renderMoveInstanceItem() {
    const {
      intl: { formatMessage },
    } = this.props

    const disabled = this.configurationChangeInProgress

    const content = (
      <EuiButtonEmpty
        color='text'
        data-test-id='node-tile-menu-move-instance'
        disabled={disabled}
        iconType='node'
        onClick={this.onClickMoveInstance}
      >
        {formatMessage(messages.moveInstance)}
      </EuiButtonEmpty>
    )

    return disabled ? (
      <EuiToolTip
        position='right'
        content={formatMessage(messages.disabledWhileConfigurationInProgress)}
      >
        {content}
      </EuiToolTip>
    ) : (
      content
    )
  }

  renderEceInstanceActionItems() {
    const { canMoveNode } = this.props

    return (
      <Fragment>
        {this.renderManageInstanceItems()}

        {canMoveNode && (
          <Fragment>
            <EuiSpacer size='xs' />
            {this.renderMoveInstanceItem()}
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderInstanceCapacityOverrideItem() {
    const {
      intl: { formatMessage },
    } = this.props
    const disabled = this.configurationChangeInProgress

    const content = (
      <EuiButtonEmpty
        color='text'
        data-test-id='node-tile-menu-move-override-capacity'
        disabled={disabled}
        iconType='memory'
        onClick={this.onClickOverrideInstanceSize}
      >
        {formatMessage(messages.overrideInstanceSize)}
      </EuiButtonEmpty>
    )

    return disabled ? (
      <EuiToolTip
        position='right'
        content={formatMessage(messages.disabledWhileConfigurationInProgress)}
      >
        {content}
      </EuiToolTip>
    ) : (
      content
    )
  }

  renderOverrideDiskQuotaItem() {
    const {
      intl: { formatMessage },
    } = this.props
    const disabled = this.configurationChangeInProgress

    const content = (
      <EuiButtonEmpty
        color='text'
        data-test-id='node-tile-menu-move-override-disk-quota'
        disabled={disabled}
        iconType='storage'
        onClick={this.onClickOverrideDiskQuota}
      >
        {formatMessage(messages.overrideDiskQuota)}
      </EuiButtonEmpty>
    )

    return disabled ? (
      <EuiToolTip
        position='right'
        content={formatMessage(messages.disabledWhileConfigurationInProgress)}
      >
        {content}
      </EuiToolTip>
    ) : (
      content
    )
  }

  renderEceOverrideActionItems() {
    const { instanceCapacityOverride, diskQuotaOverride } = this.props

    if (isPermitted(Permission.setEsClusterInstancesSettingsOverrides)) {
      return (
        <Fragment>
          {instanceCapacityOverride && (
            <Fragment>
              <EuiSpacer size='xs' />
              {this.renderInstanceCapacityOverrideItem()}
            </Fragment>
          )}

          {diskQuotaOverride && this.renderOverrideDiskQuotaItem()}
        </Fragment>
      )
    }

    return null
  }

  renderEceHeapDumpActionItems() {
    const {
      intl: { formatMessage },
      canCaptureHeapDumps,
      startHeapDumpCaptureRequest,
    } = this.props

    if (!canCaptureHeapDumps) {
      return null
    }

    return (
      <CuiButtonEmpty
        data-test-id='node-tile-menu-capture-heap-dump'
        color='text'
        iconType='inspect'
        onClick={() => this.startCapture()}
        spin={startHeapDumpCaptureRequest.inProgress}
        requiresSudo={true}
      >
        {formatMessage(messages.captureHeapDump)}
      </CuiButtonEmpty>
    )
  }

  isConfigurationChangeInProgress() {
    const { resource, disableNodeControlsIfPlanPending } = this.props
    return !!disableNodeControlsIfPlanPending && !!resource.info.plan_info.pending
  }

  getEditPageHref = (hash?: string) => {
    const { deployment } = this.props
    const editUrl = deploymentEditUrl(deployment.id)

    if (hash) {
      return `${editUrl}#${hash}`
    }

    return editUrl
  }

  onClickPauseInstance = () => {
    this.setState({ showPauseInstanceModal: true })
    this.closePopover()
  }

  onConfirmPauseInstance = () => {
    this.setState({ showPauseInstanceModal: false })
    this.props.stopInstance()
  }

  onClickStartInstance = () => {
    const { isSudoFeatureActivated, hasSudo } = this.props

    if (isSudoFeatureActivated && !hasSudo) {
      this.setState({ startInstance: true })
    }

    if (!isSudoFeatureActivated || hasSudo) {
      this.props.startInstance()
    }

    this.closePopover()
  }

  onCanStartInstance = () => {
    this.setState({ startInstance: false })
    this.props.startInstance()
  }

  onCancelStartInstance = () => {
    this.setState({ startInstance: false })
  }

  onClickStopRoutingRequests = () => {
    this.setState({ showStopRoutingRequestsModal: true })
    this.closePopover()
  }

  onConfirmStopRoutingRequests = () => {
    this.setState({ showStopRoutingRequestsModal: false })
    this.props.stopRouting()
  }

  onClickStartRoutingRequests = () => {
    const { isSudoFeatureActivated, hasSudo } = this.props

    if (isSudoFeatureActivated && !hasSudo) {
      this.setState({ startRoutingRequests: true })
    }

    if (!isSudoFeatureActivated || hasSudo) {
      this.props.startRouting()
    }

    this.closePopover()
  }

  onCancelStartRoutingRequests = () => {
    this.setState({ startRoutingRequests: false })
  }

  onCanStartRoutingRequests = () => {
    this.setState({ startRoutingRequests: false })
    this.props.startRouting()
  }

  onClickMoveInstance = () => {
    this.setState({ showMoveNodeModal: true })
    this.closePopover()
  }

  onClickOverrideInstanceSize = () => {
    this.setState({ showInstanceCapacityModal: true })
    this.closePopover()
  }

  onClickOverrideDiskQuota = () => {
    this.setState({ showDiskQuotaModal: true })
    this.closePopover()
  }

  toggle = () => {
    this.setState((prevState) => ({ isPopoverOpen: !prevState.isPopoverOpen }))
  }

  closePopover = () => {
    this.setState({ isPopoverOpen: false })
  }

  hideMoveNodeModal = () => {
    this.setState({ showMoveNodeModal: false })
  }

  hideInstanceCapacityModal = () => {
    this.setState({ showInstanceCapacityModal: false })
  }

  hideDiskQuotaModal = () => {
    this.setState({ showDiskQuotaModal: false })
  }

  hideStopRoutingRequestsModal = () => {
    this.setState({ showStopRoutingRequestsModal: false })
  }

  hidePauseInstanceModal = () => {
    this.setState({ showPauseInstanceModal: false })
  }

  startCapture() {
    const { startHeapDumpCapture } = this.props

    startHeapDumpCapture().then(startHeapDumpCaptureSuccessToast, startHeapDumpCaptureFailToast)
  }
}

export default injectIntl(NodeTileMenu)
