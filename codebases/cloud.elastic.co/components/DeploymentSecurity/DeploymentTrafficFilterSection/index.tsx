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

import { EuiHorizontalRule } from '@elastic/eui'

import DeploymentTrafficFilterRulesets from '../DeploymentTrafficFilterRulesets'
import DeploymentIpFilterRulesets from '../DeploymentIpFilterRulesets'

type Props = {
  regionId: string
  deploymentId: string
  isIpFilteringEnabled: boolean
  trafficFilteringEnabled: boolean
  spacerBefore: boolean
}

const DeploymentTrafficFilterSection: FunctionComponent<Props> = ({
  regionId,
  deploymentId,
  isIpFilteringEnabled,
  trafficFilteringEnabled,
  spacerBefore,
}) => {
  if (trafficFilteringEnabled) {
    return (
      <Fragment>
        {spacerBefore && <EuiHorizontalRule />}

        <DeploymentTrafficFilterRulesets regionId={regionId} />
      </Fragment>
    )
  }

  if (isIpFilteringEnabled) {
    return (
      <Fragment>
        {spacerBefore && <EuiHorizontalRule />}

        <DeploymentIpFilterRulesets regionId={regionId} deploymentId={deploymentId} />
      </Fragment>
    )
  }

  return null
}

export default DeploymentTrafficFilterSection
