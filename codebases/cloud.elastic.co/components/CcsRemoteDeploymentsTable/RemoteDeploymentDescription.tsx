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
import { IntlShape, injectIntl } from 'react-intl'

import { EuiCode, EuiFlexGroup, EuiFlexItem, EuiTextColor } from '@elastic/eui'

import { CuiLink } from '../../cui'

import StackDeploymentStatus from '../StackDeploymentStatus'

import {
  describeTopology,
  getDeploymentTopologyInstances,
  getDisplayName,
} from '../../lib/stackDeployments'
import { getProductSliderTypesForStackDeployment } from '../../lib/sliders'

import { deploymentUrl } from '../../lib/urlBuilder'

import { RemoteResourceRef } from '../../lib/api/v1/types'
import { StackDeployment } from '../../types'

type Props = {
  intl: IntlShape
  remote: RemoteResourceRef
  ccsDeployment: StackDeployment
}

const RemoteDeploymentDescription: FunctionComponent<Props> = ({
  intl: { formatMessage },
  remote,
  ccsDeployment,
}) => {
  const name = getRemoteName({ remote, ccsDeployment })
  const summary = getSummary({ ccsDeployment, formatMessage })

  return (
    <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        <StackDeploymentStatus deployment={ccsDeployment} />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <h4>
          {ccsDeployment ? (
            <CuiLink to={deploymentUrl(ccsDeployment.id)}>{name}</CuiLink>
          ) : (
            <EuiCode>{name}</EuiCode>
          )}
        </h4>

        {summary && (
          <div>
            <EuiTextColor color='subdued'>{summary}</EuiTextColor>
          </div>
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export function getRemoteName({
  remote,
  ccsDeployment,
}: {
  remote: RemoteResourceRef
  ccsDeployment?: StackDeployment
}): string {
  if (!ccsDeployment) {
    return remote.deployment_id.slice(0, 8)
  }

  return getDisplayName({ deployment: ccsDeployment })
}

function getSummary({
  formatMessage,
  ccsDeployment,
}: {
  formatMessage: IntlShape['formatMessage']
  ccsDeployment?: StackDeployment
}): string | null {
  if (!ccsDeployment) {
    return null
  }

  const topologyDescriptions = getProductSliderTypesForStackDeployment(ccsDeployment).map(
    ({ sliderInstanceType }) => {
      const instanceSummaries = getDeploymentTopologyInstances({
        deployment: ccsDeployment,
        sliderInstanceType,
      })

      return describeTopology({ instanceSummaries, formatMessage })
    },
  )

  return topologyDescriptions.join(`, `)
}

export default injectIntl(RemoteDeploymentDescription)
