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

import { EuiText, EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui'

import {
  getPlatform,
  PlatformId,
  getPlatformInfoById,
  PlatformInfo,
} from '../../../../../lib/platform'
import { getRegionDisplayName } from '../../../../../lib/region'

import { Region } from '../../../../../types'
import { DeploymentTemplateInfoV2 } from '../../../../../lib/api/v1/types'
import { RegionState } from '../../../../../reducers/providers'

import './advancedSettings.scss'

export type Props = {
  region: Region
  version: string | null
  getRegionsByProvider: (provider: string) => RegionState[] | null
  availablePlatforms: PlatformId[]
  deploymentTemplate?: DeploymentTemplateInfoV2
}

class AdvancedSettingsAccordionButton extends Component<Props> {
  render() {
    const { version } = this.props

    if (!version) {
      return null
    }

    const { availablePlatforms, region } = this.props

    const platform = getPlatform(region.id)
    const selectedPlatformInfo = availablePlatforms
      .map((key) => getPlatformInfoById(key))
      .find((provider) => provider.id === platform)

    return (
      <EuiFlexGroup className='advanced-settings-button' gutterSize='s' responsive={false}>
        {selectedPlatformInfo && this.renderProviderIcon(selectedPlatformInfo)}
        <EuiFlexItem className='advanced-settings-button-content' grow={false}>
          <EuiFlexGroup
            className='advanced-settings-summary'
            gutterSize='none'
            direction='column'
            responsive={false}
          >
            <EuiFlexItem>
              <EuiFlexGroup gutterSize='xs'>
                {this.renderProvider(selectedPlatformInfo)}
                {this.renderRegion()}
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize='xs'>
                {this.renderHardwareProfile()}
                <EuiFlexItem grow={false}>
                  <EuiText size='s' color='subdued'>
                    {version}
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderProviderIcon(selectedPlatformInfo: PlatformInfo) {
    return (
      <EuiFlexItem
        className='advanced-settings-button-platform-icon'
        style={{ justifyContent: 'center' }}
        grow={false}
      >
        <EuiIcon
          type={selectedPlatformInfo.iconType}
          aria-label={selectedPlatformInfo.title}
          color='text'
          size='xxl'
        />
      </EuiFlexItem>
    )
  }

  renderProvider(selectedPlatformInfo) {
    if (!selectedPlatformInfo) {
      return null
    }

    return (
      <EuiFlexItem grow={false}>
        <EuiText size='s'>{selectedPlatformInfo.shortTitle}</EuiText>
      </EuiFlexItem>
    )
  }

  renderRegion() {
    const { region, getRegionsByProvider } = this.props

    const platform = getPlatform(region.id)
    const availableRegions = getRegionsByProvider(platform)

    if (!availableRegions) {
      return null
    }

    const displayRegion = availableRegions.find(
      (availableRegion) => availableRegion.identifier === region.id,
    )

    if (!displayRegion) {
      return null
    }

    const displayName = getRegionDisplayName({ region: displayRegion, hideFlagEmoji: true })

    return (
      <EuiFlexItem grow={false}>
        <EuiText size='s'>{displayName}</EuiText>
      </EuiFlexItem>
    )
  }

  renderHardwareProfile() {
    const { deploymentTemplate } = this.props

    if (!deploymentTemplate) {
      return null
    }

    return (
      <EuiFlexItem data-test-id='advanced-settings-hardware-profile' grow={false}>
        <EuiText size='s' color='subdued'>
          {deploymentTemplate.name},
        </EuiText>
      </EuiFlexItem>
    )
  }
}

export default AdvancedSettingsAccordionButton
