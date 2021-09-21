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
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLoadingSpinner,
  EuiTextColor,
  EuiToolTip,
} from '@elastic/eui'

import { getVersion } from '../../lib/stackDeployments/selectors'

import { StackDeployment } from '../../types'

type Props = {
  deploymentVersion: string
  ccsDeployment?: StackDeployment
  isIncompatible: boolean
}

const messages = defineMessages({
  incompatibleVersion: {
    id: `remote-deployment-version.remote-incompatible-version`,
    defaultMessage: `This deployment version is incompatible with v{version}, upgrade to include in search.`,
  },
})

const RemoteDeploymentVersion: FunctionComponent<Props & WrappedComponentProps> = ({
  intl: { formatMessage },
  deploymentVersion,
  ccsDeployment,
  isIncompatible,
}) => {
  if (!ccsDeployment) {
    return <EuiLoadingSpinner size='m' />
  }

  const versionText = `v${getVersion({ deployment: ccsDeployment })}`

  if (!isIncompatible) {
    return <span>{versionText}</span>
  }

  return (
    <EuiToolTip
      content={formatMessage(messages.incompatibleVersion, { version: deploymentVersion })}
    >
      <EuiFlexGroup gutterSize='s' alignItems='center'>
        <EuiFlexItem grow={false}>
          <EuiTextColor color='warning'>{versionText}</EuiTextColor>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiIcon type='alert' color='warning' />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiToolTip>
  )
}

export default injectIntl(RemoteDeploymentVersion)
