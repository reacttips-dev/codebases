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
import { EuiText, EuiFlexItem, EuiFlexGroup, EuiButtonEmpty, EuiSpacer } from '@elastic/eui'

import DeploymentGettingStartedTitle from './DeploymentGettingStartedTitle'

import StackElasticCredentials from '../../StackElasticCredentials'

import { StackDeployment } from '../../../types'
import { DeploymentTemplateInfoV2 } from '../../../lib/api/v1/types'

import './deploymentGettingStarted.scss'

type Props = {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
  onContinue: () => void
}

const DeploymentGettingStartedCredentials: FunctionComponent<Props> = ({
  deployment,
  deploymentTemplate,
  onContinue,
}) => {
  const title = (
    <FormattedMessage
      id='deployment-waiting-experience.title.save-creds'
      defaultMessage='Save the deployment credentials'
    />
  )

  return (
    <EuiFlexGroup direction='column'>
      <EuiFlexItem>
        <DeploymentGettingStartedTitle title={title} />
        <EuiText textAlign='center' size='s' color='subdued'>
          <FormattedMessage
            id='deployment-waiting-experience.sub-title-part-one'
            defaultMessage='These root credentials are shown only once.'
          />
          <br />
          <FormattedMessage
            id='deployment-waiting-experience.sub-title-part-two'
            defaultMessage='They provide super user access to your deployment. Keep them safe.'
          />
        </EuiText>
      </EuiFlexItem>

      <EuiFlexItem>
        <EuiSpacer size='m' />
        <StackElasticCredentials
          onlyShowCredentials={true}
          deploymentTemplate={deploymentTemplate}
          deployment={deployment}
          onDownloadCredentials={() => onContinue()}
        />
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <EuiSpacer size='m' />
        <EuiButtonEmpty data-test-id='continue-without-download' onClick={() => onContinue()}>
          <FormattedMessage defaultMessage='Skip' id='deployment-waiting-experience.skip' />
        </EuiButtonEmpty>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default DeploymentGettingStartedCredentials
