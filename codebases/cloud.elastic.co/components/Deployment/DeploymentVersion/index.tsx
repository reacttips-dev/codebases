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

import React from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiFormLabel } from '@elastic/eui'

import UpgradableDeploymentVersion from './UpgradableDeploymentVersion'

import Permission from '../../../lib/api/v1/permissions'
import { isPermitted } from '../../../lib/requiresPermission'
import { StackDeployment } from '../../../types'
import { getVersion } from '../../../lib/stackDeployments'

function DeploymentVersion({ deployment }: { deployment: StackDeployment }) {
  if (isPermitted(Permission.updateDeployment)) {
    return <UpgradableDeploymentVersion deployment={deployment} />
  }

  const version = getVersion({ deployment })

  // The <UpgradableDeploymentVersion> component requires permissions for
  // fetching various things, so instead just render a plain version.
  return (
    <EuiFlexGroup
      gutterSize='m'
      justifyContent='flexStart'
      data-test-id='deployment-version-readonly'
    >
      <EuiFlexItem>
        <EuiSpacer size='s' />
        <EuiFormLabel>
          <FormattedMessage
            id='deployment-version.readonly-label'
            defaultMessage='Deployment version'
          />
        </EuiFormLabel>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiFlexGroup alignItems='center' gutterSize='xs' justifyContent='flexStart'>
          <EuiFlexItem grow={false}>{`v${version}`}</EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default DeploymentVersion
