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

import { isEmpty, isEqual } from 'lodash'

import React, { Fragment, FunctionComponent } from 'react'

import { EuiSpacer } from '@elastic/eui'

import { CuiCodeBlock } from '../../cui'

import { getPlanBeforeAttempt } from '../../lib/stackDeployments'
import { jsonDiff } from '../../lib/diff'
import stringify from '../../lib/stringify'

import { isFeatureActivated } from '../../store'

import { AnyResourceInfo, AnyClusterPlanInfo } from '../../types'
import Feature from '../../lib/feature'

type Props = {
  resource: AnyResourceInfo
  planAttempt: AnyClusterPlanInfo
  spacerBefore?: boolean
  spacerAfter?: boolean
}

const StackConfigurationChangeRawPlanJson: FunctionComponent<Props> = ({
  resource,
  planAttempt,
  spacerBefore,
  spacerAfter,
}) => {
  const hideRawSource = isFeatureActivated(Feature.hidePlanDetails)

  if (hideRawSource) {
    return null
  }

  const { plan = {} } = planAttempt
  const prevPlan = getPlanBeforeAttempt({ resource, planAttempt }) || {}
  const prevPlanNotEmpty = !isEmpty(prevPlan)
  const notSame = !isEqual(prevPlan, plan)
  const highlightDiff = prevPlan && prevPlanNotEmpty && notSame

  const language = highlightDiff ? `diff` : `json`
  const source = highlightDiff ? jsonDiff(prevPlan, plan) : stringify(plan)

  return (
    <Fragment>
      {spacerBefore && <EuiSpacer size='m' />}

      <div style={{ width: `100%` }}>
        <CuiCodeBlock language={language} overflowHeight={400}>
          {source}
        </CuiCodeBlock>
      </div>

      {spacerAfter && <EuiSpacer size='m' />}
    </Fragment>
  )
}

export default StackConfigurationChangeRawPlanJson
