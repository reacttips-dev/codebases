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

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiSpacer, EuiText, EuiCode } from '@elastic/eui'

import { CuiCodeBlock, CuiDuration, CuiTimestamp, withErrorBoundary } from '../../cui'

import { ClusterPlanStepLogMessageInfo } from '../../lib/api/v1/types'

import parseStepMessageResult from './lib/parseStepMessageResult'
import stringify from '../../lib/stringify'

interface Props {
  stepMessages: ClusterPlanStepLogMessageInfo[]
}

type TimingProps = { started: string; took: number; isPending: boolean }
type DescriptionProps = { stepMessageText: string }
type ResultProps = { result: string }
type ErrorDetailsProps = {
  failureType?: string
  details: { [key: string]: string }
  internalDetails?: { [key: string]: string }
}

const StepMessages: FunctionComponent<Props> = ({ stepMessages }) => (
  <div data-test-id='planAttempt-expanded-message'>
    {stepMessages
      .slice(0)
      .reverse()
      .map((stepMessage, index) => (
        <Fragment key={index}>
          {index !== 0 && <EuiSpacer size='m' />}

          <StepMessageTiming
            started={stepMessage.timestamp}
            took={stepMessage.delta_in_millis || 0}
            isPending={stepMessage.stage !== `completed`}
          />

          <StepMessageDescription stepMessageText={stepMessage.message} />

          <StepErrorDetails
            failureType={stepMessage.failure_type}
            details={stepMessage.details}
            internalDetails={stepMessage.internal_details}
          />
        </Fragment>
      ))}
  </div>
)

const StepMessageTiming: FunctionComponent<TimingProps> = ({ started, took, isPending }) => {
  const when = <CuiTimestamp date={started} />

  return (
    <EuiText size='xs' color='subdued'>
      <EuiFlexGroup gutterSize='xs' alignItems='center' responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiIcon type='clock' />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <span>
            {isPending ? (
              when
            ) : (
              <FormattedMessage
                id='step-message-duration.started-when-took-time'
                defaultMessage='{when}, took {time}'
                values={{
                  when,
                  time: <CuiDuration milliseconds={took} shouldCapitalize={false} />,
                }}
              />
            )}
          </span>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiText>
  )
}

const StepMessageDescription: FunctionComponent<DescriptionProps> = ({ stepMessageText }) => {
  const highlightable = [
    /^(Completed step): \[([^\]]+)\] with result: \[([\s\S]+)\](?: in \[\d+\] ms)?$/,
    /^(Starting step): \[([^\]]+)\]: \[([\s\S]+)\](?: in \[\d+\] ms)?$/,
  ]

  const highlighting = highlightable.map((e) => stepMessageText.match(e)).find(Boolean)

  if (!highlighting) {
    return <EuiText>{stepMessageText}</EuiText>
  }

  const [, action, step, result] = highlighting
  const emptyResult = result === `()` || result === `{}` || result.trim().length === 0

  return (
    <div>
      <EuiText>
        <span>{action}</span>
        <span>&nbsp;</span>
        <EuiCode>{step}</EuiCode>
      </EuiText>

      {emptyResult || <StepMessageResult result={result} />}
    </div>
  )
}

const StepMessageResult: FunctionComponent<ResultProps> = ({ result }) => {
  const { source, language } = parseStepMessageResult(result)

  return (
    <Fragment>
      <EuiSpacer size='s' />

      <CuiCodeBlock language={language} overflowHeight={400} paddingSize='s'>
        {source}
      </CuiCodeBlock>
    </Fragment>
  )
}

const StepErrorDetails: FunctionComponent<ErrorDetailsProps> = ({
  failureType,
  details,
  internalDetails,
}) => {
  if (!failureType) {
    return null
  }

  const stepErrorDetails = { failure_type: failureType, ...details, ...internalDetails }

  return (
    <Fragment>
      <EuiSpacer size='s' />

      <CuiCodeBlock language='json' overflowHeight={400} paddingSize='s'>
        {stringify(stepErrorDetails)}
      </CuiCodeBlock>
    </Fragment>
  )
}

export default withErrorBoundary(StepMessages)
