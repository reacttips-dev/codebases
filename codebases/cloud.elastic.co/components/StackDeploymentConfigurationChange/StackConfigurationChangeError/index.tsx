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
import { isEmpty } from 'lodash'

import { EuiCallOut, EuiSpacer } from '@elastic/eui'

import StackConfigurationChangeErrorDetails from './StackConfigurationChangeErrorDetails'
import { parseConfigurationChangeError } from '../../../lib/healthProblems/stackDeploymentHealth'

import { AnyResourceInfo, AnyClusterPlanInfo, SliderInstanceType } from '../../../types'
import { getConfigForKey } from '../../../store'

type Props = {
  resource: AnyResourceInfo
  resourceType: SliderInstanceType
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangeError: FunctionComponent<Props> = ({
  resource,
  resourceType,
  planAttempt,
  spacerBefore,
  spacerAfter,
}) => {
  const parsedError = parseConfigurationChangeError({
    resource,
    resourceType,
    planAttempt,
    linkify: true,
  })

  if (parsedError === null) {
    return null
  }

  const { title, description, details, size } = parsedError

  const isAdminConsole = getConfigForKey(`APP_NAME`) === `adminconsole`

  return (
    <Fragment>
      {spacerBefore && <EuiSpacer size='m' />}

      <EuiCallOut size={size} color='warning' title={title}>
        {description}

        {isAdminConsole && !isEmpty(details) && (
          <Fragment>
            <EuiSpacer size='m' />

            <StackConfigurationChangeErrorDetails details={details} />
          </Fragment>
        )}
      </EuiCallOut>

      {spacerAfter && <EuiSpacer size='m' />}
    </Fragment>
  )
}

export default StackConfigurationChangeError
