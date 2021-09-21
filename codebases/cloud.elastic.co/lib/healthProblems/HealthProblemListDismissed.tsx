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

import { EuiLink, EuiText } from '@elastic/eui'

import { formatSeverityLevels, Problem } from './problems'

type Props = {
  dismissedProblems: Problem[]
  resetProblemDismissions?: (problems: Problem[]) => void
}

const HealthProblemListDismissed: FunctionComponent<Props> = ({
  dismissedProblems,
  resetProblemDismissions,
}) => (
  <EuiText size='xs' color='subdued'>
    <FormattedMessage
      id='health-problem-list-dismissed.message'
      defaultMessage='Dismissed {dismissedProblemCount} health {dismissedProblemSeverity}. {show}'
      values={{
        dismissedProblemCount: dismissedProblems.length,
        dismissedProblemSeverity: formatSeverityLevels(dismissedProblems),
        show: (
          <EuiLink
            onClick={() => resetProblemDismissions && resetProblemDismissions(dismissedProblems)}
          >
            <FormattedMessage
              id='health-problem-list-dismissed.show-again'
              defaultMessage='Show?'
            />
          </EuiLink>
        ),
      }}
    />
  </EuiText>
)

export default HealthProblemListDismissed
