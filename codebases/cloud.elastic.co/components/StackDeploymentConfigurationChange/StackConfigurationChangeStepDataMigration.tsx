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

import ShardDataMigrationTable from '../ShardDataMigrationTable'

import { isPendingAttempt } from '../../lib/stackDeployments'

import { StackDeployment, AnyClusterPlanInfo } from '../../types'
import { ClusterPlanStepInfo } from '../../lib/api/v1/types'

type Props = {
  deployment: StackDeployment
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangeStepDataMigration: FunctionComponent<Props> = ({
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

  const dataMigration = isDataMigrationStep(lastMessage)

  if (!dataMigration) {
    return null
  }

  const showShardMigrationProgress = (
    <FormattedMessage
      id='plan-attempt-migrate-data.show-shard-migration'
      defaultMessage='Reveal shard migration progress'
    />
  )

  return (
    <RequiresSudo
      color='primary'
      buttonType={EuiLink}
      to={showShardMigrationProgress}
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

      <ShardDataMigrationTable deployment={deployment} />

      {spacerAfter && <EuiSpacer size='m' />}
    </RequiresSudo>
  )
}

function isDataMigrationStep(step: ClusterPlanStepInfo): boolean {
  // eslint-disable-next-line lodash/prefer-matches
  const isAMigrationStep =
    step.step_id === `migrate-data` || step.step_id === `shutdown-elasticsearch-nodes`
  return isAMigrationStep && step.stage !== `completed` && step.status === `pending`
}

export default StackConfigurationChangeStepDataMigration
