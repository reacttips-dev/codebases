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
import { Link } from 'react-router-dom'

import { EuiIcon } from '@elastic/eui'

import AttemptInfoAlert from './AttemptInfoAlert'

import { deploymentEditUrl, deploymentEditFromAttemptUrl } from '../../../lib/urlBuilder'

import { ElasticsearchCluster } from '../../../types'

type Props = {
  deployment: ElasticsearchCluster
  basedOnAttempt: boolean
}

const AttemptInfo: FunctionComponent<Props> = ({ deployment, basedOnAttempt }) => {
  const { isPending, isActive, status } = deployment.plan

  const hasFailedPlan = !isPending && status.failed > 0
  const initialPlanAttemptFailed = !isActive && hasFailedPlan

  if (initialPlanAttemptFailed) {
    return (
      <AttemptInfoAlert type='warning'>
        <FormattedMessage
          id='edit-cluster-attempt-info.applying-initial-cluster-plan-failed'
          defaultMessage='Applying the initial cluster plan failed. Below is the configuration from the failed attempt.'
        />
      </AttemptInfoAlert>
    )
  }

  if (basedOnAttempt) {
    return (
      <AttemptInfoAlert type='info'>
        <FormattedMessage
          id='edit-cluster-attempt-info.the-last-attempt-at-changing-the-cluster-configuration-failed-review'
          defaultMessage='The last attempt at changing the cluster configuration failed. Review the marked changes ({infoIcon}) from the last failed attempt. One of these changes might have caused the attempt to reconfigure the cluster to fail. {viewSuccessful}.'
          values={{
            infoIcon: <EuiIcon type='iInCircle' />,
            viewSuccessful: (
              <Link to={deploymentEditUrl(deployment.stackDeploymentId!)}>
                <strong>
                  <FormattedMessage
                    id='edit-cluster-attempt-info.view-current-successful-plan'
                    defaultMessage='View current successful plan'
                  />
                </strong>
              </Link>
            ),
          }}
        />
      </AttemptInfoAlert>
    )
  }

  if (hasFailedPlan) {
    return (
      <AttemptInfoAlert type='info'>
        <FormattedMessage
          id='edit-cluster-attempt-info.the-last-attempt-at-changing-the-cluster-configuration-failed-you-are-viewing-the-currently-successful-plan'
          defaultMessage='The last attempt at changing the cluster configuration failed. You are viewing the currently successful plan. {viewFailed}.'
          values={{
            viewFailed: (
              <Link to={deploymentEditFromAttemptUrl(deployment.stackDeploymentId!)}>
                <strong>
                  <FormattedMessage
                    id='edit-cluster-attempt-info.view-failed-cluster-configuration'
                    defaultMessage='View failed cluster configuration'
                  />
                </strong>
              </Link>
            ),
          }}
        />
      </AttemptInfoAlert>
    )
  }

  return null
}

export default AttemptInfo
