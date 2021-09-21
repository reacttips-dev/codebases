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
import React, { Fragment, Component } from 'react'
import { injectIntl, IntlShape } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import { get } from 'lodash'

import { EuiSplitPanel } from '@elastic/eui'

import DeploymentGettingStartedDetails from './DeploymentGettingStartedDetails'
import DeploymentGettingStartedHeader from './DeploymentGettingStartedHeader'
import Breadcrumbs, { BreadcrumbsContext } from '../../Breadcrumbs'
import { getHeaderDefinition } from '../DeploymentHeader/headerDefinitions'

import { getLinks } from '../../../lib/deployments/links'
import { kibanaGettingStartedUrl } from '../../../lib/serviceProviderDeepLinks'
import {
  isEsStopped,
  isEsStopping,
  isEveryResourceStarted,
  hasFailedCreatePlan,
  getFirstSliderClusterFromGet,
  hasHealthyResourcePlan,
  isAnyResourceChanging,
  getDisplayName,
  getVersion,
} from '../../../lib/stackDeployments'

import {
  StackDeployment,
  ElasticsearchCluster,
  AsyncRequestState,
  GettingStartedType,
} from '../../../types'
import {
  DeploymentTemplateInfoV2,
  ClusterCredentials,
  KibanaResourceInfo,
} from '../../../lib/api/v1/types'

import './deploymentGettingStarted.scss'

export type QueryParams = {
  regionId?: string
  deploymentId: string
  snapshotName?: string
}

export type Props = {
  intl: IntlShape
  credentials?: ClusterCredentials
  stackDeployment: StackDeployment
  deployment: ElasticsearchCluster
  deploymentTemplate: DeploymentTemplateInfoV2
  resetPasswordStatus: AsyncRequestState
  instanceType: GettingStartedType
  resetPassword: (deployment: StackDeployment) => void
  onResetPassword: () => void
  isAnyAdminConsole: boolean
  match: RouteComponentProps<QueryParams>['match']
}

type State = {
  isModalOpen: boolean
}

class DeploymentGettingStarted extends Component<Props, State> {
  state: State = {
    isModalOpen: false,
  }

  render() {
    const {
      stackDeployment,
      credentials,
      deployment,
      deploymentTemplate,
      instanceType,
      isAnyAdminConsole,
      match,
    } = this.props
    const isStopped = isEsStopped({ deployment: stackDeployment })
    const isStopping = isEsStopping({ deployment: stackDeployment })
    const isHidden = get(deployment, [`metadata`, `hidden`])

    if (!instanceType) {
      return null
    }

    // We don't need to show this for deployments that are deleted
    if (isStopping || isStopped || isHidden) {
      return null
    }

    const linkInfo =
      instanceType === `elasticsearch`
        ? []
        : getLinks({ deployment: stackDeployment, show: instanceType })
    const showDeploymentCompletedMessage = isEveryResourceStarted({ deployment: stackDeployment })
    const changingPlan = isAnyResourceChanging({ deployment: stackDeployment })
    const planInProgress =
      (linkInfo.length > 0 && !linkInfo[0].available && changingPlan) || changingPlan
    const disabled = linkInfo.length > 0 && !linkInfo[0].available && !changingPlan
    const kibanaResource = getFirstSliderClusterFromGet<KibanaResourceInfo>({
      deployment: stackDeployment,
      sliderInstanceType: `kibana`,
    })
    const isKibanaUnhealthy =
      kibanaResource !== null && !hasHealthyResourcePlan({ resource: kibanaResource })
    const createFailed =
      (!planInProgress && hasFailedCreatePlan({ deployment: stackDeployment })) ||
      (!planInProgress && isKibanaUnhealthy)
    const deepLink = kibanaGettingStartedUrl({ resource: kibanaResource, deploymentTemplate })
    const version = stackDeployment ? getVersion({ deployment: stackDeployment }) : undefined
    const deploymentDisplayName = stackDeployment
      ? getDisplayName({ deployment: stackDeployment })
      : deployment.displayName
    const { breadcrumbs } = getHeaderDefinition({
      match,
      deploymentDisplayName,
      version,
    })
    return (
      <Fragment>
        <BreadcrumbsContext.Consumer>
          {({ breadcrumbsRef }) => (
            <Breadcrumbs breadcrumbsRef={breadcrumbsRef} breadcrumbs={breadcrumbs} />
          )}
        </BreadcrumbsContext.Consumer>
        <EuiSplitPanel.Outer className='getting-started-panel' grow={true}>
          <EuiSplitPanel.Inner className='getting-started-header'>
            <DeploymentGettingStartedHeader
              planInProgress={planInProgress}
              stackDeployment={stackDeployment}
              createFailed={createFailed}
              showDeploymentCompletedMessage={showDeploymentCompletedMessage}
              deepLink={deepLink}
              disabled={disabled}
            />
          </EuiSplitPanel.Inner>

          <EuiSplitPanel.Inner className='getting-started-details'>
            <DeploymentGettingStartedDetails
              planFailed={createFailed}
              disabled={disabled}
              credentials={credentials}
              instanceType={instanceType}
              planInProgress={planInProgress}
              linkInfo={linkInfo[0]}
              deployment={stackDeployment}
              deploymentTemplate={deploymentTemplate}
              isAnyAdminConsole={isAnyAdminConsole}
            />
          </EuiSplitPanel.Inner>
        </EuiSplitPanel.Outer>
      </Fragment>
    )
  }
}

export default injectIntl(DeploymentGettingStarted)
