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

import {
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiHighlight,
  EuiLoadingContent,
} from '@elastic/eui'

import { CuiLink } from '../Link'

import { deploymentUrl } from '../../lib/urlBuilder'

import { StackDeployment } from '../../types'

type Props = {
  className?: string
  deployment?: StackDeployment | null
  highlight?: string
  linkify?: boolean
  showHealth?: boolean
}

export const CuiDeploymentName: FunctionComponent<Props> = ({
  className,
  deployment,
  highlight = ``,
  linkify = true,
  showHealth = true,
}) => {
  if (!deployment) {
    return <EuiLoadingContent lines={1} />
  }

  const { id, name } = deployment

  // @ts-ignore TS doesn't understand but we're ok that it might not be a thing
  const displayName: string | undefined = name
  const displayId = id.slice(0, 6)

  const deploymentName = (
    <EuiFlexGroup gutterSize='s' alignItems='center' data-test-id='deployment-name'>
      <EuiFlexItem grow={false}>
        <EuiCode>{displayId}</EuiCode>
      </EuiFlexItem>

      {displayName && (
        <EuiFlexItem grow={false}>
          <EuiHighlight search={highlight}>{displayName}</EuiHighlight>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  )

  const deploymentNameLinked = linkify ? (
    <CuiLink to={deploymentUrl(deployment.id)}>{deploymentName}</CuiLink>
  ) : (
    deploymentName
  )

  const deploymentNameClassed = <span className={className}>{deploymentNameLinked}</span>
  const deploymentHealthColor = deployment.healthy ? 'success' : 'danger'

  const deploymentNameHealth = showHealth ? (
    <EuiHealth color={deploymentHealthColor}>{deploymentNameClassed}</EuiHealth>
  ) : (
    deploymentNameClassed
  )

  return deploymentNameHealth
}
