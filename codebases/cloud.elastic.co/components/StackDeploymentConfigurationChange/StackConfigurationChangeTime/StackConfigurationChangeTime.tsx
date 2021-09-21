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

import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiTextColor } from '@elastic/eui'

import { CuiDuration, CuiTimeAgo } from '../../../cui'

import { isPendingAttempt } from '../../../lib/stackDeployments'

import { AsyncRequestState, AnyClusterPlanInfo } from '../../../types'

type Props = {
  planAttempt: AnyClusterPlanInfo
  cancelPlanRequest: AsyncRequestState
  hideTimeSpent?: boolean
}

const StackConfigurationChangeTime: FunctionComponent<Props> = ({
  planAttempt,
  cancelPlanRequest,
  hideTimeSpent,
}) => (
  <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
    <EuiFlexItem grow={false}>
      <EuiIcon type='clock' />
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      {getLabel({ planAttempt, cancelPlanRequest, hideTimeSpent })}
    </EuiFlexItem>
  </EuiFlexGroup>
)

function getLabel({
  planAttempt,
  cancelPlanRequest,
  hideTimeSpent,
}: {
  planAttempt: AnyClusterPlanInfo
  cancelPlanRequest: AsyncRequestState
  hideTimeSpent?: boolean
}) {
  const { healthy, attempt_start_time, attempt_end_time } = planAttempt
  const pending = isPendingAttempt({ planAttempt })

  const cancelled =
    pending && cancelPlanRequest && cancelPlanRequest.isDone && !cancelPlanRequest.error

  const startTime = (
    <CuiTimeAgo date={attempt_start_time} longTime={true} shouldCapitalize={false} />
  )

  if (cancelled) {
    return (
      <div data-test-id='configuration-change-cancelled'>
        <FormattedMessage
          id='configuration-change-time.started-but-cancelling'
          defaultMessage='Started { when }, { butCancelling }'
          values={{
            when: startTime,
            butCancelling: (
              <EuiTextColor color='warning'>
                <FormattedMessage
                  id='configuration-change-time.cancelling'
                  defaultMessage='cancelling…'
                />
              </EuiTextColor>
            ),
          }}
        />
      </div>
    )
  }

  if (pending) {
    return (
      <div data-test-id='configuration-change-pending'>
        <FormattedMessage
          id='configuration-change-time.started-when'
          defaultMessage='Started { when }'
          values={{ when: startTime }}
        />
      </div>
    )
  }

  const endTime = <CuiTimeAgo date={attempt_end_time} longTime={true} shouldCapitalize={false} />

  const diff = moment(attempt_end_time).diff(attempt_start_time)

  const duration = <CuiDuration milliseconds={diff} shouldCapitalize={false} />

  if (!healthy) {
    const butFailed = (
      <EuiTextColor color='warning'>
        <FormattedMessage
          id='configuration-change-time.ultimately-failed'
          defaultMessage='but ultimately failed'
        />
      </EuiTextColor>
    )

    if (hideTimeSpent) {
      return (
        <div data-test-id='configuration-change-finished-but-failed'>
          <FormattedMessage
            id='configuration-change-time.finished-when-but-failed'
            defaultMessage='Finished {when}, {butFailed}'
            values={{
              when: endTime,
              butFailed,
            }}
          />
        </div>
      )
    }

    return (
      <div data-test-id='configuration-change-finished-but-failed'>
        <FormattedMessage
          id='configuration-change-time.finished-when-took-time-but-failed'
          defaultMessage='Finished {when} and took {duration}, {butFailed}'
          values={{
            when: endTime,
            duration,
            butFailed,
          }}
        />
      </div>
    )
  }

  if (hideTimeSpent) {
    return (
      <div data-test-id='configuration-change-finished'>
        <FormattedMessage
          id='configuration-change-time.applied-when'
          defaultMessage='Applied { when }'
          values={{ when: endTime }}
        />
      </div>
    )
  }

  return (
    <div data-test-id='configuration-change-finished'>
      <FormattedMessage
        id='configuration-change-time.applied-when-with-duration'
        defaultMessage='Applied { when }, took { duration }'
        values={{
          when: endTime,
          duration,
        }}
      />
    </div>
  )
}

export default StackConfigurationChangeTime
