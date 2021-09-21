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

import { find, some } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui'

import { withErrorBoundary } from '../../cui'

import { getHighestSeverity, Problem } from '../../lib/healthProblems'

type Props = { problems: Problem[] }

const StackDeploymentHealthProblemsTitle: FunctionComponent<Props> = ({ problems }) => {
  const spinner = some(problems, (problem) => problem.spinner)
  const highestSeverity = getHighestSeverity(problems)
  const problemCount = problems.length

  return (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      {spinner && (
        <EuiFlexItem grow={false}>
          <EuiLoadingSpinner size='m' />
        </EuiFlexItem>
      )}

      <EuiFlexItem grow={false}>{getTitle()}</EuiFlexItem>
    </EuiFlexGroup>
  )

  function getTitle() {
    const customTitleProblem = find(problems, (problem) => problem.title !== undefined)

    if (customTitleProblem) {
      return customTitleProblem.title!
    }

    if (highestSeverity === `danger`) {
      return (
        <FormattedMessage
          id='deployment-health-problems-title.deployment-unhealthy'
          defaultMessage='Unhealthy deployment'
        />
      )
    }

    if (highestSeverity === `warning`) {
      return (
        <FormattedMessage
          id='deployment-health-problems-title.deployment-warnings'
          defaultMessage='Deployment health {problemCount, plural, one {warning} other {warnings}}'
          values={{ problemCount }}
        />
      )
    }

    if (highestSeverity === `info`) {
      return (
        <FormattedMessage
          id='deployment-health-problems-title.deployment-notices'
          defaultMessage='Deployment health {problemCount, plural, one {notice} other {notices}}'
          values={{ problemCount }}
        />
      )
    }

    return (
      <FormattedMessage
        id='deployment-health-problems-title.healthy-deployment'
        defaultMessage='Healthy'
      />
    )
  }
}

export const DeploymentHealthProblemsSummary: FunctionComponent<Props> = ({ problems }) => {
  if (find(problems, { id: `deployment-hidden` })) {
    return (
      <FormattedMessage
        id='deployment-health-problems-summary.deployment-hidden'
        defaultMessage='Hidden'
      />
    )
  }

  if (find(problems, { id: `deployment-terminated` })) {
    return (
      <FormattedMessage
        id='deployment-health-problems-summary.deployment-terminated'
        defaultMessage='Terminated'
      />
    )
  }

  const customTitleProblem = find(problems, (problem) => problem.titleSummary !== undefined)

  if (customTitleProblem) {
    return customTitleProblem.titleSummary!
  }

  const highestSeverity = getHighestSeverity(problems)

  if (highestSeverity === `danger`) {
    return (
      <FormattedMessage
        id='deployment-health-problems-summary.deployment-unhealthy'
        defaultMessage='Unhealthy'
      />
    )
  }

  if (highestSeverity === `warning`) {
    return (
      <FormattedMessage
        id='deployment-health-problems-summary.deployment-warnings'
        defaultMessage='Healthy, with warnings'
      />
    )
  }

  if (highestSeverity === `info`) {
    return (
      <FormattedMessage
        id='deployment-health-problems-summary.deployment-notices'
        defaultMessage='Healthy, with notices'
      />
    )
  }

  return (
    <FormattedMessage
      id='deployment-health-problems-summary.healthy-deployment'
      defaultMessage='Healthy'
    />
  )
}

export default withErrorBoundary(StackDeploymentHealthProblemsTitle)
