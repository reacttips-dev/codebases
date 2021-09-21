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
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiText, EuiSpacer } from '@elastic/eui'

import { CuiButton, CuiPermissibleControl } from '../../../cui'

import ResourceExternalLinks from '../../StackDeployments/ResourceExternalLinks'

import { getSliderPrettyName } from '../../../lib/sliders'
import history from '../../../lib/history'
import Permission from '../../../lib/api/v1/permissions'

import { AnyResourceInfo, SliderInstanceType } from '../../../types'
import { getResourceVersion } from '../../../lib/stackDeployments'

type Props = {
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  editUrl: string
}

const OverviewDisabled: FunctionComponent<Props> = ({ resource, sliderInstanceType, editUrl }) => (
  <EuiFlexGroup gutterSize='l' alignItems='flexStart' justifyContent='spaceBetween'>
    <EuiFlexItem grow={false}>
      <div>
        <EuiText>
          <p data-test-id='slider-is-disabled'>
            <FormattedMessage
              id='slider-overview.disabled-message'
              defaultMessage='{name} is not running on this deployment.'
              values={{
                name: (
                  <FormattedMessage
                    {...getSliderPrettyName({
                      sliderInstanceType,
                      version: getResourceVersion({ resource }),
                    })}
                  />
                ),
              }}
            />
          </p>
        </EuiText>

        <EuiSpacer />

        <CuiPermissibleControl
          // This case is little odd because the button just navigates
          // to another page, but there's no point doing that if you can't
          // perform the actions on the next page.
          permissions={Permission.updateDeployment}
        >
          <CuiButton color='primary' fill={true} onClick={() => history.push(editUrl)}>
            <FormattedMessage
              id='slider-overview.update-settings'
              defaultMessage='Edit deployment'
            />
          </CuiButton>
        </CuiPermissibleControl>
      </div>
    </EuiFlexItem>

    <ResourceExternalLinks
      wrapWithFlexItem={true}
      sliderInstanceType={sliderInstanceType}
      resource={resource}
    />
  </EuiFlexGroup>
)

export default OverviewDisabled
