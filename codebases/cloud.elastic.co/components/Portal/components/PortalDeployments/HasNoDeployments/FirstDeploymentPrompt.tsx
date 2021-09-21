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
import {
  EuiButton,
  EuiEmptyPrompt,
  EuiHorizontalRule,
  EuiListGroup,
  EuiListGroupItem,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui'

import { CuiRouterLinkButton } from '../../../../../cui/LinkButton'
import { createDeploymentUrl } from '../../../../../lib/urlBuilder'

import firstDeploymentIllustration from '../../../../../files/first-deployment.svg'

interface Props {
  inTrial: boolean
  trialStarted: boolean
  unSubscribed: boolean
}

const featureList = [
  {
    id: 'no-deployment-state.cloud-hosting-on-platforms',
    defaultMessage: 'Cloud hosting on AWS, GCP or Azure',
  },
  {
    id: 'no-deployment-state.solutions',
    defaultMessage: 'Logs, metrics, and APM in one place',
  },
  {
    id: 'no-deployment-state.included-with-deployments',
    defaultMessage: 'Includes machine learning, security, and more',
  },
  {
    id: 'no-deployment-state.one-click-upgrades',
    defaultMessage: 'One-click upgrades with no downtime',
  },
  {
    id: 'no-deployment-state.same-day-new-version-release',
    defaultMessage: 'Same-day new version releases',
  },
  {
    id: 'no-deployment-state.monitoring',
    defaultMessage: 'Monitored 24/7',
  },
]

const FirstDeploymentPrompt: FunctionComponent<Props> = ({
  inTrial,
  trialStarted,
  unSubscribed,
}) => {
  const isCreateDeployment = !inTrial || trialStarted
  return (
    <Fragment>
      <EuiEmptyPrompt
        className='no-deployment-state-prompt'
        iconType={firstDeploymentIllustration}
        title={
          <h3>
            {isCreateDeployment ? (
              <FormattedMessage
                id='no-deployment-state.create-first-deployment'
                defaultMessage='Create your first deployment'
              />
            ) : (
              <FormattedMessage
                id='no-deployment-state.get-started-with-elasticsearch-service'
                defaultMessage='Get started with Elasticsearch Service'
              />
            )}
          </h3>
        }
        body={
          <p>
            <FormattedMessage
              id='no-deployment-state.create-first-deployment-info'
              defaultMessage='Create your first deployment to manage an Elasticsearch cluster on the cloud platform of your choice. Add additional Elastic products to your deployment like Kibana, machine learning, or APM.'
            />
          </p>
        }
        actions={[getCreateDeploymentButton(unSubscribed, isCreateDeployment)]}
      />
      {!isCreateDeployment && (
        <Fragment>
          <EuiSpacer size='s' />
          <EuiHorizontalRule margin='xs' />
          <EuiSpacer size='xs' />
          <div className='no-deployment-state-get-started-footer'>
            <EuiTitle size='xxs'>
              <h3>
                <FormattedMessage
                  id='no-deployment-state.platform-features'
                  defaultMessage='Platform features'
                />
              </h3>
            </EuiTitle>
            <EuiListGroup flush={false} bordered={false}>
              {featureList.map((feature) => (
                <EuiListGroupItem
                  className='no-deployment-state-features-list-item'
                  key={feature.id}
                  label={<FormattedMessage {...feature} />}
                  iconType='check'
                  size='s'
                />
              ))}
            </EuiListGroup>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

const getCreateDeploymentButton = (unSubscribed, isCreateDeployment) => {
  if (unSubscribed) {
    return (
      <EuiButton
        className='create-deployment-button'
        data-test-id='create-deployment-link'
        href={createDeploymentUrl()}
        fill={true}
        isDisabled={unSubscribed}
      >
        {getCreateDeploymentButtonText(isCreateDeployment)}
      </EuiButton>
    )
  }

  return (
    <CuiRouterLinkButton
      className='create-deployment-button'
      data-test-id='create-deployment-link'
      to={createDeploymentUrl()}
      fill={true}
    >
      {getCreateDeploymentButtonText(isCreateDeployment)}
    </CuiRouterLinkButton>
  )
}

const getCreateDeploymentButtonText = (isCreateDeployment) => {
  if (isCreateDeployment) {
    return (
      <FormattedMessage
        id='no-deployment-state.create-deployment'
        defaultMessage='Create deployment'
      />
    )
  }

  return (
    <span data-test-id='trial-create-deployment'>
      <FormattedMessage
        id='no-deployment-state.start-trial'
        defaultMessage='Start your free trial'
      />
    </span>
  )
}

export default FirstDeploymentPrompt
