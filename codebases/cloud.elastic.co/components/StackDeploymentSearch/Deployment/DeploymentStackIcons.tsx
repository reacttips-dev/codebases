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

import React, { FunctionComponent } from 'react'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiIconTip } from '@elastic/eui'

import { CuiSliderLogo } from '../../../cui'

import {
  isPremium,
  isSystemOwned,
  getDeploymentProductSliderTypes,
  getVersion,
} from '../../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

const messages = defineMessages({
  systemOwned: {
    id: `deployment-cards.title.system-owned`,
    defaultMessage: `System deployment`,
  },
  premium: {
    id: `deployment-cards.title.premium`,
    defaultMessage: `Premium customer`,
  },
})

type Props = WrappedComponentProps & {
  deployment: DeploymentSearchResponse
}

const DeploymentStackIcons: FunctionComponent<Props> = (props) => {
  const {
    intl: { formatMessage },
    deployment,
  } = props

  const premium = isPremium({ deployment })
  const systemOwned = isSystemOwned({ deployment })
  const version = getVersion({ deployment })

  return (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      {premium && (
        <EuiFlexItem grow={false} data-test-id='premium-icon'>
          <EuiIconTip
            aria-label={formatMessage(messages.premium)}
            content={formatMessage(messages.premium)}
            type='starFilled'
            color='primary'
          />
        </EuiFlexItem>
      )}

      {systemOwned && (
        <EuiFlexItem grow={false} data-test-id='system-owned-icon'>
          <EuiIconTip
            aria-label={formatMessage(messages.systemOwned)}
            content={formatMessage(messages.systemOwned)}
            type='logoCloud'
          />
        </EuiFlexItem>
      )}

      {getDeploymentProductSliderTypes({ deployment }).map((sliderType, i) => (
        <EuiFlexItem
          grow={false}
          key={`${sliderType.sliderInstanceType}_${i}`}
          data-test-id='slider-icon'
        >
          <CuiSliderLogo {...sliderType} showTooltip={true} version={version} />
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  )
}

export default injectIntl(DeploymentStackIcons)
