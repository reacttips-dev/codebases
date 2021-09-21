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
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl'
import { get, isNumber } from 'lodash'

import {
  EuiAccordion,
  EuiBetaBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiHorizontalRule,
  EuiLink,
  EuiSelect,
  EuiSpacer,
  EuiSuperSelect,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import Summary from '../Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/Summary'

import {
  displayAutoscalingLimitReached,
  getSliderNodeTypeForTopologyElement,
} from '../../lib/stackDeployments'

import { NormalizeSizingProps } from '../Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/NormalizeSizing'

import {
  getKeys,
  getSizeOptionText,
} from '../Topology/DeploymentTemplates/components/DeploymentInfrastructure/TopologyElement/helpers'

import { AnyTopologyElementWithNodeRoles } from '../../types'
import { DeploymentGetResponse } from '../../lib/api/v1/types'

import './autoscalingEditSettings.scss'

const messages = {
  maxSizePerZone: {
    id: 'autoscaling-edit-settings.form.max-size-per-zone',
    defaultMessage: 'Maximum size per zone',
  },
  maxSizePerZoneHelp: {
    id: 'autoscaling-edit-settings.form.max-size-per-zone.help',
    defaultMessage: 'We will never autoscale this tier beyond the maximum size per zone.',
  },
  minSizePerZone: {
    id: 'autoscaling-edit-settings.form.min-size-per-zone',
    defaultMessage: 'Minimum size per zone',
  },
  minSizePerZoneHelp: {
    id: 'autoscaling-edit-settings.form.min-size-per-zone.help',
    defaultMessage: 'We will never autoscale this tier below the minimum size per zone.',
  },
  initialSizePerZone: {
    id: 'autoscaling-edit-settings.form.current-size-per-zone',
    defaultMessage: 'Initial size per zone',
  },
  currentSizePerZone: {
    id: 'autoscaling-edit-settings.form.current-size-per-zone',
    defaultMessage: 'Current size per zone',
  },
  currentSizePerZoneHelp: {
    id: 'autoscaling-edit-settings.form.current-size-per-zone.help',
    defaultMessage:
      'To maintain this size while autoscaling is enabled, set the maximum size per zone to match this value.',
  },
  forecastWindow: {
    id: 'autoscaling-edit-settings.form.forecast-window',
    defaultMessage: 'Forecast window',
  },
  forecastWindowHelp: {
    id: 'autoscaling-edit-settings.form.forecast-window.help',
    defaultMessage: 'Make capacity changes based on the usage during this previous period of time.',
  },
  mins: {
    id: 'autoscaling-edit-settings.form.minute',
    defaultMessage: '{amount} {amount, plural, one {minute} other {minutes}}',
  },
  hours: {
    id: 'autoscaling-edit-settings.form.hour',
    defaultMessage: '{amount} {amount, plural, one {hour} other {hours}}',
  },
  days: {
    id: 'autoscaling-edit-settings.form.day',
    defaultMessage: '{amount} {amount, plural, one {day} other {days}}',
  },
}

// Keeping all EuiSuperSelect in line when not scoped under a single parent
const maxWidth = `335px`

export interface Props extends WrappedComponentProps, NormalizeSizingProps {
  name?: string
  autoscalingMax: number
  autoscalingMin?: number
  autoscalingPolicyOverrideJson?: { [key: string]: any }
  onChangeIntervalPeriod?: (value) => void
  isMachineLearning?: boolean
  isHotTier?: boolean
  isFrozen?: boolean
  minimumSizeForElement?: number
  buttonText?: JSX.Element
  isLink?: boolean
  deploymentUnderEdit?: DeploymentGetResponse
  topologyElement: AnyTopologyElementWithNodeRoles
}

type State = {
  flyoutOpen: boolean
  pendingAutoscalingMax: number
  pendingAutoscalingMin: number | undefined
  pendingAutoscalingMaxNodeCount: number
  pendingAutoscalingMinNodeCount: number
  pendingInterval: string
  pendingSize: number
  pendingNodeCount: number
  isEditingSize: boolean
}

class AutoscalingEditSettings extends Component<Props, State> {
  state = this.getInitialState()

  getInitialState(): State {
    const { autoscalingMax, autoscalingMin, autoscalingPolicyOverrideJson, size } = this.props

    const pendingInterval = get(autoscalingPolicyOverrideJson, [
      'proactive_storage',
      'forecast_window',
    ])

    return {
      flyoutOpen: false,
      pendingAutoscalingMax: autoscalingMax,
      pendingAutoscalingMaxNodeCount: 1,
      pendingAutoscalingMin: autoscalingMin,
      pendingAutoscalingMinNodeCount: 1,
      isEditingSize: false,
      pendingSize: isFinite(size) ? size : 0,
      pendingNodeCount: 1,
      pendingInterval: pendingInterval || '30 m',
    }
  }

  render() {
    const {
      size,
      autoscalingMax,
      buttonText,
      isLink,
      isMachineLearning,
      autoscalingMin,
      resource,
      maxSize,
      storageMultiplier,
      topologyElement,
      instanceConfiguration,
      isFrozen,
    } = this.props
    const { flyoutOpen } = this.state

    const textForButton = buttonText || (
      <EuiText size='s'>
        <FormattedMessage id='autoscaling-edit-settings.edit' defaultMessage='Edit settings' />
      </EuiText>
    )

    const showMachineLearningAutoscaleMinForSize =
      isMachineLearning && autoscalingMin! > 0 && (size === 0 || !isFinite(size))
    const showSize = (size > 0 && isFinite(size)) || showMachineLearningAutoscaleMinForSize

    const displayLimitReached = displayAutoscalingLimitReached({
      size,
      autoscalingMax,
      autoscalingMin,
      isMachineLearning,
    })

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='s'>
          {displayLimitReached && (
            <EuiFlexItem grow={false}>
              <EuiBetaBadge
                className='autoscaling-limit-reached'
                data-test-id='autoscaling-limit-reached'
                label={
                  <FormattedMessage
                    id='autoscaling-edit-settings.limit-reached'
                    defaultMessage='Limit Reached'
                  />
                }
                tooltipContent={
                  <FormattedMessage
                    id='autoscaling-edit-settings.limit-reached.tooltip'
                    defaultMessage='To continue experiencing optimal performance, we recommend increasing your maximum size per zone.'
                  />
                }
              />
            </EuiFlexItem>
          )}
          {showSize && (
            <EuiFlexItem style={{ justifyContent: 'center' }} grow={false}>
              <Summary
                instanceConfiguraton={instanceConfiguration}
                sliderInstanceType={instanceConfiguration.instance_type}
                topologyElement={topologyElement}
                size={size}
                resource={resource}
                storageMultiplier={storageMultiplier}
                zoneCount={1}
                maxSize={maxSize}
                isMachineLearning={isMachineLearning}
                autoscalingMin={autoscalingMin}
                isFrozen={isFrozen}
              />
            </EuiFlexItem>
          )}
          <EuiFlexItem>
            <EuiText size='s'>
              {isLink ? (
                <Fragment>
                  <EuiSpacer size='s' />
                  <EuiLink
                    color='primary'
                    data-test-subj='autoscalingEditSettings-openFlyoutButton'
                    onClick={() => this.setState({ flyoutOpen: !flyoutOpen })}
                  >
                    {textForButton}
                  </EuiLink>
                </Fragment>
              ) : (
                <EuiButtonEmpty
                  size='s'
                  onClick={() => this.setState({ flyoutOpen: !flyoutOpen })}
                  data-test-id='autoscalingEditSettings-openFlyoutButton'
                >
                  {textForButton}
                </EuiButtonEmpty>
              )}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>

        {flyoutOpen && this.renderFlyout()}
      </Fragment>
    )
  }

  renderFlyout() {
    const { name } = this.props

    return (
      <EuiFlyout
        onClose={this.onCancel}
        aria-labelledby='autoscalingSettings-flyoutTitle'
        ownFocus={true}
        size='m'
        maxWidth={500}
        data-test-id='autoscalingSettingsFlyout'
      >
        <EuiFlyoutHeader hasBorder={true}>
          <EuiTitle size='m'>
            <h2 id='autoscalingSettings-flyoutTitle'>
              <FormattedMessage
                id='autoscaling-edit-settings.flyout.title.autoscaling-settings'
                defaultMessage='Autoscaling settings'
              />
            </h2>
          </EuiTitle>
          {name && (
            <Fragment>
              <EuiSpacer size='s' />
              <EuiTitle size='xs'>
                <h3>{name}</h3>
              </EuiTitle>
            </Fragment>
          )}
        </EuiFlyoutHeader>

        {this.renderFlyoutBody()}
        {this.renderFlyoutFooter()}
      </EuiFlyout>
    )
  }

  renderFlyoutBody() {
    const { isMachineLearning, isHotTier } = this.props

    return (
      <EuiFlyoutBody>
        <div>
          <EuiTitle size='xxs'>
            <h5>
              <FormattedMessage
                id='autoscaling-edit-settings.how-it-works.title'
                defaultMessage='How does autoscaling work?'
              />
            </h5>
          </EuiTitle>
          <EuiText size='s' color='subdued'>
            <p>
              {isMachineLearning ? (
                <FormattedMessage
                  id='autoscaling-edit-settings.how-it-works.ml-description'
                  defaultMessage='By monitoring Machine Learning usage, we predict future capacity needs and scale RAM size automatically.'
                />
              ) : (
                <FormattedMessage
                  id='autoscaling-edit-settings.how-it-works.description'
                  defaultMessage='By monitoring the instance storage usage, we predict future capacity needs and scale up the storage size automatically.'
                />
              )}
            </p>
          </EuiText>
        </div>

        <EuiHorizontalRule />

        <div>
          <EuiTitle size='xs'>
            <h4>
              <FormattedMessage id='autoscaling-edit-settings.settings' defaultMessage='Settings' />
            </h4>
          </EuiTitle>

          <EuiSpacer />

          {isMachineLearning && this.renderAutoscalingMinEditor()}

          {this.renderAutoscalingMaxEditor()}

          {!isMachineLearning && this.renderSizeEditor()}

          {isHotTier && (
            <Fragment>
              <EuiSpacer />
              {this.renderAdvancedSettings()}
            </Fragment>
          )}
        </div>
      </EuiFlyoutBody>
    )
  }

  renderFlyoutFooter() {
    return (
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent='spaceBetween'>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              iconType='cross'
              onClick={this.onCancel}
              flush='left'
              data-test-id='autoscalingEdit-closeButton'
            >
              <FormattedMessage
                id='autoscaling-edit-settings.flyout.close'
                defaultMessage='Close'
              />
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              onClick={this.onSave}
              fill={true}
              data-test-id='autoscalingEdit-updateButton'
            >
              <FormattedMessage
                id='autoscaling-edit-settings.flyout.update'
                defaultMessage='Update'
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size='s' />

        <EuiText textAlign='right' color='subdued' size='s'>
          <FormattedMessage
            id='autoscaling-edit-settings.flyout.update-information'
            defaultMessage='You must click the save button on the main page for these changes to take effect.'
          />
        </EuiText>
      </EuiFlyoutFooter>
    )
  }

  renderAutoscalingMaxEditor() {
    const {
      intl: { formatMessage },
      isMachineLearning,
    } = this.props
    const {
      pendingAutoscalingMax,
      pendingAutoscalingMin,
      pendingAutoscalingMinNodeCount,
      pendingSize,
      pendingNodeCount,
    } = this.state

    const smallestAllowed = isMachineLearning
      ? pendingAutoscalingMin! * pendingAutoscalingMinNodeCount
      : pendingSize * pendingNodeCount

    const options = this.getSizeOptions({ smallestAllowed })

    return (
      <EuiFlexGroup gutterSize='s'>
        <EuiFlexItem style={{ maxWidth }}>
          <EuiFormRow
            label={formatMessage(messages.maxSizePerZone)}
            helpText={formatMessage(messages.maxSizePerZoneHelp)}
          >
            <EuiSuperSelect
              options={options}
              valueOfSelected={String(pendingAutoscalingMax)}
              onChange={(value) => this.onChangeAutoscalingMaxSize(value)}
              data-test-id='autoscalingEdit-autoscalingMaxSelect'
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderAutoscalingMinEditor() {
    const {
      intl: { formatMessage },
    } = this.props
    const { pendingAutoscalingMin, pendingAutoscalingMax, pendingAutoscalingMaxNodeCount } =
      this.state

    const options = this.getSizeOptions({
      largestAllowed: pendingAutoscalingMax * pendingAutoscalingMaxNodeCount,
    })

    return (
      <EuiFlexGroup gutterSize='s'>
        <EuiFlexItem style={{ maxWidth }}>
          <EuiFormRow
            label={formatMessage(messages.minSizePerZone)}
            helpText={formatMessage(messages.minSizePerZoneHelp)}
          >
            <EuiSuperSelect
              options={options}
              valueOfSelected={String(pendingAutoscalingMin)}
              onChange={(value) => this.onChangeAutoscalingMinSize(value)}
              data-test-id='autoscalingEdit-autoscalingMinSelect'
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderSizeEditor() {
    const {
      intl: { formatMessage },
      deploymentUnderEdit,
    } = this.props
    const {
      pendingSize,
      isEditingSize,
      pendingAutoscalingMax,
      pendingAutoscalingMaxNodeCount,
      pendingAutoscalingMin,
      pendingAutoscalingMinNodeCount,
    } = this.state

    const options = this.getSizeOptions({
      largestAllowed: pendingAutoscalingMax * pendingAutoscalingMaxNodeCount,
      smallestAllowed: pendingAutoscalingMin
        ? pendingAutoscalingMin * pendingAutoscalingMinNodeCount
        : undefined,
    })

    const isAlreadyCreated = Boolean(deploymentUnderEdit)

    return (
      <EuiFlexGroup gutterSize='s'>
        <EuiFlexItem style={{ maxWidth }}>
          <EuiFormRow
            label={
              isAlreadyCreated
                ? formatMessage(messages.currentSizePerZone)
                : formatMessage(messages.initialSizePerZone)
            }
            helpText={formatMessage(messages.currentSizePerZoneHelp)}
          >
            <EuiSuperSelect
              options={options}
              valueOfSelected={String(pendingSize)}
              onChange={(value) => this.onChangeSize(value)}
              data-test-id='autoscalingEdit-sizeSelect'
              disabled={!isEditingSize}
            />
          </EuiFormRow>
        </EuiFlexItem>

        {!isEditingSize && (
          <EuiFlexItem grow={false}>
            <div>
              <EuiSpacer size='xl' />
              <EuiButtonEmpty
                size='xs'
                onClick={() => this.setState({ isEditingSize: true })}
                data-test-id='autoscalingEdit-forceSize'
              >
                <FormattedMessage
                  id='autoscaling-edit-settings.edit-size'
                  defaultMessage='Force set size'
                />
              </EuiButtonEmpty>
            </div>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  renderAdvancedSettings() {
    const {
      intl: { formatMessage },
    } = this.props
    const { pendingInterval } = this.state

    const timeIntervals = [
      { value: `30 m`, text: formatMessage(messages.mins, { amount: 30 }) },
      { value: `1 h`, text: formatMessage(messages.hours, { amount: 1 }) },
      { value: `2 h`, text: formatMessage(messages.hours, { amount: 2 }) },
      { value: `3 h`, text: formatMessage(messages.hours, { amount: 3 }) },
      { value: `6 h`, text: formatMessage(messages.hours, { amount: 6 }) },
      { value: `12 h`, text: formatMessage(messages.hours, { amount: 12 }) },
      { value: `1 d`, text: formatMessage(messages.days, { amount: 1 }) },
    ]

    return (
      <EuiAccordion
        id='autoscaling-advanced'
        arrowDisplay='right'
        buttonContent={
          <EuiText size='s'>
            <FormattedMessage
              id='autoscaling-edit-settings.advanced-settings'
              defaultMessage='Advanced settings'
            />
          </EuiText>
        }
      >
        <Fragment>
          <EuiSpacer />
          <EuiFormRow
            label={formatMessage(messages.forecastWindow)}
            helpText={formatMessage(messages.forecastWindowHelp)}
          >
            <EuiSelect
              options={timeIntervals}
              value={pendingInterval}
              onChange={(e) => this.setState({ pendingInterval: e.target.value })}
            />
          </EuiFormRow>
        </Fragment>
      </EuiAccordion>
    )
  }

  getSizeOptions({
    smallestAllowed,
    largestAllowed,
  }: {
    smallestAllowed?: number
    largestAllowed?: number
  } = {}) {
    const {
      sizes,
      maxNodeCount,
      maxSize,
      minimumSizeForElement,
      size,
      isHotTier,
      isMachineLearning,
    } = this.props

    const calculatedSize = isFinite(size) ? size : 0

    // disable setting warm/cold/frozen nodes to 0 if already has size
    const disableRemoving = !isMachineLearning && !isHotTier
    let filteredSizes = disableRemoving && calculatedSize > 0 ? [...sizes] : [0, ...sizes]

    if (isNumber(minimumSizeForElement)) {
      filteredSizes = filteredSizes.filter((size) => size >= minimumSizeForElement)
    }

    if (isNumber(smallestAllowed)) {
      filteredSizes = filteredSizes.filter((size) => size >= smallestAllowed)
    }

    if (isNumber(largestAllowed)) {
      filteredSizes = filteredSizes.filter((size) => size <= largestAllowed)
    }

    const options = filteredSizes.map((value) => ({
      value: String(value),
      inputDisplay: this.getSizeOption({ size: value }),
    }))

    // Start at 2 because 1 instance is handled by the filteredSizes.map above
    for (let i = 2; i <= maxNodeCount; i++) {
      const value = maxSize * i

      if (
        (isNumber(largestAllowed) && value > largestAllowed) ||
        (isNumber(smallestAllowed) && value < smallestAllowed)
      ) {
        continue
      }

      options.push({
        value: String(value),
        inputDisplay: this.getSizeOption({ size: value }),
      })
    }

    return options
  }

  getSizeOption({ size }: { size: number }): JSX.Element {
    return <EuiText size='s'>{this.getSizeLabel(size)}</EuiText>
  }

  getSizeLabel(size?: number): string {
    const { resource, storageMultiplier, topologyElement, instanceConfiguration, isFrozen } =
      this.props
    const sliderInstanceType = instanceConfiguration.instance_type

    if (typeof size !== 'number') {
      return ``
    }

    const sliderNodeType = getSliderNodeTypeForTopologyElement({ topologyElement })
    const { primaryKey, secondaryKey } = getKeys({
      sliderNodeType,
      sliderInstanceType,
      instanceResource: resource,
      storageMultiplier,
    })

    return getSizeOptionText({
      instanceResource: resource,
      storageMultiplier,
      primaryKey,
      secondaryKey,
      value: size,
      isBlobStorage: isFrozen,
    })
  }

  onChangeAutoscalingMaxSize(value) {
    const { maxSize } = this.props

    if (value < maxSize) {
      this.setState({ pendingAutoscalingMaxNodeCount: 1 })
    }

    this.setState({ pendingAutoscalingMax: parseInt(value, 10) })
  }

  onChangeAutoscalingMinSize(value) {
    const { isMachineLearning, maxSize, size } = this.props
    const { pendingAutoscalingMinNodeCount } = this.state

    if (value < maxSize) {
      this.setState({ pendingAutoscalingMinNodeCount: 1 })
    }

    if (isMachineLearning) {
      if (value > size * pendingAutoscalingMinNodeCount) {
        this.onChangeSize(value)
      }
    }

    this.setState({ pendingAutoscalingMin: parseInt(value, 10) })
  }

  onChangeSize(value) {
    const { maxSize } = this.props

    if (value < maxSize) {
      this.setState({ pendingNodeCount: 1 })
    }

    this.setState({ pendingSize: parseInt(value, 10) })
  }

  onCancel = () => {
    this.setState(this.getInitialState())
  }

  onSave = () => {
    const {
      autoscalingMin,
      isHotTier,
      isMachineLearning,
      onChangeAutoscalingMax,
      onChangeAutoscalingMin,
      onChangeSize,
      onChangeIntervalPeriod,
    } = this.props
    const {
      pendingAutoscalingMax,
      pendingAutoscalingMaxNodeCount,
      pendingAutoscalingMin,
      pendingAutoscalingMinNodeCount,
      pendingInterval,
      pendingNodeCount,
      pendingSize,
    } = this.state

    if (typeof autoscalingMin === 'number') {
      onChangeAutoscalingMin(pendingAutoscalingMin! * pendingAutoscalingMinNodeCount)
    }

    onChangeAutoscalingMax(pendingAutoscalingMax * pendingAutoscalingMaxNodeCount)

    if (!isMachineLearning) {
      onChangeSize(pendingSize * pendingNodeCount)
    }

    if (isHotTier) {
      onChangeIntervalPeriod!({
        proactive_storage: {
          forecast_window: pendingInterval,
        },
      })
    }

    this.setState({ flyoutOpen: false })
  }
}

export default injectIntl(AutoscalingEditSettings)
