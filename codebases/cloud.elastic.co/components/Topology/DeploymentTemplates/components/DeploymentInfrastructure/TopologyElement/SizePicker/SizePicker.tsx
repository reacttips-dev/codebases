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

import React, { Component } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { max, range } from 'lodash'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import RadioLegend from './RadioLegend'
import CpuPopover from './CpuPopover'
import FrozenSizingPopover from './FrozenSizingPopover'
import DiscreteSizePicker from '../../../../../../DiscreteSizePicker'

import { isHeroku } from '../../../../../../../lib/heroku'
import { getSliderTrialLimit } from '../../../../../../../lib/sliders'

import { getKeys, getNumber, getSizeOptionText, getRenderOptions } from '../helpers'

import { NormalizeSizingProps } from '../NormalizeSizing'

import { SliderNodeType, SliderInstanceType, AnyTopologyElement } from '../../../../../../../types'
import { getSliderNodeTypeForTopologyElement } from '../../../../../../../lib/stackDeployments'

type EuiRangeLevel = {
  color: 'primary' | 'success' | 'warning' | 'danger'
  max: number
  min: number
}

export interface Props extends NormalizeSizingProps {
  disabled?: boolean
  sliderInstanceType: SliderInstanceType
  sliderNodeTypes?: SliderNodeType[]
  inTrial: boolean
  showTrialThreshold: boolean
  maxInstanceCount: number
  isBlobStorage: boolean
  topologyElement: AnyTopologyElement
}

type CombinedProps = Props & WrappedComponentProps

type State = {
  isCpuPopoverOpen: boolean
}

class SizePicker extends Component<CombinedProps, State> {
  state = {
    isCpuPopoverOpen: false,
  }

  render() {
    const {
      size,
      resource: instanceResource,
      storageMultiplier,
      disabled = false,
      onChangeSize,
      isBlobStorage,
      cpuMultiplier,
      sliderInstanceType,
      topologyElement,
    } = this.props
    const sliderNodeType = getSliderNodeTypeForTopologyElement({ topologyElement })
    const { primaryKey, secondaryKey } = getKeys({
      instanceResource,
      storageMultiplier,
      sliderInstanceType,
      sliderNodeType,
    })
    const options = this.getOptions()
    // We will keep this around until the slider in the override instance size modal changed for a drop-down
    const radioLegend = <RadioLegend primaryKey={primaryKey} secondaryKey={secondaryKey} />

    return (
      <EuiFlexGroup>
        <EuiFlexItem style={{ flexDirection: 'row', alignItems: 'center' }} grow={false}>
          <DiscreteSizePicker
            className='deploymentInfrastructure-topologyElement-sizePicker'
            data-test-id='topologyElement-sizeSlider'
            value={size ? size.toString() : ``}
            onChange={(value) => onChangeSize(parseInt(value, 10))}
            options={options}
            radioLegend={radioLegend}
            disabled={disabled || isHeroku()}
            {...this.getTrialProps()}
          />
          {cpuMultiplier && (
            <CpuPopover
              isOpen={this.state.isCpuPopoverOpen}
              onClick={() => this.setState({ isCpuPopoverOpen: !this.state.isCpuPopoverOpen })}
              onClose={() => this.setState({ isCpuPopoverOpen: false })}
            />
          )}
        </EuiFlexItem>
        {isBlobStorage && (
          <EuiFlexItem grow={false} style={{ marginLeft: 0 }}>
            <FrozenSizingPopover
              primaryKey={primaryKey}
              instanceResource={instanceResource}
              storageMultiplier={storageMultiplier}
              size={size}
            />
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  getOptions() {
    const {
      inTrial,
      sliderInstanceType,
      sliderNodeTypes,
      showTrialThreshold,
      sizes,
      maxInstanceCount,
      resource: instanceResource,
      storageMultiplier,
      size,
      isBlobStorage,
      cpuMultiplier,
      topologyElement,
    } = this.props

    const trialLimit = getSliderTrialLimit({
      inTrial,
      sliderInstanceType,
      sliderNodeTypes,
    })
    const sliderNodeType = getSliderNodeTypeForTopologyElement({ topologyElement })
    const { primaryKey, secondaryKey } = getKeys({
      sliderInstanceType,
      instanceResource,
      storageMultiplier,
      sliderNodeType,
    })
    const maxSizeValue = max(sizes)
    const possibleNumberOfNodes = maxInstanceCount > 1 ? range(2, maxInstanceCount + 1) : []
    const multiNodeOptions =
      maxSizeValue && possibleNumberOfNodes.length > 0
        ? possibleNumberOfNodes.map((value) => value * maxSizeValue)
        : [] // The API only returns the size per 1 node, not the the total sizes if a user needs more than 1 node per instance
    const combinedOptions = sizes.concat(multiNodeOptions) // Combining the sizes returned by the API and the calculated sizes based on number of nodes
    // It's possible for ECE users to create deployments via the API that don't conform to the sizing set forth in the UI
    // In this case, we need to ensure the UI doesn't break and we display the accurate sizing.
    const currentOptionExists = combinedOptions.find((option) => option === size)

    if (!currentOptionExists) {
      combinedOptions.push(size)
    }

    return combinedOptions.map((value) => {
      const disabled =
        trialLimit && !showTrialThreshold // disable unless we're adding extra info about trial limits
          ? getNumber({
              instanceResource,
              storageMultiplier,
              totalSize: value,
              resourceType: `memory`,
            }) > trialLimit.memorySize
          : false

      return {
        text: getSizeOptionText({
          instanceResource,
          storageMultiplier,
          cpuMultiplier,
          value,
          primaryKey,
          secondaryKey,
          isBlobStorage,
        }),
        mobileText: getSizeOptionText({
          instanceResource,
          storageMultiplier,
          value,
          primaryKey,
          secondaryKey,
          isBlobStorage,
        }), // TODO: determine what mobile text should be
        value: value.toString(),
        disabled,
        ...getRenderOptions({
          instanceResource,
          storageMultiplier,
          cpuMultiplier,
          value,
          primaryKey,
          secondaryKey,
          isBlobStorage,
        }),
      }
    })
  }

  getTrialProps() {
    const { sizes, inTrial, showTrialThreshold, sliderInstanceType, sliderNodeTypes } = this.props

    if (!inTrial || !showTrialThreshold) {
      return {}
    }

    const trialThreshold = getSliderTrialLimit({
      inTrial,
      sliderInstanceType,
      sliderNodeTypes,
    })

    const trialLimitIndex = trialThreshold
      ? sizes.findIndex((element) => element === trialThreshold?.memorySize)
      : -1

    const levels: EuiRangeLevel[] = [
      {
        min: 0,
        max: trialLimitIndex === 0 ? 0.2 : trialLimitIndex,
        color: 'primary',
      },
      {
        min: trialLimitIndex,
        max: sizes.length - 1,
        color: 'success',
      },
    ]

    return {
      levels,
      trialLimitIndex,
      trialThreshold,
      showTrialThreshold,
    }
  }
}

export default injectIntl(SizePicker)
