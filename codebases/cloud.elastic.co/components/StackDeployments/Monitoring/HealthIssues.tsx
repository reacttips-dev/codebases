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

import React, { Fragment } from 'react'

import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiSpacer,
  EuiText,
  htmlIdGenerator,
} from '@elastic/eui'

import { StackDeployment } from '../../../types'

export type Props = {
  deployment: StackDeployment
}

type IssueItem = {
  severity: 'warning' | 'danger'
  description: string
}

type Issues = [IssueItem]

const HealthIssues = ({ deployment }) => {
  if (deployment.observability && deployment.observability?.healthy) {
    return null
  }

  const healthIssues: Issues = deployment.observability?.issues || []

  if (healthIssues.length <= 0) {
    return null
  }

  const healthIssueList = healthIssues.map((issue) => {
    const iconType = issue.severity === 'danger' ? 'alert' : 'help'

    return (
      <div key={htmlIdGenerator()()}>
        <EuiFlexGroup
          data-test-id='health-issues-callout'
          alignItems='center'
          gutterSize='s'
          responsive={false}
        >
          <EuiFlexItem grow={false}>
            <EuiIcon data-test-id='health-issues-icon' size='s' type={iconType} />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiText data-test-id='health-issues-description' size='s'>
              {issue.description}
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size='s' />
      </div>
    )
  })

  const isHealthInDanger = healthIssues.find((issues) => issues.severity === 'danger')
    ? 'danger'
    : 'warning'

  return (
    <Fragment>
      <EuiCallOut
        key={htmlIdGenerator()()}
        data-test-id='health-issues'
        title='Health Issues'
        color={isHealthInDanger}
      >
        {healthIssueList}
      </EuiCallOut>

      <EuiSpacer size='m' />
    </Fragment>
  )
}

export default HealthIssues
