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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiLink, EuiSpacer } from '@elastic/eui'

import RequiresSudo from '../RequiresSudo'

import StackDeploymentSnapshotProgress from '../StackDeploymentSnapshotProgress'

import { isPendingAttempt } from '../../lib/stackDeployments'

import { StackDeployment, AnyClusterPlanInfo } from '../../types'

type Props = {
  deployment: StackDeployment
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangeStepSnapshot: FunctionComponent<Props> = ({
  deployment,
  planAttempt,
  spacerBefore,
  spacerAfter,
}) => {
  if (!isPendingAttempt({ planAttempt })) {
    // sanity check to guard against API bugs
    return null
  }

  const { plan_attempt_log } = planAttempt

  const lastMessage = plan_attempt_log[plan_attempt_log.length - 1]

  if (!lastMessage) {
    return null
  }

  const takingSnapshot = isSnapshotStep(lastMessage)

  if (!takingSnapshot) {
    return null
  }

  const showSnapshotProgress = (
    <FormattedMessage
      id='plan-attempt-taking-snapshot.show-snapshot-progress'
      defaultMessage='Reveal snapshot progress'
    />
  )

  return (
    <RequiresSudo
      color='primary'
      buttonType={EuiLink}
      to={showSnapshotProgress}
      helpText={false}
      actionPrefix={false}
      renderSudoGate={({ children }) => (
        <Fragment>
          {spacerBefore && <EuiSpacer size='m' />}

          {children}

          {spacerAfter && <EuiSpacer size='m' />}
        </Fragment>
      )}
    >
      {spacerBefore && <EuiSpacer size='m' />}
      <StackDeploymentSnapshotProgress deployment={deployment} />
      {spacerAfter && <EuiSpacer size='m' />}
    </RequiresSudo>
  )
}

function isSnapshotStep(step) {
  // eslint-disable-next-line lodash/prefer-matches
  return (
    step.step_id === `perform-snapshot` && step.stage !== `completed` && step.status === `pending`
  )
}

export default StackConfigurationChangeStepSnapshot
