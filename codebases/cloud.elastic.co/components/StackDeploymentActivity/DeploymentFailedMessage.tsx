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

import { EuiFlexItem, EuiFlexGroup, EuiIcon, EuiText } from '@elastic/eui'

const DeploymentCompletedMessage: FunctionComponent = () => (
  <EuiFlexGroup justifyContent='center' alignItems='center'>
    <EuiFlexItem grow={false}>
      <EuiIcon color='danger' type='crossInACircleFilled' size='l' />
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiText size='s'>
        <p data-test-id='deployment-failed'>
          <FormattedMessage
            id='deployment-activity.deployment-failed'
            defaultMessage='Failed to create your deployment'
          />
        </p>
      </EuiText>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default DeploymentCompletedMessage
