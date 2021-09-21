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
import { FormattedMessage, defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { camelCase } from 'lodash'

import {
  EuiPanel,
  EuiBadge,
  EuiText,
  EuiSpacer,
  EuiButtonIcon,
  EuiFlexItem,
  EuiFlexGroup,
  EuiHorizontalRule,
  EuiBetaBadge,
} from '@elastic/eui'

import ScrollIntoView from '../../../../../ScrollIntoView'
import { getSliderDefinition } from '../../../../../../lib/sliders'
import { getDefaultUserSettings } from '../../../../../../lib/deployments/userSettings'
import {
  displayAutoscalingLimitReached,
  getFirstEsCluster,
  getNodeRoles,
  getSliderPlan,
  getSliderUserSettings,
  getUpsertVersion,
  hasNodeRole,
  isAutoscaleableTier,
  isData,
  isDedicatedMaster,
  isDedicatedML,
  isFrozen,
  sanitizeNodeRolesForDisplay,
} from '../../../../../../lib/stackDeployments'
import { canDisableConfiguration } from '../../../../../../lib/deployments/architecture'
import { getVersion } from '../../../../../../reducers/clusters'

import AutoscalingEditSettings from '../../../../../Autoscaling/AutoscalingEditSettings'
import Messages from './Messages'
import Summary from './Summary'
import InstanceInfoPopover from './InstanceInfoPopover'
import NormalizeSizing from './NormalizeSizing'
import SizePicker from './SizePicker'
import ZoneCount from './ZoneCount'
import UserSettings from './UserSettings'
import TopologyElementRow from './TopologyElementRow'
import { TopologyElementDescription, TopologyElementTitle } from './helpers'

import { AnyTopologyElement, SliderInstanceType } from '../../../../../../types'
import {
  DeploymentCreateRequest,
  DeploymentGetResponse,
  DeploymentUpdateRequest,
  ElasticsearchClusterTopologyElement,
  InstanceConfiguration,
} from '../../../../../../lib/api/v1/types'

import './topologyElement.scss'

export type AllProps = {
  id: string
  deployment: DeploymentCreateRequest | DeploymentUpdateRequest
  deploymentUnderEdit?: DeploymentGetResponse
  sliderInstanceType: SliderInstanceType
  topologyElement: AnyTopologyElement
  templateTopologyElement?: AnyTopologyElement
  instanceConfiguration: InstanceConfiguration
  onChange: (path: string[], value: any) => void
  onlyShowPricingFactors: boolean
  inTrial: boolean
  showTrialThreshold: boolean
  isAutoscalingEnabled?: boolean
  maxZoneCount: number
  dedicatedMasterThreshold?: number
  subscription?: string | null
  maxInstanceCountForEnvironment: number
  showUserSettings: boolean
  maxInstanceCount?: number
}

type Props = AllProps & WrappedComponentProps

type State = {
  isTitlePopoverOpen: boolean
}

class TopologyElement extends Component<Props, State> {
  state = {
    isTitlePopoverOpen: false,
  }

  render(): JSX.Element {
    const { topologyElement, instanceConfiguration, onlyShowPricingFactors, showUserSettings } =
      this.props

    return (
      <ScrollIntoView
        whenLocationMatches={(hash) => hashMatchesNodeConfiguration(hash, topologyElement)}
      >
        <div data-test-subj='topologyElement' data-id={instanceConfiguration.name}>
          <EuiPanel className='deploymentInfrastructure-topologyElement' paddingSize='none'>
            {this.renderHeading()}
            <div className='deploymentInfrastructure-topologyElement-unshadedArea'>
              {this.displayAutoscalingSettings()
                ? this.renderAutoscalingSize()
                : this.renderSlider()}

              <EuiSpacer size='m' />

              {this.renderAvailabilityZones()}
              {showUserSettings && !onlyShowPricingFactors && this.renderUserSettings()}
              {this.renderMessages()}
            </div>
            <div className='deploymentInfrastructure-topologyElement-shadedArea'>
              {this.renderSummary()}
            </div>
          </EuiPanel>
        </div>
      </ScrollIntoView>
    )
  }

  renderHeading(): JSX.Element | null {
    const {
      topologyElement,
      templateTopologyElement,
      instanceConfiguration,
      intl: { formatMessage },
      deployment,
      dedicatedMasterThreshold,
      isAutoscalingEnabled,
    } = this.props

    const { isTitlePopoverOpen } = this.state

    const isMachineLearningAutoscaling = isAutoscalingEnabled && isDedicatedML({ topologyElement })

    const messages = defineMessages({
      hardware: {
        id: 'instance-info-popover.hardware',
        defaultMessage: 'Hardware',
      },
      description: {
        id: 'instance-info-popover.description',
        defaultMessage: 'Description',
      },
      roles: {
        id: 'instance-info-popover.roles',
        defaultMessage: 'Roles',
      },
      autoscaling: {
        id: 'instance-info-popover.autoscaling',
        defaultMessage: 'Autoscaling',
      },
    })

    const listItems = [
      {
        title: formatMessage(messages.hardware),
        description: instanceConfiguration.name || ``,
      },
      {
        title: formatMessage(messages.description),
        description: instanceConfiguration.description || ``,
      },
      {
        title: formatMessage(messages.roles),
        description: this.renderBadges(),
      },
    ]

    const version = getUpsertVersion({ deployment })

    return (
      <Fragment>
        <EuiSpacer size='s' />
        <div className='topology-element-title'>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize='s' responsive={false}>
                <EuiFlexItem style={{ justifyContent: 'center' }} grow={false}>
                  <TopologyElementTitle
                    topologyElement={templateTopologyElement || topologyElement}
                    instanceConfiguration={instanceConfiguration}
                    version={version}
                  />
                </EuiFlexItem>
                <EuiFlexItem
                  data-test-id='info-instance-popover'
                  data-id={instanceConfiguration.name}
                  grow={false}
                >
                  <InstanceInfoPopover
                    listItems={listItems}
                    onClick={() => this.onClickInfoPopover()}
                    isOpen={isTitlePopoverOpen}
                    onClose={() => this.onClickInfoPopover()}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            {this.displayAutoscalingSettings() && (
              <EuiFlexItem grow={false}>
                <EuiBetaBadge label={formatMessage(messages.autoscaling)} />
              </EuiFlexItem>
            )}
            {canDisableConfiguration({
              nodeConfiguration: topologyElement,
              instanceConfiguration,
              dedicatedMasterThreshold,
            }) &&
              !isMachineLearningAutoscaling && (
                <NormalizeSizing {...this.props}>
                  {({ onChangeSize }) => (
                    <EuiFlexItem style={{ marginTop: 0 }} grow={false}>
                      <EuiButtonIcon
                        data-test-id='topologyElement-remove'
                        iconType='cross'
                        color='danger'
                        onClick={() => onChangeSize(0)}
                        style={{ marginLeft: 4 }}
                        aria-label='remove'
                      />
                    </EuiFlexItem>
                  )}
                </NormalizeSizing>
              )}
          </EuiFlexGroup>

          <TopologyElementDescription
            topologyElement={templateTopologyElement || topologyElement}
            instanceConfiguration={instanceConfiguration}
            version={version}
          />
        </div>
        <EuiHorizontalRule className='instance-heading-rule' margin='xs' size='quarter' />
      </Fragment>
    )
  }

  renderMessages(): JSX.Element {
    return <Messages {...this.props} />
  }

  renderBadges(): JSX.Element {
    const { instanceConfiguration, deployment } = this.props

    // not all topology elements have node types but we're duck-typing that property below
    const topologyElement = this.props.topologyElement as ElasticsearchClusterTopologyElement

    const esResource = getFirstEsCluster({ deployment })!
    const version = getVersion(esResource)

    // the fallbacks here are to still render a badge named for the instance, if the instance has no node types
    const nodeRoles =
      instanceConfiguration.instance_type === `elasticsearch`
        ? getNodeRoles({ topologyElement, version })
        : [instanceConfiguration.instance_type]

    const addCoordinatingBadge =
      instanceConfiguration.instance_type === `elasticsearch` && nodeRoles.includes(`ingest`)

    if (addCoordinatingBadge) {
      nodeRoles.splice(nodeRoles.indexOf(`ingest`), 0, `coordinating`)
    }

    const badges = sanitizeNodeRolesForDisplay(nodeRoles).map((nodeType) => (
      <EuiBadge
        data-test-subj='topologyElement-badge'
        data-id={nodeType}
        key={nodeType}
        color='hollow'
      >
        {nodeType}
      </EuiBadge>
    ))

    return (
      <Fragment>
        <EuiSpacer size='s' />
        <div style={{ maxWidth: '300px' }}>{badges}</div>
      </Fragment>
    )
  }

  renderAutoscalingSize(): JSX.Element {
    const { instanceConfiguration, deploymentUnderEdit } = this.props

    // only applicable to ES in practice, but TS needs to be told
    const topologyElement = this.props.topologyElement as ElasticsearchClusterTopologyElement

    const label = (
      <EuiText size='s'>
        <FormattedMessage
          id='deploymentInfrastructure-topologyElement-sizeLabel'
          defaultMessage='Size per zone'
        />
      </EuiText>
    )

    return (
      <NormalizeSizing {...this.props} capMaxNodeCount={true}>
        {(normalizeSizingProps) => {
          const { size } = normalizeSizingProps
          const displayAutoscalingLimitReachedLabel = displayAutoscalingLimitReached({
            size,
            autoscalingMax: topologyElement.autoscaling_max!.value,
            autoscalingMin: topologyElement.autoscaling_min?.value,
            isMachineLearning: isDedicatedML({ topologyElement }),
          })

          return (
            <TopologyElementRow
              alignItems='center'
              labelColor={displayAutoscalingLimitReachedLabel ? 'warning' : 'subdued'}
              label={label}
            >
              <AutoscalingEditSettings
                {...normalizeSizingProps}
                topologyElement={topologyElement}
                name={instanceConfiguration.name}
                autoscalingMax={topologyElement.autoscaling_max!.value}
                autoscalingMin={topologyElement.autoscaling_min?.value}
                autoscalingPolicyOverrideJson={topologyElement.autoscaling_policy_override_json}
                onChangeIntervalPeriod={(value) =>
                  this.props.onChange([`autoscaling_policy_override_json`], value)
                }
                isMachineLearning={isDedicatedML({ topologyElement })}
                isHotTier={hasNodeRole({ topologyElement, role: 'data_hot' })}
                minimumSizeForElement={topologyElement.topology_element_control?.min.value}
                deploymentUnderEdit={deploymentUnderEdit}
                isFrozen={isFrozen({ topologyElement })}
              />
            </TopologyElementRow>
          )
        }}
      </NormalizeSizing>
    )
  }

  renderSlider(): JSX.Element {
    const {
      instanceConfiguration,
      inTrial,
      showTrialThreshold,
      maxInstanceCountForEnvironment,
      topologyElement,
      maxInstanceCount,
    } = this.props

    const label = (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-sizeLabel'
        defaultMessage='Size per zone'
      />
    )

    return (
      <TopologyElementRow alignItems='center' label={label}>
        <div style={{ maxWidth: `90%` }}>
          <EuiFlexGroup gutterSize='xs'>
            <EuiFlexItem grow={8}>
              <NormalizeSizing {...this.props}>
                {(normalizeSizingProps) => (
                  <SizePicker
                    {...normalizeSizingProps}
                    maxInstanceCount={
                      maxInstanceCount
                        ? Math.min(maxInstanceCount, maxInstanceCountForEnvironment)
                        : maxInstanceCountForEnvironment
                    }
                    topologyElement={topologyElement}
                    sliderInstanceType={instanceConfiguration.instance_type}
                    sliderNodeTypes={instanceConfiguration.node_types}
                    inTrial={inTrial}
                    showTrialThreshold={showTrialThreshold}
                    isBlobStorage={isFrozen({ topologyElement })}
                  />
                )}
              </NormalizeSizing>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </TopologyElementRow>
    )
  }

  renderAvailabilityZones(): JSX.Element {
    const {
      id,
      topologyElement,
      instanceConfiguration,
      onChange,
      inTrial,
      showTrialThreshold,
      maxZoneCount,
    } = this.props

    const label = (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-availabilityZonesLabel'
        defaultMessage='Availability zones'
      />
    )

    return (
      <TopologyElementRow label={label}>
        <ZoneCount
          id={id}
          zoneCount={topologyElement.zone_count!}
          maxZoneCount={maxZoneCount}
          onChange={(value) => onChange([`zone_count`], value)}
          sliderInstanceType={instanceConfiguration.instance_type}
          sliderNodeTypes={getNodeRoles({
            topologyElement,
          })}
          isDedicatedMaster={isDedicatedMaster({ topologyElement })}
          inTrial={inTrial}
          showTrialThreshold={showTrialThreshold}
        />
      </TopologyElementRow>
    )
  }

  renderSummary(): JSX.Element {
    const { instanceConfiguration } = this.props
    const label = (
      <strong>
        <FormattedMessage
          id='deploymentInfrastructure-topologyElement-summaryLabel'
          defaultMessage='Total (size x zone)'
        />
      </strong>
    )
    const topologyElement = this.props.topologyElement as ElasticsearchClusterTopologyElement

    return (
      <TopologyElementRow label={label}>
        <NormalizeSizing {...this.props}>
          {(normalizeSizingProps) => (
            <Summary
              {...normalizeSizingProps}
              topologyElement={topologyElement}
              sliderInstanceType={instanceConfiguration.instance_type}
              instanceConfiguraton={instanceConfiguration}
              isMachineLearning={isDedicatedML({ topologyElement })}
              isFrozen={isFrozen({ topologyElement })}
              autoscalingMin={topologyElement.autoscaling_min?.value}
              zoneCount={topologyElement.zone_count!}
            />
          )}
        </NormalizeSizing>
      </TopologyElementRow>
    )
  }

  renderUserSettings(): JSX.Element {
    const { deployment, topologyElement, instanceConfiguration, onChange } = this.props

    const label = (
      <FormattedMessage
        id='deploymentInfrastructure-topologyElement-userSettingsLabel'
        defaultMessage='User settings'
      />
    )

    const sliderInstanceType = instanceConfiguration.instance_type
    const plan = getSliderPlan({ deployment, sliderInstanceType })

    const settings = getSliderUserSettings({
      sliderInstanceType,
      plan,
      nodeConfiguration: topologyElement,
    })
    const defaultSettings = getDefaultUserSettings(sliderInstanceType)
    const setSettings = (value: string) =>
      onChange([instanceConfiguration.instance_type, `user_settings_yaml`], value)

    const {
      messages: { prettyName },
      userSettingsFileName,
    } = getSliderDefinition({ sliderInstanceType })
    const docLink = `${camelCase(instanceConfiguration.instance_type)}UserSettingsDocLink`

    return (
      <Fragment>
        <EuiSpacer size='l' />
        <TopologyElementRow label={label}>
          <EuiText>
            <UserSettings
              settings={settings == null ? defaultSettings : settings}
              onChange={setSettings}
              prettyName={prettyName}
              fileName={userSettingsFileName}
              docLink={docLink}
            />
          </EuiText>
        </TopologyElementRow>
      </Fragment>
    )
  }

  onClickInfoPopover() {
    this.setState({ isTitlePopoverOpen: !this.state.isTitlePopoverOpen })
  }

  closeInfoPopOver() {
    this.setState({ isTitlePopoverOpen: false })
  }

  displayAutoscalingSettings(): boolean {
    const { isAutoscalingEnabled, topologyElement, deployment } = this.props
    const version = getUpsertVersion({ deployment }) || undefined

    return Boolean(isAutoscalingEnabled) && isAutoscaleableTier({ topologyElement, version })
  }
}

export default injectIntl(TopologyElement)

function hashMatchesNodeConfiguration(hash: string, topologyElement: AnyTopologyElement): boolean {
  if (hash === topologyElement.instance_configuration_id) {
    return true
  }

  // tiebreakers are matched to any data node
  if (hash === `tiebreaker`) {
    return isData({ topologyElement })
  }

  return false
}
