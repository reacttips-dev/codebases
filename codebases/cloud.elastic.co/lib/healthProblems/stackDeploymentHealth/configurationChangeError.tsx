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

import React, { ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiText } from '@elastic/eui'

import { CuiLink } from '../../../cui'

import OutOfCapacityCulprits from './OutOfCapacityCulprits'
import configurationChangeErrorDescriptions from './configurationChangeErrorMessages'

import {
  parsePlanAttemptError,
  ParsedPlanAttemptError,
  PlanAttemptErrorDetails,
} from '../../stackDeployments'

import { supportUrl } from '../../../lib/urlBuilder'

import { getConfigForKey } from '../../../store'

import { AnyClusterPlanInfo, AnyResourceInfo, SliderInstanceType } from '../../../types'

import { PlanChangeErrorTypes } from '../../../reducers/lib/errorTypes'

type ConfigurationChangeError = {
  title: ReactElement
  description?: ReactNode
  size?: 's' | 'm'
}

type DetailedConfigurationChangeError = ConfigurationChangeError & {
  details: PlanAttemptErrorDetails
}

export function parseConfigurationChangeError({
  resource,
  resourceType,
  planAttempt,
  linkify,
}: {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  linkify?: boolean
}): DetailedConfigurationChangeError | null {
  const parsedError = parsePlanAttemptError({ planAttempt })

  if (!parsedError) {
    return null
  }

  const configurationChangeError = describeConfigurationChangeError({
    resource,
    resourceType,
    planAttempt,
    linkify,
    parsedError,
  })

  const { details } = parsedError

  return { ...configurationChangeError, details }
}

function describeConfigurationChangeError({
  resource,
  resourceType,
  planAttempt,
  linkify,
  parsedError,
}: {
  errorType?: string
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  linkify?: boolean
  parsedError: ParsedPlanAttemptError
}): ConfigurationChangeError {
  const { errorType } = parsedError

  switch (errorType) {
    case PlanChangeErrorTypes.NOT_ENOUGH_CAPACITY:
      return describeCapacityError({
        resource,
        resourceType,
        planAttempt,
        linkify,
      })

    case PlanChangeErrorTypes.TIMEOUT:
      return describeTimeoutError()

    case PlanChangeErrorTypes.CANCELLED_PLAN:
      return describeCancelError()

    case PlanChangeErrorTypes.TOPOLOGY_CHANGE_ROLLING_STRATEGY:
      return describeRollingTopologyError()

    default:
      return parseErrorMessage({ parsedError, linkify })
  }
}

function parseErrorMessage({
  parsedError,
  linkify,
}: {
  parsedError: ParsedPlanAttemptError
  linkify?: boolean
}): ConfigurationChangeError {
  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.generic-title'
        defaultMessage='There was a problem applying this configuration change'
      />
    ),
    description: (
      <EuiText size='s'>
        {isUserConsole && <p>{getContactSupportDescription(linkify)}</p>}
        {getConfigurationChangeErrorDescription({ parsedError })}
      </EuiText>
    ),
  }
}

function describeTimeoutError(): ConfigurationChangeError {
  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.timeout-title'
        defaultMessage='This configuration change timed out'
      />
    ),
    description: (
      <FormattedMessage
        id='configuration-change-errors.timeout-description'
        defaultMessage='A timeout occurred while applying the configuration change. This may happen when the requested changes are time consuming.'
      />
    ),
  }
}

function describeCancelError(): ConfigurationChangeError {
  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.cancel-title'
        defaultMessage='This configuration change was cancelled'
      />
    ),
    size: `s`,
  }
}

function describeRollingTopologyError(): ConfigurationChangeError {
  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.rolling-topology-title'
        defaultMessage='This configuration change was invalid'
      />
    ),
    description: (
      <EuiText>
        <p>
          <FormattedMessage
            id='configuration-change-errors.rolling-topology-description'
            defaultMessage='You cannot perform a major version upgrade and change the cluster topology (memory, number of zones, dedicated master nodes, etc…) at the same time. You need to perform these configuration changes separately.'
          />
        </p>
        <p>
          <FormattedMessage
            id='configuration-change-errors.rolling-topology-solution'
            defaultMessage='For cluster topology changes, apply the configuration change by creating new nodes. For major version upgrades, perform a rolling upgrade.'
          />
        </p>
      </EuiText>
    ),
  }
}

function describeCapacityError({
  resource,
  resourceType,
  planAttempt,
  linkify,
}: {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  linkify?: boolean
}) {
  const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

  if (isUserConsole) {
    return describeTemporarilyOutOfCapacityError()
  }

  return describeOutOfCapacityError({
    resource,
    resourceType,
    planAttempt,
    linkify,
  })
}

function describeTemporarilyOutOfCapacityError(): ConfigurationChangeError {
  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.temporarily-out-of-capacity-title'
        defaultMessage='Temporarily out of capacity'
      />
    ),
    description: (
      <FormattedMessage
        id='configuration-change-errors.temporarily-out-of-capacity-description'
        defaultMessage="It's not you, it's us. We couldn't fulfill your request, but we've alerted our engineers to add more capacity to our pool of resources in the zones that you requested. This typically takes less than an hour and we'll reach out to you."
      />
    ),
  }
}

function describeOutOfCapacityError({
  resource,
  resourceType,
  planAttempt,
  linkify,
}: {
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
  resourceType: SliderInstanceType
  linkify?: boolean
}) {
  return {
    title: (
      <FormattedMessage
        id='configuration-change-errors.not-enough-capacity-title'
        defaultMessage='Out of capacity'
      />
    ),
    description: (
      <OutOfCapacityCulprits
        resource={resource}
        resourceType={resourceType}
        planAttempt={planAttempt}
        linkify={linkify}
      />
    ),
  }
}

function getContactSupportDescription(linkify?: boolean) {
  const contactSupportText = (
    <FormattedMessage
      id='configuration-change-errors.contact-support'
      defaultMessage='contact Support'
    />
  )

  const contactSupport = linkify ? (
    <CuiLink to={supportUrl()}>{contactSupportText}</CuiLink>
  ) : (
    contactSupportText
  )

  return (
    <FormattedMessage
      id='configuration-change-errors.generic-message'
      defaultMessage='Please try again and if the problem persists {contactSupport}.'
      values={{ contactSupport }}
    />
  )
}

function getConfigurationChangeErrorDescription({
  parsedError,
}: {
  parsedError: ParsedPlanAttemptError
}): ReactNode {
  const { details, errorType, message: rawMessage } = parsedError
  const prettyMessage = rawMessage.replace(/^Unexpected error during step: /, ``)

  const genericDescription = (
    <p data-test-id='configuration-change-error-description'>{prettyMessage}</p>
  )

  if (!errorType) {
    return genericDescription
  }

  const [category, failure] = errorType.split(':')
  const description = configurationChangeErrorDescriptions[category][failure]

  if (!description) {
    return genericDescription
  }

  return (
    <FormattedMessage
      data-test-id='configuration-change-error-description'
      {...description}
      values={details}
    />
  )
}
