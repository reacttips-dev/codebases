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

import { get } from 'lodash'

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiFormLabel, EuiSpacer } from '@elastic/eui'

import { withErrorBoundary } from '../../../../cui'

import PlanOverride from './PlanOverride'

import { hasHealthyEsPlan } from '../../../../lib/stackDeployments'

import { planOverridePaths } from '../../../../config/clusterPaths'

import { getConfigForKey } from '../../../../store'

import {
  ElasticsearchClusterPlan,
  DeploymentSearchResponse,
  DeploymentGetResponse,
} from '../../../../lib/api/v1/types'

type StackDeployment = DeploymentGetResponse | DeploymentSearchResponse

type Props = {
  checkboxIdPrefix?: string
  deployment: StackDeployment
  hideExtraFailoverOptions: boolean
  basedOnAttempt?: boolean
  plan: ElasticsearchClusterPlan
  onChange: (path: string[], value: any) => void
}

const FailoverOptions: FunctionComponent<Props> = ({
  checkboxIdPrefix,
  deployment,
  plan,
  onChange,
  hideExtraFailoverOptions,
  basedOnAttempt,
}) => {
  const healthyPlan = hasHealthyEsPlan({ deployment })
  const isSad = basedOnAttempt || !healthyPlan

  // ESS AC, ESSP AC, GovCloud AC, etc.
  const isAnySaasAdminconsole =
    getConfigForKey(`APP_PLATFORM`) === `saas` && getConfigForKey(`APP_NAME`) === `adminconsole`

  const showSkipSnapshot = isSad || isAnySaasAdminconsole
  const hasSkipSnapshot = get(plan, planOverridePaths.skipSnapshot, false)

  return (
    <Fragment>
      <EuiFormLabel>
        <FormattedMessage
          id='edit-stack-deployment-failover-options.failover'
          defaultMessage='Failover'
        />
      </EuiFormLabel>

      <EuiSpacer size='s' />

      <FormattedMessage
        id='edit-stack-deployment-failover-options.description'
        defaultMessage='Choose the failover options you want to use while applying these configuration changes:'
      />

      <EuiSpacer size='s' />

      <PlanOverride
        id={`${checkboxIdPrefix ? `${checkboxIdPrefix}-` : ``}failover-extended-maintenance`}
        plan={plan}
        onChange={onChange}
        path={planOverridePaths.extendedMaintenance}
        label={
          <FormattedMessage
            id='edit-stack-deployment-failover-options.extended-maintenance'
            defaultMessage='Extended maintenance'
          />
        }
        description={
          <FormattedMessage
            id='edit-stack-deployment-failover-options.extended-maintenance-description'
            defaultMessage='Places all cluster nodes into maintenance mode until the configuration change completes. If not used, only new instances remain in maintenance mode before they are added to an Elasticsearch cluster.'
          />
        }
        help={
          <FormattedMessage
            id='edit-stack-deployment-failover-options.extended-maintenance-recommended'
            defaultMessage='Recommended when your Elasticsearch cluster is overwhelmed by requests and you need to increase instance capacity, or if you want to restore a snapshot as part of an Elasticsearch cluster configuration change.'
          />
        }
      />

      {showSkipSnapshot && (
        <PlanOverride
          id={`${checkboxIdPrefix ? `${checkboxIdPrefix}-` : ``}failover-skip-snapshot`}
          plan={plan}
          onChange={onChange}
          path={planOverridePaths.skipSnapshot}
          label={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.skip-snapshot'
              defaultMessage='Skip snapshot'
            />
          }
          description={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.skip-snapshot-description'
              defaultMessage='Performs potentially destructive changes to your Elasticsearch cluster without taking a snapshot first.'
            />
          }
          help={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.skip-snapshot-recommended'
              defaultMessage='If your deployment is stuck, overloaded, or otherwise unhealthy, select this option to reapply the plan but disable the snapshot attempt.'
            />
          }
        >
          {hasSkipSnapshot && !isSad && (
            <Fragment>
              <EuiSpacer size='m' />

              <EuiCallOut
                size='s'
                color='warning'
                title={
                  <FormattedMessage
                    id='edit-stack-deployment-failover-options.skip-snapshot-warning'
                    defaultMessage='Do not skip snapshot on a healthy deployment unless you are an advanced user.'
                  />
                }
              />
            </Fragment>
          )}
        </PlanOverride>
      )}

      {isSad && !hideExtraFailoverOptions && (
        <PlanOverride
          id={`${checkboxIdPrefix ? `${checkboxIdPrefix}-` : ``}failover-reallocate`}
          plan={plan}
          onChange={onChange}
          path={planOverridePaths.reallocateInstances}
          label={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.reallocate'
              defaultMessage='Reallocate'
            />
          }
          description={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.reallocate-description'
              defaultMessage='Creates new containers for all instances, and places them on a new allocator.'
            />
          }
          help={
            <FormattedMessage
              id='edit-stack-deployment-failover-options.reallocate-recommended'
              defaultMessage='Recommended if an allocator is having issues, or you want to free up space.'
            />
          }
        />
      )}
    </Fragment>
  )
}

export default withErrorBoundary(FailoverOptions)
