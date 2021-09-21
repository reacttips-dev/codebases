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

import { EuiFlexItem, EuiFlexGroup, EuiText, EuiBadge } from '@elastic/eui'

import { Deployment } from '../../../../../lib/api/v1/types'

import messages from './messages'

type Props = {
  deployment: Deployment
  outOfComplianceFeatures: { [key: string]: any }
}

const DeploymentUsage: FunctionComponent<Props> = ({ deployment, outOfComplianceFeatures }) => {
  const { id, name } = deployment
  const shortId = id.substr(0, 6)
  const numberOfChanges = Object.values(outOfComplianceFeatures).reduce(
    (sum: number, level: string) => sum + level.length,
    0,
  )
  return (
    <div>
      <EuiFlexGroup responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiBadge>{shortId}</EuiBadge>
        </EuiFlexItem>
        {name && (
          <EuiFlexItem grow={false}>
            <EuiText>{name}</EuiText>
          </EuiFlexItem>
        )}
        <EuiFlexItem grow={false}>
          <EuiBadge color='hollow'>
            <FormattedMessage
              {...messages.changes}
              values={{
                numberOfChanges,
              }}
            />
          </EuiBadge>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  )
}

export default DeploymentUsage
