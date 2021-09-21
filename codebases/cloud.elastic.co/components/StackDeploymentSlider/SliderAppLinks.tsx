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

import React, { FunctionComponent, Fragment } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer } from '@elastic/eui'

import ApmServerToken from './OverviewEnabled/ApmServerToken'

import ResourceExternalLinks from '../StackDeployments/ResourceExternalLinks'
import ApplicationLinks from '../StackDeployments/StackDeploymentApplicationLinks'

import { SliderInstanceType, StackDeployment, AnyResourceInfo } from '../../types'
import { ApmResourceInfo } from '../../lib/api/v1/types'

type Props = {
  deployment: StackDeployment
  resource: AnyResourceInfo
  sliderInstanceType: SliderInstanceType
  saasClusterMetrics?: boolean
}

const SliderAppLinks: FunctionComponent<Props> = ({ deployment, resource, sliderInstanceType }) => (
  <EuiFlexGroup gutterSize='l' alignItems='flexStart'>
    <EuiFlexItem grow={false}>
      <div>
        <ApplicationLinks deployment={deployment} show={sliderInstanceType} />

        {sliderInstanceType === 'apm' && (
          <Fragment>
            <EuiSpacer size='l' />

            <ApmServerToken deployment={deployment} resource={resource as ApmResourceInfo} />
          </Fragment>
        )}
      </div>
    </EuiFlexItem>

    <ResourceExternalLinks
      wrapWithFlexItem={true}
      sliderInstanceType={sliderInstanceType}
      resource={resource}
    />
  </EuiFlexGroup>
)

export default SliderAppLinks
