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
import { FormattedMessage } from 'react-intl'
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiIcon,
  EuiSuperSelect,
  EuiFormControlLayout,
  EuiFormLabel,
  EuiToolTip,
} from '@elastic/eui'

import { withErrorBoundary } from '../../../../../cui'

import { getPlatformInfoById, PlatformId, PlatformInfo } from '../../../../../lib/platform'

import './selectCloudPlatform.scss'

type Props = {
  platform: PlatformId
  availablePlatforms: PlatformId[]
  onChange: (platform: string) => void
  restoreFromSnapshot: boolean
  disabled?: boolean
}

class SelectCloudPlatform extends Component<Props> {
  render() {
    const { restoreFromSnapshot } = this.props

    return (
      <EuiFormControlLayout
        fullWidth={true}
        prepend={
          <EuiFormLabel style={{ width: `180px` }}>
            <FormattedMessage defaultMessage='Cloud provider' id='select-platform-label' />
          </EuiFormLabel>
        }
      >
        {restoreFromSnapshot ? (
          <EuiToolTip
            anchorClassName='cloud-provider-disabled-tooltip'
            position='top'
            content={
              <FormattedMessage
                defaultMessage='You cannot change the cloud provider as you are restoring data from a snapshot.'
                id='select-cloud-provider-disabled-tooltip'
              />
            }
          >
            {this.renderCloudPlatforms()}
          </EuiToolTip>
        ) : (
          this.renderCloudPlatforms()
        )}
      </EuiFormControlLayout>
    )
  }

  renderCloudPlatforms() {
    const { platform, availablePlatforms, onChange, disabled, restoreFromSnapshot } = this.props

    const platformOptions =
      availablePlatforms &&
      availablePlatforms
        .map((key) => getPlatformInfoById(key))
        .map((platform) => ({
          inputDisplay: this.renderPlatformOption(platform),
          value: platform.id,
          'data-test-id': `cloud-platform-${platform.id}`,
        }))

    return (
      <EuiSuperSelect
        fullWidth={true}
        options={platformOptions}
        valueOfSelected={platform}
        onChange={(platform) => onChange(platform)}
        disabled={restoreFromSnapshot || disabled}
        data-test-id='platform-combobox'
      />
    )
  }

  renderPlatformOption(platform: PlatformInfo) {
    return (
      <EuiFlexGroup
        className='platform-option'
        data-test-id={`cloud-platform-option-${platform.id}`}
        gutterSize='s'
        alignItems='center'
        responsive={false}
      >
        <EuiFlexItem className='platform-icon' grow={false}>
          <EuiIcon size='m' type={platform.iconType} />
        </EuiFlexItem>

        <EuiFlexItem className='platform-name'>
          <EuiText style={{ paddingLeft: 0 }} size='s'>
            {platform.title}
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }
}

export default withErrorBoundary(SelectCloudPlatform)
