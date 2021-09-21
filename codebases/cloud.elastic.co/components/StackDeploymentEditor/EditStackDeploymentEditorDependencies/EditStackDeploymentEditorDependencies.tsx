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
import { Link } from 'react-router-dom'

import { EuiLoadingContent } from '@elastic/eui'

import { CuiAlert } from '../../../cui'

import ClusterLockingGate from '../../ClusterLockingGate'
import ClusterLocked from '../../ClusterLockingGate/ClusterLocked'

import { deploymentActivityElasticsearchUrl } from '../../../lib/urlBuilder'

import { hasOngoingConfigurationChange, getLastPlanAttempt } from '../../../lib/stackDeployments'

import { WithStackDeploymentRouteParamsProps } from '../routing'

import { EditFlowConsumerProps } from '../types'

import { AsyncRequestState } from '../../../types'

import {
  DeploymentGetResponse,
  DeploymentTemplateInfoV2,
  ElasticsearchClusterPlanInfo,
} from '../../../lib/api/v1/types'

type StateProps = {
  stackDeployment: DeploymentGetResponse
  deploymentTemplate?: DeploymentTemplateInfoV2
  showFailedAttempt: boolean
  fetchDeploymentTemplatesRequest: AsyncRequestState
}

type DispatchProps = {
  fetchDeployment: (params: { regionId: string; deploymentId: string }) => void
}

type ConsumerProps = WithStackDeploymentRouteParamsProps &
  EditFlowConsumerProps & {
    children: (props: EditFlowConsumerProps) => ReactNode
  }

type Props = StateProps & DispatchProps & ConsumerProps

const EditStackDeploymentEditorDependencies: FunctionComponent<Props> = ({
  children: renderEditorComponent,
  deploymentTemplate,
  fetchDeploymentTemplatesRequest,
  showFailedAttempt,
  stackDeployment,
  stackDeploymentId,
}) => {
  const lastAttempt = getLastPlanAttempt<ElasticsearchClusterPlanInfo>({
    deployment: stackDeployment,
    sliderInstanceType: `elasticsearch`,
  })
  const lastAttemptPlan = lastAttempt && lastAttempt.plan
  const planAttemptUnderRetry = showFailedAttempt ? lastAttemptPlan : null

  if (hasOngoingConfigurationChange({ deployment: stackDeployment })) {
    return (
      <CuiAlert type='warning'>
        <FormattedMessage
          id='edit-cluster.cannot-configure-while-change-in-progress'
          defaultMessage='The deployment cannot be configured while another change is in progress. {seeActivity}.'
          values={{
            seeActivity: (
              <Link to={deploymentActivityElasticsearchUrl(stackDeploymentId!)}>
                <FormattedMessage
                  id='edit-cluster-index.see-activity'
                  defaultMessage='Go to Activity'
                />
              </Link>
            ),
          }}
        />
      </CuiAlert>
    )
  }

  if (!fetchDeploymentTemplatesRequest.isDone) {
    return <EuiLoadingContent lines={6} />
  }

  if (fetchDeploymentTemplatesRequest.error) {
    return <CuiAlert type='error'>{fetchDeploymentTemplatesRequest.error}</CuiAlert>
  }

  return (
    <ClusterLockingGate onLocked={() => <ClusterLocked />}>
      {renderEditorComponent({
        stackDeployment,
        deploymentTemplate,
        planAttemptUnderRetry,
      })}
    </ClusterLockingGate>
  )
}

export default EditStackDeploymentEditorDependencies
