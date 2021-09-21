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
import { EuiFlexItem, EuiFlexGroup, EuiText, EuiAccordion, EuiSpacer } from '@elastic/eui'

import DeploymentGettingStartedTitle from './DeploymentGettingStartedTitle'

import DeploymentHealthStatus from '../DeploymentHealthStatus'

import { CuiRouterLinkButton, CuiRouterLinkButtonEmpty } from '../../../cui'

import { createDeploymentUrl, deploymentActivityUrl } from '../../../lib/urlBuilder'

import { StackDeployment } from '../../../types'

import './deploymentGettingStarted.scss'

type Props = {
  deployment: StackDeployment
}

const DeploymentGettingStartedFailed: FunctionComponent<Props> = ({ deployment }) => {
  const title = (
    <FormattedMessage
      id='deployment-waiting-experience.title.failed'
      defaultMessage='Oops, something went wrong'
    />
  )
  return (
    <EuiFlexGroup direction='column'>
      <EuiFlexItem>
        <DeploymentGettingStartedTitle title={title} />
      </EuiFlexItem>

      <EuiFlexItem style={{ width: '80%', margin: 'auto' }}>
        <EuiText textAlign='center'>
          <p>
            <FormattedMessage
              id='deployment-waiting-experience.description.failed'
              defaultMessage='We apologize for not being able to create your deployment. Try again in a few moments or restart the process using different settings.
'
            />
          </p>
        </EuiText>
      </EuiFlexItem>

      <EuiFlexItem
        className='show-error-accordion'
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <EuiAccordion
          id='deployment-creation-show-error'
          arrowDisplay='right'
          buttonContent={
            <FormattedMessage
              id='deployment-waiting-experience-failed.show-error'
              defaultMessage='Show error'
            />
          }
        >
          <DeploymentHealthStatus
            onGettingStartedPage={true}
            stackDeployment={deployment}
            hideActivityBits={false}
            spacerAfter={false}
          />
        </EuiAccordion>
      </EuiFlexItem>
      <EuiFlexItem style={{ alignItems: 'center' }}>
        <div>
          <CuiRouterLinkButton to={createDeploymentUrl()} fill={true}>
            <FormattedMessage
              id='deployment-waitin-experience.failed.start-over'
              defaultMessage='Start over'
            />
          </CuiRouterLinkButton>
        </div>
        <EuiSpacer size='m' />
        <CuiRouterLinkButtonEmpty to={deploymentActivityUrl(deployment.id)}>
          <FormattedMessage
            id='deployment-waitin-experience.failed.view-activity'
            defaultMessage='View deployment activity'
          />
        </CuiRouterLinkButtonEmpty>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default DeploymentGettingStartedFailed
