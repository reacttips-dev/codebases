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

import React, { FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { ButtonSize, ButtonColor } from '@elastic/eui'

import { DangerButtonModalProps } from '../../DangerButton'

import StackDeploymentUpdateDryRunWarnings from '../../StackDeploymentUpdateDryRunWarnings'
import StackDeploymentUpdateDryRunWarningCheck from '../../StackDeploymentUpdateDryRunWarningCheck'

import QuickDeploymentUpdateButton, {
  QuickDeploymentUpdateCustomModalProps,
} from '../QuickDeploymentUpdateButton'

import RetryStackDeploymentAttemptModal from './RetryStackDeploymentAttemptModal'

import transformBeforeSave from './lib/transformBeforeSave'

import {
  getDeploymentPlanAttemptId,
  getFirstSliderClusterFromGet,
  getPlanInfo,
  getPlanVersion,
} from '../../../lib/stackDeployments'

import { getSliderPrettyName } from '../../../lib/sliders'

import { AnyClusterPlanInfo, SliderInstanceType, StackDeployment } from '../../../types'

export type Props = {
  deployment: StackDeployment
  sliderInstanceType: SliderInstanceType
  planAttempt?: AnyClusterPlanInfo
  isEmpty?: boolean
  disabled?: boolean
  hideAdminReapplyButton?: boolean
  size?: ButtonSize
  color?: ButtonColor
}

const RetryStackDeploymentAttemptButton: FunctionComponent<Props> = ({
  deployment,
  sliderInstanceType,
  planAttempt,
  disabled,
  isEmpty,
  size,
  color,
  hideAdminReapplyButton,
  children,
}) => {
  const resource = getFirstSliderClusterFromGet({ deployment, sliderInstanceType })!
  const planAttemptUnderRetry =
    planAttempt || getPlanInfo({ resource, state: `last_history_attempt` })

  if (
    hideAdminReapplyButton &&
    planAttemptUnderRetry &&
    planAttemptUnderRetry.source &&
    planAttemptUnderRetry.source.admin_id !== undefined
  ) {
    return null // only render buttons for user-originated plans in user console
  }

  const version = getPlanVersion({ plan: planAttemptUnderRetry?.plan })

  const defaultButtonText = (
    <FormattedMessage
      id='retry-slider-plan-button.text'
      defaultMessage='Retry {sliderName} changes'
      values={{
        sliderName: <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />,
      }}
    />
  )

  const deploymentId = deployment.id
  const buttonText: ReactNode = children || defaultButtonText

  return (
    <StackDeploymentUpdateDryRunWarningCheck deploymentId={deploymentId}>
      {({ dryRunCheckPassed }) => (
        <QuickDeploymentUpdateButton
          data-test-id='reapply-plan-button'
          size={size}
          color={color}
          isEmpty={isEmpty}
          disabled={disabled || !planAttemptUnderRetry}
          planAttemptUnderRetry={planAttemptUnderRetry!}
          sliderInstanceType={sliderInstanceType}
          deployment={deployment}
          customizeModal={(props) => customizeModal(props, { dryRunCheckPassed })}
          pruneOrphans={false}
          transformBeforeSave={(deployment) => transformBeforeSave(deployment, sliderInstanceType)}
        >
          {buttonText}
        </QuickDeploymentUpdateButton>
      )}
    </StackDeploymentUpdateDryRunWarningCheck>
  )

  function customizeModal(
    props: QuickDeploymentUpdateCustomModalProps,
    { dryRunCheckPassed }: { dryRunCheckPassed: boolean },
  ): DangerButtonModalProps | undefined {
    if (!planAttemptUnderRetry) {
      return
    }

    const { updatePayload } = props
    const deploymentId = deployment.id

    return {
      title: (
        <FormattedMessage
          id='reapply-plan-button.title'
          defaultMessage='Confirm to reapply configuration {attempt}?'
          values={{
            attempt: `#${sliderInstanceType}-${getDeploymentPlanAttemptId({
              deployment,
              sliderInstanceType,
              planAttempt: planAttemptUnderRetry,
            })}`,
          }}
        />
      ),
      body: (
        <div>
          <StackDeploymentUpdateDryRunWarnings
            deploymentId={deploymentId}
            deployment={updatePayload}
            spacerAfter={true}
          />

          <RetryStackDeploymentAttemptModal {...props} />
        </div>
      ),
      confirmButtonDisabled: !dryRunCheckPassed,
    }
  }
}

export default RetryStackDeploymentAttemptButton
