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

import { EuiButtonEmpty, EuiFlexItem, EuiFlexGroup } from '@elastic/eui'

import StackDeploymentAdminActionsDropdown from './StackDeploymentAdminActionsDropdown'

import { withSmallErrorBoundary } from '../../../cui'

import { getDeploymentResourceEndpoint } from '../../../lib/stackDeployments'

import { StackDeployment } from '../../../types'

type Props = {
  deployment: StackDeployment
  hideClusterInsteadOfDelete: boolean
  hideClusterInsteadOfStop: boolean
}

const StackDeploymentAdminActions: FunctionComponent<Props> = ({
  deployment,
  hideClusterInsteadOfDelete,
  hideClusterInsteadOfStop,
}) => {
  const launchKibanaButton = getKibanaButton({ deployment })

  return (
    <EuiFlexGroup
      gutterSize='m'
      responsive={false}
      className='deploymentOverview-managementControls fs-unmask'
    >
      <EuiFlexItem grow={false}>{launchKibanaButton}</EuiFlexItem>

      <EuiFlexItem grow={false}>
        <StackDeploymentAdminActionsDropdown
          deployment={deployment}
          hideClusterInsteadOfDelete={hideClusterInsteadOfDelete}
          hideClusterInsteadOfStop={hideClusterInsteadOfStop}
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

function getKibanaButton({ deployment }) {
  const {
    resources: { kibana },
  } = deployment

  if (!kibana || kibana.length === 0) {
    return null
  }

  const href = getDeploymentResourceEndpoint({ deployment, sliderInstanceType: `kibana` })

  return (
    <EuiButtonEmpty
      iconType='popout'
      target='_blank'
      iconSide='right'
      href={href}
      data-test-id='deployment-launch-kibana'
    >
      <FormattedMessage id='deployment-admin-actions.kibana' defaultMessage='Open Kibana' />
    </EuiButtonEmpty>
  )
}

export default withSmallErrorBoundary(StackDeploymentAdminActions)
