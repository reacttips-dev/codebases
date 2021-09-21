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

import { isEmpty } from 'lodash'
import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiIcon,
  EuiLink,
  EuiToolTip,
} from '@elastic/eui'

import { formatSeverityLevels, getProblemIcon, Problem } from './problems'
import HealthProblemListDismissed from './HealthProblemListDismissed'

type Props = {
  problems: Problem[]
  dismissedProblems?: Problem[]
  dismissProblem?: (problem: Problem) => void
  resetProblemDismissions?: (problems: Problem[]) => void
  hideHelpText?: boolean
}

const HealthProblemList: FunctionComponent<Props> = ({
  problems,
  dismissedProblems = [],
  dismissProblem,
  resetProblemDismissions,
  hideHelpText,
}) => (
  <Fragment>
    {problems
      .filter((problem) => problem.hidden !== true)
      .map((problem) => {
        const problemMessage = <span data-test-id='problem-message'>{problem.message}</span>
        const problemWithToolTip = problem.tooltip ? (
          <EuiToolTip
            className='euiToolTip--m'
            position='bottom'
            content={<code>{problem.tooltip}</code>}
          >
            <EuiFlexGroup gutterSize='xs' alignItems='center'>
              <EuiFlexItem grow={false}>{problemMessage}</EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiIcon type='iInCircle' />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiToolTip>
        ) : (
          problemMessage
        )

        return (
          <div key={problem.id} data-test-id={problem['data-test-id']}>
            <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
              <EuiFlexItem grow={false}>
                <EuiIcon type={getProblemIcon(problem)} />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>{problemWithToolTip}</EuiFlexItem>

              {problem.dismissible && (
                <EuiFlexItem grow={false}>
                  <EuiToolTip
                    position='bottom'
                    content={
                      <FormattedMessage
                        id='health-problem-list.dismiss-problem-tooltip'
                        defaultMessage='Hide this {problemSeverity} and others like it'
                        values={{
                          problemSeverity: formatSeverityLevels([problem]),
                        }}
                      />
                    }
                  >
                    <EuiLink onClick={() => dismissProblem && dismissProblem(problem)}>
                      <FormattedMessage
                        id='health-problem-list.dismiss-problem'
                        defaultMessage='Dismiss'
                      />
                    </EuiLink>
                  </EuiToolTip>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>

            {!hideHelpText && problem.helpText && (
              <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
                <EuiFlexItem grow={false}>
                  <EuiIcon type='empty' />
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  <EuiFormHelpText className='euiFormHelpText-zeroPad'>
                    {problem.helpText}
                  </EuiFormHelpText>
                </EuiFlexItem>
              </EuiFlexGroup>
            )}
          </div>
        )
      })}

    {isEmpty(dismissedProblems) || (
      <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiIcon type='empty' />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <HealthProblemListDismissed
            dismissedProblems={dismissedProblems}
            resetProblemDismissions={resetProblemDismissions}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )}
  </Fragment>
)

export default HealthProblemList
