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

import { difference, maxBy, orderBy, partition } from 'lodash'
import React, { ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { IconType } from '@elastic/eui'

type EuiColor = 'danger' | 'warning' | 'primary'

export type EuiHealthColor = 'danger' | 'warning' | 'success' | 'subdued'

export type SeverityLevel = 'danger' | 'warning' | 'info'

type SeverityWeight = 3 | 2 | 1
type SeverityWeightStrings = '3' | '2' | '1'

type SeverityWeightMap = { [key in SeverityLevel]: SeverityWeight }

type SeverityByWeightMap = { [key in SeverityWeightStrings]: SeverityLevel }

const severityWeight: SeverityWeightMap = {
  danger: 3 as const,
  warning: 2 as const,
  info: 1 as const,
}

const severityByWeight: SeverityByWeightMap = {
  3: `danger`,
  2: `warning`,
  1: `info`,
}

export type Problem = {
  id: string
  kind: string
  level: SeverityLevel
  title?: ReactElement
  titleSummary?: ReactElement
  message: ReactNode
  helpText?: ReactNode
  iconType?: IconType
  hidden?: boolean
  spinner?: boolean
  tooltip?: ReactNode
  dismissible?: boolean
  dismissGroup?: string

  /* some problems might not be most severe,
   * but they might be the most important
   * e.g.: "Your deployment can't be changed because we're working on it"
   *
   * the `sticky` flag lets us pop those kinds of notices to the top of the list
   * the `stickyLast` flag lets us pop those kinds of notices to the bottom of the list
   */
  sticky?: boolean
  stickyLast?: boolean

  _meta?: {
    instances?: string[]
  }

  'data-test-id'?: string
}

export type PreparedProblems = Problem[][]

function isSticky(problem: Problem): boolean {
  return Boolean(problem.sticky)
}

function isStickyLast(problem: Problem): boolean {
  return Boolean(problem.stickyLast)
}

function getSeverityWeight(problem: { level: SeverityLevel }): SeverityWeight {
  return severityWeight[problem.level] || severityWeight.info
}

export function prepareProblems(problems: Problem[]): PreparedProblems {
  const [dismissedProblems, visibleProblems] = partition(problems, isDismissedProblem)

  return [sortProblems(visibleProblems), sortProblems(dismissedProblems)]
}

export function isDismissedProblem(problem: Problem): boolean {
  if (!problem.dismissible) {
    return false
  }

  const dismissedProblems = getDismissedProblems()
  const dismissId = problem.dismissGroup || problem.id

  return dismissedProblems.includes(dismissId)
}

export function dismissProblem(problem: Problem) {
  if (!problem.dismissible) {
    return
  }

  const dismissedProblems = getDismissedProblems()
  const dismissId = problem.dismissGroup || problem.id

  setDismissedProblems([...dismissedProblems, dismissId])
}

export function resetProblemDismissions(problems: Problem[]) {
  const dismissedProblems = getDismissedProblems()
  const dismissIds = problems.map((problem) => problem.dismissGroup || problem.id)

  setDismissedProblems(difference(dismissedProblems, dismissIds))
}

function getDismissedProblems(): string[] {
  try {
    const raw = localStorage.getItem(`DISMISSED_HEALTH_PROBLEMS`)

    if (!raw) {
      return []
    }

    const problemIds = JSON.parse(raw)
    return problemIds
  } catch (e) {
    return []
  }
}

function setDismissedProblems(problemIds: string[] | null) {
  const json = JSON.stringify(problemIds)
  localStorage.setItem(`DISMISSED_HEALTH_PROBLEMS`, json)
}

function sortProblems(problems: Problem[]): Problem[] {
  /* - Sticky are the most important, even if they're not the most severe
  /* - StickyLast want the bottom spots, even if they're not the least severe
   * - Next we look at severity and sort based on that
   */
  const sortedProblems = orderBy<Problem>(
    problems,
    [isSticky, isStickyLast, getSeverityWeight],
    [`desc`, `asc`, `desc`],
  )

  return sortedProblems
}

export function getHighestSeverity(
  problems: Array<{ level: SeverityLevel }>,
): SeverityLevel | null {
  if (problems.length === 0) {
    return null
  }

  const highestSeverityWeight = maxBy(problems.map(getSeverityWeight))!
  const severity = severityByWeight[highestSeverityWeight] || null
  return severity as SeverityLevel | null
}

export function getEuiColor(problems: Array<{ level: SeverityLevel }>): EuiColor {
  const severity = getHighestSeverity(problems)!

  if (severity === `info`) {
    return `primary`
  }

  return severity
}

export function getProblemIcon(problem: Problem): IconType {
  if (problem.iconType) {
    return problem.iconType
  }

  if (problem.sticky) {
    return `pin`
  }

  if (problem.level === `danger`) {
    return `cross`
  }

  if (problem.level === `warning`) {
    return `wrench`
  }

  if (problem.level === `info`) {
    return `plusInCircle`
  }

  return `empty`
}

export function getEuiHealthColor(problems: Problem[]): EuiHealthColor {
  const severity = getHighestSeverity(problems)

  if (severity === null) {
    return `success`
  }

  if (severity === `info`) {
    return `subdued`
  }

  return severity
}

export function formatSeverityLevels(problems: Problem[]): ReactElement {
  const severity = getHighestSeverity(problems)

  if (severity === `danger`) {
    if (problems.length === 1) {
      return <FormattedMessage id='health-problems.danger-severity-level' defaultMessage='alert' />
    }

    return (
      <FormattedMessage id='health-problems.danger-severity-level-many' defaultMessage='alerts' />
    )
  }

  if (severity === `warning`) {
    if (problems.length === 1) {
      return (
        <FormattedMessage id='health-problems.warning-severity-level' defaultMessage='warning' />
      )
    }

    return (
      <FormattedMessage
        id='health-problems.warning-severity-level-many'
        defaultMessage='warnings'
      />
    )
  }

  if (problems.length === 1) {
    return <FormattedMessage id='health-problems.info-severity-level' defaultMessage='notice' />
  }

  return <FormattedMessage id='health-problems.info-severity-level-many' defaultMessage='notices' />
}
